import os
from supabase import create_client
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do .env local
load_dotenv()

def fix_supabase():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key:
        print("❌ Erro: SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontradas no .env")
        return

    supabase = create_client(url, key)
    
    gestores = [
        {"matricula": "111111", "nome": "JOHN", "tipo": "gestor", "funcao": "GESTOR"},
        {"matricula": "10452327", "nome": "CLAUDEMIR", "tipo": "gestor", "funcao": "GESTOR"},
        {"matricula": "13543621", "nome": "CARLOS", "tipo": "gestor", "funcao": "GESTOR"}
    ]

    for g in gestores:
        print(f"--- Processando {g['nome']} ({g['matricula']}) ---")
        try:
            # Tenta encontrar o usuário
            res = supabase.table("colaboradores").select("*").eq("matricula", g["matricula"]).execute()
            if not res.data:
                print(f"Inserindo {g['nome']}...")
                insert_res = supabase.table("colaboradores").insert(g).execute()
                print(f"Sucesso: {insert_res.data}")
            else:
                print(f"{g['nome']} já existe. Atualizando tipo para 'gestor'...")
                update_res = supabase.table("colaboradores").update({"tipo": "gestor"}).eq("matricula", g["matricula"]).execute()
                print(f"Sucesso na atualização: {update_res.data}")
        except Exception as e:
            print(f"Erro ao processar {g['nome']}: {e}")

if __name__ == "__main__":
    fix_supabase()
