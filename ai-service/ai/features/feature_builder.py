
import re
import numpy as np
from typing import Dict, List, Tuple


def cosine_similarity(a, b):
    if a is None or b is None:
        return 0.0
    denom = float(np.linalg.norm(a) * np.linalg.norm(b))
    if denom == 0.0:
        return 0.0
    return float(np.dot(a, b) / denom)


def _normalize_skill(val: str) -> str:
    """
    Normalize skill tokens to improve overlap matching.
    Strips punctuation/whitespace and lowercases; keeps alphanumerics only.
    Examples: "React.js" -> "reactjs", "Node.js" -> "nodejs", "AWS" -> "aws"
    """
    if not isinstance(val, str):
        return ""
    return re.sub(r"[^a-z0-9]+", "", val.lower()).strip()


class FeatureBuilder:
    """
    Builds numerical feature vector + explanation reasons for (student, job).
    """

    @staticmethod
    def _infer_domains_from_text(text: str) -> List[str]:
        """Heuristic domain inference from free text with weighted keyword counts."""
        if not text:
            return []
        t = text.lower()
        domain_map = {
            "web": ["frontend", "backend", "full stack", "full-stack", "web", "react", "next", "angular", "vue"],
            "mobile": ["mobile", "android", "ios", "flutter", "react native", "react-native", "jetpack", "swiftui"],
            "cloud": ["cloud", "devops", "aws", "azure", "gcp", "kubernetes", "docker", "ci/cd"],
            "data": ["data", "machine learning", "ml", "analytics", "ai", "nlp", "pandas", "numpy"],
        }
        scores = {}
        for dom, kws in domain_map.items():
            scores[dom] = sum(1 for k in kws if k in t)
        # return domains with positive score, sorted by score desc
        return [d for d, sc in sorted(scores.items(), key=lambda kv: kv[1], reverse=True) if sc > 0]

    @staticmethod
    def _infer_domains_from_skills(skills: List[str]) -> List[str]:
        """Heuristic domain inference from skill list."""
        if not skills:
            return []
        s = [skill.lower() for skill in skills]
        domain_map = {
            "web": ["react", "next", "vue", "angular", "tailwind", "css", "html", "javascript", "typescript", "node", "express"],
            "mobile": ["react native", "flutter", "swift", "kotlin", "android", "ios"],
            "cloud": ["aws", "azure", "gcp", "kubernetes", "docker", "terraform", "ci/cd"],
            "data": ["pandas", "numpy", "sklearn", "scikit", "tensorflow", "pytorch", "ml", "nlp"],
        }
        scores = {}
        for dom, kws in domain_map.items():
            scores[dom] = sum(1 for skill in s for kw in kws if kw in skill)
        return [d for d, sc in sorted(scores.items(), key=lambda kv: kv[1], reverse=True) if sc > 0]

    @staticmethod
    def loose_match(a: str, b: str) -> bool:
        """
        Extended soft matching for skills:
        - exact match
        - substring either way
        - space/underscore-insensitive equality
        - prefix match either way
        - first-token match
        """
        if not a or not b:
            return False

        a_norm = a.replace("_", " ").strip()
        b_norm = b.replace("_", " ").strip()

        if a_norm == b_norm:
            return True
        if a_norm in b_norm or b_norm in a_norm:
            return True
        if a_norm.replace(" ", "") == b_norm.replace(" ", ""):
            return True
        if b_norm.startswith(a_norm) or a_norm.startswith(b_norm):
            return True

        # first-word match for multi-token skills
        a_first = a_norm.split()[0] if a_norm.split() else ""
        b_first = b_norm.split()[0] if b_norm.split() else ""
        return bool(a_first) and a_first == b_first

    def build(
        self,
        student: Dict,
        job: Dict,
        student_vec,
        job_vec
    ) -> Tuple[np.ndarray, List[str]]:

        reasons: List[str] = []

        # semantic similarity
        sim = cosine_similarity(student_vec, job_vec)
        if sim > 0.55:
            reasons.append("Strong semantic similarity with the job description.")
        elif sim > 0.35:
            reasons.append("Moderate semantic match to the job description.")
        elif sim > 0.20:
            reasons.append("Weak semantic similarity to the job description.")

        # skill overlap with normalization + loose containment
        raw_s_skills = [s for s in student.get("skills", []) if isinstance(s, str)]
        raw_j_skills = [s for s in job.get("skills", []) if isinstance(s, str)]

        norm_s = { _normalize_skill(s): s for s in raw_s_skills if _normalize_skill(s) }
        norm_j = { _normalize_skill(s): s for s in raw_j_skills if _normalize_skill(s) }

        overlap = set()
        for ns, s_raw in norm_s.items():
            for nj, j_raw in norm_j.items():
                if not ns or not nj:
                    continue
                if self.loose_match(ns, nj):
                    overlap.add(j_raw)

        if overlap:
            reasons.append("Matching skills: " + ", ".join(sorted(overlap)))

        denom = max(len(norm_j), 1)
        skill_overlap_ratio = len(overlap) / denom
        # Soften penalty when lists differ; boost partial overlap.
        skill_overlap_ratio = skill_overlap_ratio ** 0.5

        # branch match
        branch_match = 0.0
        if job.get("branch") and student.get("branch"):
            jb = job["branch"].lower()
            sb = student["branch"].lower()
            if jb in sb or sb in jb:
                branch_match = 1.0
                reasons.append("Your branch matches the preferred branch.")

        # domain match
        domain_match = 0.0
        job_text = f"{job.get('title','')} {job.get('description','')}"
        job_domains = [d.lower() for d in job.get("domains", [])] if job.get("domains") else []
        if not job_domains:
            job_domains = self._infer_domains_from_skills(job.get("skills", []))
        if not job_domains:
            job_domains = self._infer_domains_from_text(job_text)

        student_domains = [d.lower() for d in student.get("domains", [])]
        if not student_domains:
            student_domains = self._infer_domains_from_skills(student.get("skills", []))
        if not student_domains:
            student_domains = self._infer_domains_from_text(student.get("resume_text", ""))

        shared_domains = set(job_domains) & set(student_domains)
        if shared_domains:
            domain_match = 1.0
            # pick one for messaging
            dom = sorted(shared_domains)[0]
            reasons.append(f"This role matches your preferred domain: {dom}.")

        # experience / education signals (reason-only, no feature slots)
        exp_entries = student.get("experience") or []
        edu_entries = student.get("education") or []
        job_text_lower = f"{job.get('title','')} {job.get('description','')}".lower()

        if exp_entries:
            reasons.append("Your resume includes prior experience.")
        else:
            reasons.append("No experience details were found in your profile.")

        if edu_entries:
            # rough degree hint check
            degree_match = any(
                kw in job_text_lower for kw in ["bachelor", "master", "phd", "degree"]
            )
            if degree_match:
                reasons.append("Education details provided for degree-driven role.")
            else:
                reasons.append("Education details are present in your profile.")
        else:
            reasons.append("No education details were provided.")

        # GPA normalized (0-10 scale)
        gpa = float(student.get("gpa") or 0.0)
        gpa_norm = min(max(gpa / 10.0, 0.0), 1.0)

        features = np.array([
            sim,                 # 0
            skill_overlap_ratio, # 1
            branch_match,        # 2
            domain_match,        # 3
            gpa_norm             # 4
        ], dtype=float)

        # Fallback negative explanations when signal is weak; ensure non-empty reasons.
        if not reasons:
            if not raw_s_skills:
                reasons.append("No skills were extracted from your resume.")
            if not raw_j_skills:
                reasons.append("This job listing has no skills data.")
            if sim < 0.3:
                reasons.append("Low semantic similarity between your resume and this job.")
            if raw_s_skills and raw_j_skills and not overlap:
                reasons.append("No matching skills found between your profile and this job.")
            if not reasons:
                reasons.append("No highlights available for this match.")

        print("\n====== DEBUG: FeatureBuilder ======")
        print("Student skills:", student.get("skills"))
        print("Job skills:", job.get("skills"))
        print("Normalized student skills:", norm_s)
        print("Normalized job skills:", norm_j)
        print("Overlap:", overlap)
        print("Semantic similarity:", sim)
        print("Feature vector:", features)
        print("Reasons:", reasons)
        print("===================================\n")

        return features, reasons
