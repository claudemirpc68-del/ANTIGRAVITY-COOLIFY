import sys
import os

# Adiciona o diretório raiz ao path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

def test_imports():
    """Verifica se os módulos principais podem ser importados."""
    try:
        import server # noqa: F401
        import sessions # noqa: F401
        import supabase_client # noqa: F401
        assert True
    except ImportError as e:
        assert False, f"Falha ao importar módulos: {e}"

def test_env_loading():
    """Verifica se o .env existe (básico)."""
    assert os.path.exists(".env"), "Arquivo .env não encontrado"
