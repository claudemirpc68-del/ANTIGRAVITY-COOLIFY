import os
import sys

# Adiciona o diretório raiz ao path para importar os scripts
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from scripts.api_supabase import (
    identificar_usuario,
    listar_solicitacoes_pendentes,
    get_relatorio_mensal_equipe,
    salvar_solicitacao,
    get_resumo_equipe
)

def testar_novas_funcionalidades():
    print("🚀 Testando Novas Funcionalidades do ESCALA_FÁCIL\n")

    # 1. Testar Identificação
    print("--- 1. Identificação ---")
    gestor = identificar_usuario("101010")
    print(f"Gestor: {gestor['nome']} ({gestor['tipo']})")
    
    colab = identificar_usuario("7101309")
    print(f"Colaborador: {colab['nome']} ({colab['tipo']})")

    # 2. Criar solicitações de teste (se necessário)
    print("\n--- 2. Criando solicitações de teste ---")
    salvar_solicitacao("7101309", "Claudemir", "Justificativa de Ausência", "Consulta médica hoje.")
    salvar_solicitacao("7101309", "Claudemir", "Troca de Turno", "Troca com João no sábado.")
    print("Solicitações criadas.")

    # 3. Testar Filtros de Gestor
    print("\n--- 3. Testando Filtros de Gestor ---")
    print("\n[Filtro: Justificativa]")
    print(listar_solicitacoes_pendentes("Justificativa"))
    
    print("\n[Filtro: Troca]")
    print(listar_solicitacoes_pendentes("Troca"))
    
    print("\n[Sem Filtro]")
    print(listar_solicitacoes_pendentes())

    # 4. Testar Relatório Mensal
    print("\n--- 4. Testando Relatório Mensal ---")
    print(get_relatorio_mensal_equipe())

    # 5. Testar Resumo Detalhado (Novo)
    print("\n--- 5. Testando Resumo Detalhado da Equipe ---")
    print(get_resumo_equipe())

if __name__ == "__main__":
    try:
        testar_novas_funcionalidades()
    except Exception as e:
        print(f"❌ Erro nos testes: {e}")
