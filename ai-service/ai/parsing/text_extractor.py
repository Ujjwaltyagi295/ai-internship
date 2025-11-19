
from io import BytesIO
from pypdf import PdfReader


class ResumeTextExtractor:
    """
    Extract raw text from a PDF resume.
    """

    def extract_text(self, pdf_bytes: bytes) -> str:
        try:
            stream = BytesIO(pdf_bytes)
            reader = PdfReader(stream)
            text = ""

            for page in reader.pages:
                try:
                    t = page.extract_text()
                    if t:
                        text += t + "\n"
                except Exception:
                    continue

            return text.strip()
        except Exception:
            return ""
