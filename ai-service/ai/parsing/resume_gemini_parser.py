
import json
import re
import time
from google import genai

from ai.config import GEMINI_API_KEY, GEMINI_MODEL, BASE_DIR


class ResumeGeminiParser:
    """
    Uses Google Gemini to parse resume text into structured JSON.
    """

    def __init__(self):
        if not GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not set in environment")

        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.model_name = GEMINI_MODEL or "gemini-2.5-flash"
        print(f"[AI] USING GEMINI PARSER model={self.model_name}")

        prompt_path = f"{BASE_DIR}/parsing/resume_prompt.txt"
        with open(prompt_path, "r", encoding="utf-8") as f:
            self.template = f.read()

    def _extract_text(self, resp) -> str:
        # New SDK: resp.text should exist
        if hasattr(resp, "text") and resp.text:
            return resp.text

        # fallback: inspect candidates
        try:
            cand = resp.candidates[0]
            parts = getattr(cand.content, "parts", [])
            return "".join(getattr(p, "text", "") for p in parts if hasattr(p, "text"))
        except Exception:
            return str(resp)

    def _parse_json(self, raw: str) -> dict:
        if not raw:
            raise ValueError("Empty Gemini response")

        # remove markdown fences if present
        txt = raw.replace("```json", "").replace("```", "").strip()

        # try regex to find JSON block
        match = re.search(r"\{[\s\S]*\}", txt)
        if not match:
            raise ValueError("No JSON object found in Gemini output")

        json_str = match.group(0)
        return json.loads(json_str)

    def parse(self, text: str) -> dict:
        prompt = self.template.replace("{{TEXT}}", text)

        MAX_RETRIES = 4
        last_error = None

        for attempt in range(MAX_RETRIES):
            try:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                )
                raw = self._extract_text(response)
                print("[AI] Gemini raw output (truncated):", raw[:300])
                data = self._parse_json(raw)
                return data
            except Exception as e:
                print(f"[Gemini] Attempt {attempt+1}/{MAX_RETRIES} failed:", e)
                last_error = e
                time.sleep(1 * (attempt + 1))

        print("Gemini parsing failed after retries:", last_error)
        # return empty structure; upper layer will clean
        return {}
