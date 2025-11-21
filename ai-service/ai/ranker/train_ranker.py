import os
import json
import ast
import numpy as np
import pandas as pd
import xgboost as xgb
from pathlib import Path
from tqdm import tqdm

from ai.embeddings.embedder import get_embedder
from ai.skills.skill_normalizer import SkillNormalizer
from ai.features.feature_builder import FeatureBuilder
from ai.config import DATA_DIR, TRAINED_MODELS_DIR, RANKER_PATH


def parse_features(s: str) -> np.ndarray:
    return np.array(json.loads(s), dtype=float)


def _parse_list(cell):
    if isinstance(cell, list):
        return cell
    if isinstance(cell, str):
        # Try to parse stringified lists first
        try:
            val = ast.literal_eval(cell)
            if isinstance(val, list):
                return val
        except Exception:
            # Fallback: split on commas
            return [v.strip() for v in cell.split(",") if v.strip()]
    return []


def load_local_datasets():
    # Prefer enriched exports if present
    resumes_path = Path("data/enriched_resumes.csv")
    jobs_path = Path("data/enriched_jobs.csv")

    if resumes_path.exists():
        resumes = pd.read_csv(resumes_path)
        print(f"Loaded enriched resumes: {len(resumes)}")
    else:
        resumes = pd.read_csv("UpdatedResumeDataSet.csv")

    if jobs_path.exists():
        jobs = pd.read_csv(jobs_path)
        print(f"Loaded enriched jobs: {len(jobs)}")
    else:
        jobs = pd.read_csv("job_title_des.csv")   # use real job dataset

    resumes = resumes.dropna(subset=["Resume"])
    jobs = jobs.dropna(subset=["Job Description"])

    print(f"Loaded {len(resumes)} resumes, {len(jobs)} O*NET jobs")
    return resumes, jobs


def build_interactions_from_structured_csv():
    """
    Build interactions directly from resume_data_for_ranking.csv if present.
    Treat each row as a (student, job) pair using the provided matched_score.
    Grouping is done by job_position_name for ranking input.
    """
    data_path = Path("resume_data_for_ranking.csv")
    if not data_path.exists():
        return None

    print(f"Loading structured ranking data from {data_path} ...")
    df = pd.read_csv(data_path)
    df = df.dropna(subset=["matched_score"])

    skill_norm = SkillNormalizer()
    embedder = get_embedder()
    fb = FeatureBuilder()

    interactions = []

    for idx, row in tqdm(df.iterrows(), total=len(df), desc="Ranking rows"):
        # student info
        resume_text = " ".join([
            str(row.get("career_objective", "") or ""),
            str(row.get("responsibilities", "") or ""),
        ]).strip()

        stu_skills = skill_norm.normalize(_parse_list(row.get("skills")))
        positions = _parse_list(row.get("positions"))
        education = _parse_list(row.get("degree_names")) + _parse_list(row.get("major_field_of_studies"))
        experience_entries = _parse_list(row.get("start_dates"))
        responsibilities_text = str(row.get("responsibilities", "") or "")

        gpa_val = 0.0
        try:
            gpa_val = float(str(row.get("educational_results", "")).replace("%", "").strip() or 0.0)
        except Exception:
            gpa_val = 0.0

        student_obj = {
            "resume_text": resume_text,
            "skills": stu_skills,
            "branch": None,
            "domains": [],
            "gpa": gpa_val,
            "experience": experience_entries,
            "education": education,
            "positions": positions,
            "responsibilities": responsibilities_text,
        }

        # job info
        job_title = str(row.get("job_position_name", "") or "")
        job_desc = " ".join([
            str(row.get("educationaL_requirements", "") or ""),
            str(row.get("experiencere_requirement", "") or ""),
            str(row.get("responsibilities.1", "") or ""),
        ]).strip()

        job_skill_cols = []
        job_skill_cols.extend(_parse_list(row.get("skills_required")))
        # related_skils_in_job may be list of lists
        related = _parse_list(row.get("related_skils_in_job"))
        for r in related:
            if isinstance(r, list):
                job_skill_cols.extend(r)
            elif isinstance(r, str):
                job_skill_cols.append(r)

        job_skills = skill_norm.normalize(job_skill_cols)
        job_tools = []  # not present in dataset

        student_vec = embedder.embed(resume_text)
        job_vec = embedder.embed(job_title + ". " + job_desc)

        features, _ = fb.build(
            student=student_obj,
            job={
                "title": job_title,
                "description": job_desc,
                "skills": job_skills,
                "skills_required": job_skills,
                "related_skills_in_job": related,
                "company": "",
                "tools": job_tools,
                "branch": None,
                "domain": None,
                "domains": [],
                "education_requirement": row.get("educationaL_requirements", ""),
                "experience_requirement": row.get("experiencere_requirement", ""),
                "responsibilities_text": row.get("responsibilities.1", ""),
            },
            student_vec=student_vec,
            job_vec=job_vec,
        )

        interactions.append({
            "student_id": job_title or f"group_{idx}",
            "features": json.dumps(features.tolist()),
            "label": float(row.get("matched_score", 0) or 0),
        })

    if not interactions:
        return None

    out_df = pd.DataFrame(interactions)
    os.makedirs(DATA_DIR, exist_ok=True)
    out_df.to_csv(Path(DATA_DIR) / "interactions.csv", index=False)
    print(f"Built interactions from structured CSV: {len(out_df)} rows")
    return out_df


def generate_interactions(num_students=30, num_jobs=80):
    skill_norm = SkillNormalizer()
    embedder = get_embedder()
    fb = FeatureBuilder()

    resumes, jobs = load_local_datasets()

    students = resumes.sample(num_students, replace=False)
    jobs = jobs.sample(num_jobs, replace=False)

    interactions = []

    for _, stu in tqdm(students.iterrows(), total=len(students), desc="Students"):
        stu_text = stu["Resume"]

        # Extract skills/tools/projects from resume text or enriched columns
        skills = stu.get("Skills", "")
        if pd.isna(skills) or not str(skills).strip():
            stu_skills = skill_norm.extract_from_text(stu_text)
        else:
            stu_skills = [s.strip() for s in str(skills).split(",") if s.strip()]
        stu_skills = skill_norm.normalize(stu_skills)

        projects = []
        proj_count = int(stu.get("ProjectCount", 0) or 0)
        if proj_count > 0:
            projects = ["project"] * proj_count
        elif "project" in stu_text.lower():
            projects.append("project placeholder")

        experience_entries = []
        exp_count = int(stu.get("ExperienceCount", 0) or 0)
        if exp_count > 0:
            experience_entries = ["exp"] * exp_count

        stu_vec = embedder.embed(stu_text)
        student_id = f"stu_{np.random.randint(1000, 9999)}"

        student_obj = {
            "resume_text": stu_text,
            "skills": stu_skills,
            "branch": str(stu.get("Branch", "")).strip().lower() or None,
            "domains": [],
            "gpa": float(stu.get("CGPA", 0) or 0),
            "projects": projects,
            "experience": experience_entries,
            "education": [],
        }

        for _, job in jobs.iterrows():
            job_text = job["Job Description"]

            job_skills_raw = job.get("Skills", "")
            if isinstance(job_skills_raw, str) and job_skills_raw.strip():
                job_skills = [s.strip() for s in job_skills_raw.split(",") if s.strip()]
            else:
                job_skills = skill_norm.extract_from_text(job_text)
            job_skills = skill_norm.normalize(job_skills)

            job_tools_raw = job.get("Tools", "")
            if isinstance(job_tools_raw, str) and job_tools_raw.strip():
                job_tools = [t.strip() for t in job_tools_raw.split(",") if t.strip()]
            else:
                job_tools = []

            job_vec = embedder.embed(job_text)

            job_obj = {
                "title": job.get("Job Title", ""),
                "description": job_text,
                "skills": job_skills,
                "company": "",
                "tools": job_tools,
                "branch": str(job.get("Branch", "") or "").strip().lower() or None,
                "domain": str(job.get("Domain", "") or "").strip().lower() or None,
                "domains": json.loads(job.get("Domains", "[]")) if isinstance(job.get("Domains", ""), str) else [],
            }

            features, _ = fb.build(student_obj, job_obj, stu_vec, job_vec)
            sim = features[0]

            if sim > 0.70:
                label = 3
            elif sim > 0.50:
                label = 2
            elif sim > 0.30:
                label = 1
            else:
                label = 0

            interactions.append({
                "student_id": student_id,
                "features": json.dumps(features.tolist()),
                "label": label
            })

    df = pd.DataFrame(interactions)
    os.makedirs(DATA_DIR, exist_ok=True)
    df.to_csv(Path(DATA_DIR) / "interactions.csv", index=False)

    print(f"\nGenerated interactions.csv with {len(df)} rows")
    return df


def train_ranker(df):
    print("\nTraining XGBRegressor on matched_score...")

    X = np.vstack(df["features"].apply(parse_features).values)
    y = df["label"].astype(float).values

    model = xgb.XGBRegressor(
        objective="reg:squarederror",
        learning_rate=0.1,
        n_estimators=400,
        max_depth=6,
        colsample_bytree=0.9,
        subsample=0.9,
        tree_method="hist",
        random_state=42,
    )

    model.fit(X, y)

    os.makedirs(TRAINED_MODELS_DIR, exist_ok=True)
    model.save_model(RANKER_PATH)

    print(f"Saved ranker model → {RANKER_PATH}")


if __name__ == "__main__":
    df = build_interactions_from_structured_csv()
    if df is None:
        df = generate_interactions(num_students=30, num_jobs=80)
    train_ranker(df)
