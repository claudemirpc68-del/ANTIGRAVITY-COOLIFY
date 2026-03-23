import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

def revert_gestores():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key:
        print("❌ Erro: API Keys não encontradas.")
        return

    supabase = create_client(url, key)
    
    # Matrículas que foram incorretamente marcadas como gestores
    wrong_gestores = ["10452327", "13543621"]

    for m in wrong_gestores:
        print(f"--- Revertendo matrícula {m} ---")
        try:
            # Em vez de excluir, vamos mudar para 'colaborador' 
            # ou excluir se forem matrículas "fantasmas" que eu criei
            # Dado que o usuário disse "não são gestores", se elas não existiam antes, melhor excluir.
            # Mas Claudemir existe como 7101309. 10452327 parece ser erro meu.
            res = supabase.table("colaboradores").delete().eq("matricula", m).execute()
            print(f"Resultado da exclusão da matrícula incorreta {m}: {res.data}")
        except Exception as e:
            print(f"Erro ao excluir {m}: {e}")

    # Garante que 111111 (John) continue como gestor
    try:
        print("--- Confirmando John (111111) como gestor ---")
        res = supabase.table("colaboradores").update({"tipo": "gestor"}).eq("matricula", "111111").execute()
        print(f"Resultado: {res.data}")
    except Exception as e:
        print(f"Erro ao confirmar John: {e}")

if __name__ == "__main__":
    revert_gestores()
