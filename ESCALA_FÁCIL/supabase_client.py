import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Garante o carregamento do .env do diretório raiz
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not url or "your-project" in url:
    print("⚠️  AVISO: SUPABASE_URL não configurada ou usando valor de fallback!")

supabase: Client = create_client(url, key)

def get_supabase():
    return supabase
