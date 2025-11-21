from typing import Dict, Any, List


class ResumeCleaner:
    """
    Light cleaning & normalization of LLM parsed output.
    """

    def clean(self, data: Dict[str, Any]) -> Dict[str, Any]:
        if not isinstance(data, dict):
            data = {}

        def _clean_str(key: str) -> str:
            return str(data.get(key, "") or "").strip()

        def _clean_list(key: str) -> List[str]:
            vals = data.get(key, []) or []
            out = []
            for v in vals:
                v = str(v).strip()
                if v:
                    out.append(v)
            # unique + stable
            seen = set()
            res = []
            for v in out:
                if v.lower() not in seen:
                    seen.add(v.lower())
                    res.append(v)
            return res

        cleaned = {
            "summary": _clean_str("summary"),
            "skills": _clean_list("skills"),
            "tools": _clean_list("tools"),
            "projects": data.get("projects", []) or [],
            "experience": data.get("experience", []) or [],
            "education": data.get("education", []) or [],
            "branch": _clean_str("branch"),
            "batch": _clean_str("batch"),
            "cgpa": data.get("cgpa", "") or "",
        }

        # force list types for complex fields
        for k in ["projects", "experience", "education"]:
            if not isinstance(cleaned[k], list):
                cleaned[k] = []

        return cleaned

