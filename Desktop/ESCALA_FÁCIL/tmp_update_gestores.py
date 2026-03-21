import requests

SUPABASE_URL = "https://ttapunpstvfllexzaned.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0YXB1bnBzdHZmbGxleHphbmVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzk5NTAzNCwiZXhwIjoyMDg5NTcxMDM0fQ.u_PZHvYLTDWkLsJe8Pf7q7cLLgkviIR5N12B0JicJGY"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

matriculas = ["101010", "101011", "101012", "101013"]

for matricula in matriculas:
    print(f"Atualizando matrícula {matricula} para 'gestor'...")
    url = f"{SUPABASE_URL}/rest/v1/colaboradores?matricula=eq.{matricula}"
    data = {"tipo": "gestor"}
    response = requests.patch(url, headers=headers, json=data)
    if response.status_code in [200, 201, 204]:
        print(f"Matrícula {matricula} atualizada com sucesso.")
    else:
        print(f"Erro ao atualizar matrícula {matricula}: {response.status_code} - {response.text}")
