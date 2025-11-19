import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
TRAINED_MODELS_DIR = os.path.join(BASE_DIR, "trained_models")
RANKER_PATH = os.path.join(TRAINED_MODELS_DIR, "ranker.json")
SKILL_MAP_PATH = os.path.join(BASE_DIR, "skills", "skill_map.json")

