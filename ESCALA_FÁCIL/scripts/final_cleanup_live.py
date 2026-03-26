import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

def final_cleanup():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key:
        print("❌ Erro: API Keys não encontradas.")
        return

    supabase = create_client(url, key)
    
    # 1. Remover Carlos (não existe)
    # 2. Remover matrícula fantasma de Claudemir (10452327)
    # 3. Remover John (111111) da lista de colaboradores (ele deve ser APENAS gestor)
    # Note: No Supabase a tabela 'colaboradores' contém gestores também se o tipo for 'gestor'.
    # Mas se o usuário quer '33 colaboradores', talvez John não deva estar lá?
    # No entanto, para o bot identificar o John, ele PRECISA estar na tabela 'colaboradores' com tipo 'gestor'.
    # Vou apenas limpar os falsos gestores.
    
    to_delete = ["13543621", "10452327"] # Carlos e fake Claudemir

    for m in to_delete:
        print(f"--- Removendo matrícula inexistente {m} ---")
        try:
            res = supabase.table("colaboradores").delete().eq("matricula", m).execute()
            print(f"Resultado: {res.data}")
        except Exception as e:
            print(f"Erro ao remover {m}: {e}")

    # Garantir que Claudemir real (7101309) seja 'colaborador'
    try:
        print("--- Verificando Claudemir (7101309) ---")
        res = supabase.table("colaboradores").update({"tipo": "colaborador"}).eq("matricula", "7101309").execute()
        print(f"Resultado: {res.data}")
    except Exception as e:
        print(f"Erro ao atualizar Claudemir: {e}")

if __name__ == "__main__":
    final_cleanup()
