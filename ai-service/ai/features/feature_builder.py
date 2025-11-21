
import re
import numpy as np
from typing import Dict, List, Tuple
from ai.features.domain_map import DOMAIN_KEYWORDS_TEXT, DOMAIN_KEYWORDS_SKILLS


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
        scores = {}
        for dom, kws in DOMAIN_KEYWORDS_TEXT.items():
            scores[dom] = sum(1 for k in kws if k in t)
        # return domains with positive score, sorted by score desc
        return [d for d, sc in sorted(scores.items(), key=lambda kv: kv[1], reverse=True) if sc > 0]

    @staticmethod
    def _infer_domains_from_skills(skills: List[str]) -> List[str]:
        """Heuristic domain inference from skill list."""
        if not skills:
            return []
        s = [skill.lower() for skill in skills]
        scores = {}
        for dom, kws in DOMAIN_KEYWORDS_SKILLS.items():
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

        # Helpers for list cleaning
        def _clean_list(val):
            if not val:
                return []
            if isinstance(val, str):
                return [v.strip() for v in val.split(",") if v.strip()]
            if isinstance(val, list):
                return [str(v).strip() for v in val if str(v).strip()]
            return []

        raw_s_skills = [s for s in student.get("skills", []) if isinstance(s, str)]
        raw_req_skills = _clean_list(job.get("skills_required") or job.get("skills") or [])
        raw_related_skills = _clean_list(job.get("related_skills_in_job") or [])
        raw_job_skills = _clean_list(job.get("skills") or [])
        raw_job_tools = _clean_list(job.get("tools") or [])

        norm_s = { _normalize_skill(s): s for s in raw_s_skills if _normalize_skill(s) }
        norm_req = { _normalize_skill(s): s for s in raw_req_skills if _normalize_skill(s) }
        norm_related = { _normalize_skill(s): s for s in raw_related_skills if _normalize_skill(s) }
        norm_tools = { _normalize_skill(s): s for s in raw_job_tools if _normalize_skill(s) }
        norm_job = { _normalize_skill(s): s for s in raw_job_skills if _normalize_skill(s) }

        def _coverage(src: set, tgt: set) -> float:
            if not tgt:
                return 0.0
            hits = sum(1 for t in tgt if any(self.loose_match(t, s) for s in src))
            return (hits / len(tgt)) ** 0.5

        required_cov = _coverage(set(norm_s.keys()), set(norm_req.keys()))
        related_cov = _coverage(set(norm_s.keys()), set(norm_related.keys()))
        tool_overlap = _coverage(set(norm_s.keys()), set(norm_tools.keys()))
        missing_required = 0.0
        if norm_req:
            matched = sum(1 for t in norm_req if any(self.loose_match(t, s) for s in norm_s))
            missing_required = max(0.0, (len(norm_req) - matched) / len(norm_req))
        # general skill overlap as backup
        general_overlap = _coverage(set(norm_s.keys()), set(norm_job.keys()))
        if matched := [norm_req[k] for k in norm_req if any(self.loose_match(k, s) for s in norm_s)]:
            reasons.append("Matching required skills: " + ", ".join(sorted(set(matched))))
        elif general_overlap > 0:
            reasons.append("Some skills match the role requirements.")

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

        # title overlap (job title vs resume text + skills)
        title_tokens = [tok for tok in re.split(r"[^a-z0-9]+", job.get("title", "").lower()) if tok]
        resume_text = student.get("resume_text", "").lower()
        title_hits = sum(1 for t in title_tokens if t and (t in resume_text or t in " ".join(norm_s.keys())))
        title_overlap = min(title_hits / len(title_tokens), 1.0) if title_tokens else 0.0
        if title_overlap >= 0.5:
            reasons.append("Your profile mentions key terms from the job title.")

        # role title match (student positions vs job title)
        positions = _clean_list(student.get("positions") or [])
        role_match = 0.0
        if positions and title_tokens:
            pos_text = " ".join(positions).lower()
            pos_tokens = [tok for tok in re.split(r"[^a-z0-9]+", pos_text) if tok]
            hits = sum(1 for t in title_tokens if t in pos_tokens)
            role_match = min(hits / len(title_tokens), 1.0)

        # education match
        edu_entries = student.get("education") or []
        edu_text = " ".join(str(e) for e in edu_entries).lower()
        edu_req = str(job.get("education_requirement", "") or job.get("educationaL_requirements", "") or "").lower()
        degree_match = 0.0
        if edu_req and edu_entries:
            degree_match = 1.0 if any(tok in edu_text for tok in edu_req.split()) else 0.0

        # experience match (count-based vs requested years in text)
        exp_entries = student.get("experience") or []
        exp_req_text = str(job.get("experience_requirement", "") or job.get("experiencere_requirement", "") or "").lower()
        exp_match = 0.0
        req_years = 0.0
        m = re.search(r"(\d+)\s*(\+)?\s*(year|yr)", exp_req_text)
        if m:
            req_years = float(m.group(1))
        if req_years > 0:
            exp_match = min(len(exp_entries) / max(req_years, 1.0), 1.0)
        elif exp_entries:
            exp_match = 1.0

        # responsibilities overlap (student responsibilities vs job responsibilities text)
        job_resp = str(job.get("responsibilities_text", "") or "")
        stud_resp = str(student.get("responsibilities", "") or "")
        resp_overlap = 0.0
        if job_resp and stud_resp:
            job_tokens = set(re.split(r"[^a-z0-9]+", job_resp.lower()))
            stud_tokens = set(re.split(r"[^a-z0-9]+", stud_resp.lower()))
            job_tokens.discard("")
            stud_tokens.discard("")
            if job_tokens:
                resp_overlap = len(job_tokens & stud_tokens) / len(job_tokens)

        # GPA normalized (0-10 scale)
        gpa = float(student.get("gpa") or 0.0)
        gpa_norm = min(max(gpa / 10.0, 0.0), 1.0)

        features = np.array([
            sim,                 # 0
            required_cov,        # 1
            related_cov,         # 2
            tool_overlap,        # 3
            missing_required,    # 4 (penalty; weight negative in simple ranker)
            domain_match,        # 5
            title_overlap,       # 6
            role_match,          # 7
            degree_match,        # 8
            exp_match,           # 9
            gpa_norm,            # 10
        ], dtype=float)

        # Fallback negative explanations when signal is weak; ensure non-empty reasons.
        if not reasons:
            if not raw_s_skills:
                reasons.append("No skills were extracted from your resume.")
            if not raw_job_skills:
                reasons.append("This job listing has no skills data.")
            if sim < 0.3:
                reasons.append("Low semantic similarity between your resume and this job.")
            if raw_s_skills and raw_job_skills and required_cov == 0.0 and general_overlap == 0.0:
                reasons.append("No matching skills found between your profile and this job.")
            if not reasons:
                reasons.append("No highlights available for this match.")

        print("\n====== DEBUG: FeatureBuilder ======")
        print("Student skills:", student.get("skills"))
        print("Job skills:", job.get("skills"))
        print("Normalized student skills:", norm_s)
        print("Required skills norm:", norm_req)
        print("Related skills norm:", norm_related)
        print("Tool norm:", norm_tools)
        print("General job skills norm:", norm_job)
        print("Semantic similarity:", sim)
        print("Feature vector:", features)
        print("Reasons:", reasons)
        print("===================================\n")

        return features, reasons
