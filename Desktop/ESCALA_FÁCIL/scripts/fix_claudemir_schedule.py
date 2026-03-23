import os
import sys
from datetime import date

# Adiciona o diretório raiz ao path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from supabase_client import get_supabase

def fix_claudemir():
    supabase = get_supabase()
    matricula = "7101309"
    nome = "CLAUDEMIR"
    
    print(f"🚀 Iniciando correção da escala para {nome} ({matricula})...")
    
    # 1. Ajustar datas na tabela 'escalas'
    correcoes = [
        {"data": "2026-03-16", "dia_semana": "Segunda-feira", "status": "TRABALHA", "entrada": "14:30", "tipo_folga": None},
        {"data": "2026-03-17", "dia_semana": "Terça-feira", "status": "FOLGA", "entrada": None, "tipo_folga": "Folga"},
        {"data": "2026-03-22", "dia_semana": "Domingo", "status": "TRABALHA", "entrada": "10:30", "tipo_folga": None},
        {"data": "2026-03-24", "dia_semana": "Terça-feira", "status": "FOLGA", "entrada": None, "tipo_folga": "Folga"},
    ]
    
    for c in correcoes:
        try:
            res = supabase.table("escalas").upsert({
                "matricula": matricula,
                "data": c["data"],
                "dia_semana": c["dia_semana"],
                "status": c["status"],
                "entrada": c["entrada"],
                "tipo_folga": c["tipo_folga"]
            }).execute()
            print(f"  ✅ Data {c['data']} atualizada para {c['status']}.")
        except Exception as e:
            print(f"  ❌ Erro ao atualizar {c['data']}: {e}")

    # 2. Remover do 'domingos_folga' (já que ele trabalha dia 22/03)
    try:
        supabase.table("domingos_folga").delete().eq("matricula", matricula).eq("data", "2026-03-22").execute()
        print(f"  ✅ Removida folga de domingo do dia 2026-03-22 da tabela 'domingos_folga'.")
    except Exception as e:
        print(f"  ⚠️ Aviso ao remover domingo_folga: {e}")

    print("\n✨ Correção finalizada com sucesso!")

if __name__ == "__main__":
    fix_claudemir()
