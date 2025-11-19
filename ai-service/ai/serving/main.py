from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel, Field
from typing import List, Optional, Any
import numpy as np

from ai.logging_config import setup_logging
from ai.parsing.text_extractor import ResumeTextExtractor
from ai.parsing.resume_gemini_parser import ResumeGeminiParser
from ai.parsing.resume_cleaner import ResumeCleaner
from ai.skills.skill_normalizer import SkillNormalizer
from ai.embeddings.embedder import get_embedder
from ai.features.feature_builder import FeatureBuilder
from ai.ranker.simple_ranker import SimpleRanker
from ai.ranker.xgb_ranker import XGBRankerWrapper


logger = setup_logging()
app = FastAPI(title="Placement AI Service (Gemini-based)")


# ---------- Models ----------

class Student(BaseModel):
    id: str
    resume_text: str
    skills: List[str] = Field(default_factory=list)
    gpa: Optional[float] = 0.0
    branch: Optional[str] = None
    domains: List[str] = Field(default_factory=list)
    experience: List[Any] = Field(default_factory=list)
    education: List[Any] = Field(default_factory=list)


class Job(BaseModel):
    id: str
    title: str
    description: str
    skills: List[str] = Field(default_factory=list)
    branch: Optional[str] = None
    domain: Optional[str] = None
    company: Optional[str] = None


class RecommendRequest(BaseModel):
    student: Student
    jobs: List[Job]


# ---------- Setup components ----------

extractor = ResumeTextExtractor()
gemini_parser = ResumeGeminiParser()
cleaner = ResumeCleaner()
skill_normalizer = SkillNormalizer()
embedder = get_embedder()
feature_builder = FeatureBuilder()
simple_ranker = SimpleRanker()
xgb_ranker = XGBRankerWrapper()


# ---------- Routes ----------

@app.get("/health")
def health():
    return {
        "status": "ok",
        "ranker_loaded": xgb_ranker.available,
    }


@app.post("/parse_resume")
async def parse_resume(file: UploadFile = File(...)):
    """
    1) Accept PDF
    2) Extract text
    3) Use Gemini to parse structured data
    4) Clean + normalize skills
    5) Return an embedding of the raw resume text
    """
    pdf_bytes = await file.read()
    raw_text = extractor.extract_text(pdf_bytes)
    logger.info("Extracted resume text length: %d", len(raw_text))

    parsed = gemini_parser.parse(raw_text)
    parsed = cleaner.clean(parsed)
    parsed["skills"] = skill_normalizer.normalize(parsed.get("skills", []))
    embedding = embedder.embed(raw_text)

    return {
        "raw_text": raw_text,
        "parsed": parsed,
        "embedding": embedding.tolist() if hasattr(embedding, "tolist") else embedding,
    }


@app.post("/recommend")
def recommend(req: RecommendRequest):
    """
    Returns ranked jobs for a given student.
    Uses embeddings + features + XGB (if available) with correct normalization.
    """

    student = req.student.dict()
    student["skills"] = skill_normalizer.normalize(student.get("skills", []))

    # ---- Student embedding ----
    student_vec = embedder.embed(student["resume_text"])

    feature_rows = []
    meta = []

    for job in req.jobs:
        job_dict = job.dict()

        # Normalize job skills
        job_dict["skills"] = skill_normalizer.normalize(job_dict.get("skills", []))

        # Build job text for embedding
        job_text = (
            f"{job_dict['title']}. {job_dict['description']}. "
            f"Required skills: {', '.join(job_dict['skills'])}. "
            f"Company: {job_dict.get('company','')}."
        )

        # Fallback extraction when job skills are missing
        if not job_dict["skills"]:
            extracted_job_skills = skill_normalizer.extract_from_text(job_text)
            job_dict["skills"] = skill_normalizer.normalize(extracted_job_skills)
            job_text = (
                f"{job_dict['title']}. {job_dict['description']}. "
                f"Required skills: {', '.join(job_dict['skills'])}. "
                f"Company: {job_dict.get('company','')}."
            )
        job_vec = embedder.embed(job_text)

        # Build features
        features, reasons = feature_builder.build(
            student=student,
            job=job_dict,
            student_vec=student_vec,
            job_vec=job_vec,
        )

        print("\n------ DEBUG RECOMMEND ENTRY ------")
        print("Job:", job_dict.get("title"))
        print("Raw features:", features)
        print("Reasons:", reasons)
        print("Job skills:", job_dict.get("skills"))
        print("Student skills:", student.get("skills"))
        print("-----------------------------------\n")

        feature_rows.append(features)
        meta.append({
            "job_id": job_dict["id"],
            "title": job_dict["title"],
            "company": job_dict.get("company", ""),
            "reasons": reasons
        })

    X = np.vstack(feature_rows)

    # -------------------------
    # FIX 1: Proper XGB usage
    # -------------------------
    use_xgb = xgb_ranker.available
    scores = None

    print("DEBUG: Using XGB:", use_xgb)

    if use_xgb:
        try:
            scores = xgb_ranker.predict(X).astype(float)

            print("DEBUG: XGB raw scores:", scores)

            # Only disable when truly invalid
            if not np.isfinite(scores).all():
                use_xgb = False

        except Exception as e:
            print("XGB ranker error → fallback:", e)
            use_xgb = False

    # -------------------------
    # FIX 2: Fallback to simple model
    # -------------------------
    if not use_xgb:
        scores = np.array([simple_ranker.score(f) for f in feature_rows], dtype=float)
        print("DEBUG: Simple ranker scores:", scores)

    # -------------------------
    # FIX 3: Normalize scores 0-100
    # -------------------------
    mn, mx = scores.min(), scores.max()

    if mx - mn < 1e-9:
        scaled = np.ones_like(scores) * 0.5  # flat
    else:
        scaled = (scores - mn) / (mx - mn)

    match_percent = (scaled * 100)
    print("DEBUG: Final match percents:", match_percent)

    # -------------------------
    # Build final output
    # -------------------------
    results = []
    for i, entry in enumerate(meta):
        results.append({
            "job_id": entry["job_id"],
            "title": entry["title"],
            "company": entry["company"],
            "score": float(scores[i]),
            "match_percent": float(match_percent[i]),
            "reasons": entry["reasons"]
        })

    # Sort best first
    results.sort(key=lambda r: r["score"], reverse=True)

    return {
        "student_id": req.student.id,
        "used_ranker": use_xgb,
        "recommendations": results
    }

