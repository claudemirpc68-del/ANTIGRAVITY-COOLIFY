import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_ROLE_KEY"))

matriculas = ["101010", "101011", "101012", "101013"]
print("--- Verificando Gestores ---")
for mat in matriculas:
    res = supabase.table("colaboradores").select("matricula, nome, tipo").eq("matricula", mat).execute()
    if res.data:
        print(f"Encontrado {mat}: {res.data[0]}")
    else:
        print(f"NÃO encontrado {mat}")

print("\n--- Verificando se existem outros gestores ---")
res_all = supabase.table("colaboradores").select("matricula, nome, tipo").eq("tipo", "gestor").execute()
print(f"Total de gestores: {len(res_all.data)}")
for g in res_all.data:
    print(g)
