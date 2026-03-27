import json
import os
import sys
from dotenv import load_dotenv

# Adiciona o diretório raiz ao path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from supabase_client import get_supabase

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ESCALA_PATH = os.path.join(BASE_DIR, "skill_config", "escala_gerada.json")
COLABORADORES_PATH = os.path.join(BASE_DIR, "skill_config", "colaboradores.json")

def importar_dados():
    supabase = get_supabase()
    
    # 1. Importar Colaboradores
    print("📥 Importando colaboradores...")
    with open(COLABORADORES_PATH, encoding="utf-8") as f:
        colaboradores = json.load(f)["colaboradores"]
    
    for c in colaboradores:
        supabase.table("colaboradores").upsert({
            "matricula": c["matricula"],
            "nome": c["nome"],
            "funcao": c.get("funcao"),
            "horario_padrao": c.get("horario"),
            "tipo": "colaborador"
        }).execute()
        print(f"  - {c['nome']} importado.")

    # 2. Importar Escalas e Domingos de Folga
    print("\n📥 Importando escalas (isso pode demorar um pouco)...")
    with open(ESCALA_PATH, encoding="utf-8") as f:
        dados_escala = json.load(f)["escala"]
    
    for matricula, info in dados_escala.items():
        print(f"  - Processando escala de {info['nome']}...")
        
        # Domingos de folga
        for dom in info.get("domingos_folga", []):
            supabase.table("domingos_folga").upsert({
                "matricula": matricula,
                "data": dom
            }).execute()
            
        # Dias da escala
        batch_dias = []
        for dia in info["dias"]:
            batch_dias.append({
                "matricula": matricula,
                "data": dia["data"],
                "dia_semana": dia["dia_semana"],
                "status": dia["status"],
                "entrada": dia.get("entrada"),
                "tipo_folga": dia.get("tipo_folga")
            })
        
        # Insere em lotes de 50 para evitar limites do Supabase
        for i in range(0, len(batch_dias), 50):
            supabase.table("escalas").upsert(batch_dias[i:i+50]).execute()

    print("\n✅ Migração concluída com sucesso!")

if __name__ == "__main__":
    confirm = input("Tem certeza que deseja iniciar a migração? As chaves no .env devem estar corretas. (s/n): ")
    if confirm.lower() == 's':
        try:
            importar_dados()
        except Exception as e:
            print(f"❌ Erro durante a migração: {e}")
    else:
        print("Migração cancelada.")
