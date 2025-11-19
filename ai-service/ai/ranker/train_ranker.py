import os
import json
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


def load_local_datasets():
    resumes = pd.read_csv("UpdatedResumeDataSet.csv")
    jobs = pd.read_csv("job_title_des.csv")   # use real job dataset

    resumes = resumes.dropna(subset=["Resume"])
    jobs = jobs.dropna(subset=["Job Description"])

    print(f"Loaded {len(resumes)} resumes, {len(jobs)} O*NET jobs")
    return resumes, jobs


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

        skills = stu.get("Skills", "")
        if pd.isna(skills) or not str(skills).strip():
            stu_skills = skill_norm.extract_from_text(stu_text)
        else:
            stu_skills = [s.strip() for s in str(skills).split(",")]

        stu_skills = skill_norm.normalize(stu_skills)

        stu_vec = embedder.embed(stu_text)
        student_id = f"stu_{np.random.randint(1000, 9999)}"

        student_obj = {
            "resume_text": stu_text,
            "skills": stu_skills,
            "branch": str(stu.get("Branch", "")).strip().lower() or None,
            "domains": [],
            "gpa": float(stu.get("CGPA", 0) or 0),
        }

        for _, job in jobs.iterrows():
            job_text = job["Job Description"]

            job_skills_raw = job.get("Skills", "")
            if isinstance(job_skills_raw, str) and job_skills_raw.strip():
                job_skills = [s.strip() for s in job_skills_raw.split(",")]
            else:
                job_skills = skill_norm.extract_from_text(job_text)
            job_skills = skill_norm.normalize(job_skills)

            job_vec = embedder.embed(job_text)

            job_obj = {
                "title": job.get("Job Title", ""),
                "description": job_text,
                "skills": job_skills,
                "company": "",
                "tools": job.get("Tools", ""),
                "branch": str(job.get("Branch", "") or "").strip().lower() or None,
                "domain": str(job.get("Domain", "") or "").strip().lower() or None,
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
    print("\nTraining XGBRanker...")

    X = np.vstack(df["features"].apply(parse_features).values)
    y = df["label"].astype(int).values

    groups = df.groupby("student_id").size().to_numpy()

    model = xgb.XGBRanker(
        objective="rank:pairwise",
        learning_rate=0.15,
        n_estimators=250,
        max_depth=6,
        colsample_bytree=0.9,
        subsample=0.9,
        tree_method="hist",
        random_state=42,
    )

    model.fit(X, y, group=groups)

    os.makedirs(TRAINED_MODELS_DIR, exist_ok=True)
    model.save_model(RANKER_PATH)

    print(f"Saved ranker model → {RANKER_PATH}")


if __name__ == "__main__":
    df = generate_interactions(num_students=30, num_jobs=80)
    train_ranker(df)
