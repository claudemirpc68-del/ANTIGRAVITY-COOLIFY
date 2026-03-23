from scripts.api_supabase import identificar_usuario
from supabase_client import get_supabase

def check_and_fix():
    matricula = "111111"
    print(f"--- Verificando matrícula {matricula} ---")
    res = identificar_usuario(matricula)
    print(f"Resultado de identificar_usuario: {res}")
    
    if res["tipo"] == "nao_encontrado":
        print("Matrícula não encontrada. Tentando inserir...")
        supabase = get_supabase()
        data = {
            "matricula": matricula,
            "nome": "JOHN",
            "tipo": "gestor",
            "funcao": "GESTOR"
        }
        try:
            insert_res = supabase.table("colaboradores").insert(data).execute()
            print(f"Resultado da inserção: {insert_res}")
            
            # Verifica novamente
            res_after = identificar_usuario(matricula)
            print(f"Resultado após inserção: {res_after}")
        except Exception as e:
            print(f"Erro ao inserir: {e}")
    else:
        print("Matrícula já existe no Supabase.")

if __name__ == "__main__":
    check_and_fix()
