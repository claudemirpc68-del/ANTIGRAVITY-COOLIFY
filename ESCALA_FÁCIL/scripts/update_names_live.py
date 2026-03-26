import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

def update_manager_names():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key:
        print("❌ Erro: API Keys não encontradas.")
        return

    supabase = create_client(url, key)
    
    # Atualizar Anderson para Ederson
    print("--- Atualizando Anderson para Ederson Cubas (101010) ---")
    try:
        res = supabase.table("colaboradores").update({"nome": "EDERSON CUBAS", "tipo": "gestor"}).eq("matricula", "101010").execute()
        print(f"Resultado Ederson: {res.data}")
    except Exception as e:
        print(f"Erro ao atualizar Ederson: {e}")

    # Atualizar Antonio para 202020
    print("--- Atualizando Antonio para 202020 ---")
    try:
        # Primeiro verificamos se a matrícula 202020 já existe
        check = supabase.table("colaboradores").select("*").eq("matricula", "202020").execute()
        if not check.data:
            # Se não existe, inserimos ou renomeamos a antiga
            # Se a antiga era 101012, vamos deletá-la e inserir a nova (já que a chave primária mudou)
            supabase.table("colaboradores").delete().eq("matricula", "101012").execute()
            res = supabase.table("colaboradores").insert({"matricula": "202020", "nome": "ANTONIO", "tipo": "gestor", "funcao": "GESTOR"}).execute()
        else:
            res = supabase.table("colaboradores").update({"nome": "ANTONIO", "tipo": "gestor"}).eq("matricula", "202020").execute()
        print(f"Resultado Antonio: {res.data}")
    except Exception as e:
        print(f"Erro ao atualizar Antonio: {e}")

if __name__ == "__main__":
    update_manager_names()
