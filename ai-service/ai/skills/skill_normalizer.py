import json
from typing import List
from ai.config import SKILL_MAP_PATH


class SkillNormalizer:
    """
    Normalizes noisy skill labels using a canonical map loaded from JSON.
    """

    def __init__(self):
        try:
            with open(SKILL_MAP_PATH, "r", encoding="utf-8") as f:
                self.map = json.load(f)
        except Exception:
            self.map = {}

        # Pre-lower keys for quick matching
        self._lower_keys = {k.lower(): v for k, v in self.map.items()}

    def normalize(self, skills: List[str]) -> List[str]:
        out: List[str] = []

        for s in skills:
            key = s.lower().strip()
            if key in self._lower_keys:
                mapped = self._lower_keys[key]
                if isinstance(mapped, list):
                    out.extend(mapped)
                else:
                    out.append(mapped)
            else:
                out.append(key)

        # unique
        seen = set()
        res = []
        for v in out:
            if v not in seen:
                seen.add(v)
                res.append(v)
        return res

    def extract_from_text(self, text: str) -> List[str]:
        """
        Lightweight skill extraction: looks for known skill keys in raw text.
        Returns normalized canonical skills.
        """
        if not text:
            return []

        text_l = text.lower()
        found = []

        for key, mapped in self._lower_keys.items():
            if key and key in text_l:
                if isinstance(mapped, list):
                    found.extend(mapped)
                else:
                    found.append(mapped)

        # dedupe
        seen = set()
        deduped = []
        for v in found:
            if v not in seen:
                seen.add(v)
                deduped.append(v)

        return deduped
