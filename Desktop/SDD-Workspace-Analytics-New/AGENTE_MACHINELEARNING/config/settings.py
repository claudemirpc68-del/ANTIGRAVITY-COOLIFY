import os
import json
from pathlib import Path
from dotenv import load_dotenv

# Carrega variáveis de ambiente do .env se existir
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# Chaves de API
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "")


# Diretórios do sistema
DOCS_CACHE_DIR = BASE_DIR / "data" / "docs_cache"
DOCS_CACHE_DIR.mkdir(parents=True, exist_ok=True)

VECTOR_STORE_DIR = BASE_DIR / "data" / "vector_store"
VECTOR_STORE_DIR.mkdir(parents=True, exist_ok=True)

# Carrega Persona
PERSONA_FILE = BASE_DIR / "config" / "persona.json"
def load_persona():
    if PERSONA_FILE.exists():
        with open(PERSONA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "name": "TutorML",
        "role": "Mentor de Machine Learning",
        "tone": "Amigável e didático"
    }

PERSONA = load_persona()
