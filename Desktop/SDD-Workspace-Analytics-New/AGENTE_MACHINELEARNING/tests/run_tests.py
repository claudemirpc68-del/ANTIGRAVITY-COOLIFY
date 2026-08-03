import sys
import os
from pathlib import Path

# Ajusta encodamento de saída para UTF-8 no Windows
sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from core.agent import TutorMLAgent
from core.study_plan import StudyPlanManager
from core.tavily_scraper import TavilyScraper

def run_all_tests():
    print("🚀 Iniciando testes do AgenteTutorML...")

    # Teste 1: Inicialização do Agente
    agent = TutorMLAgent()
    print(f"✅ Agente inicializado: {agent.persona['name']} ({agent.persona['role']})")

    # Teste 2: Plano de Estudos
    study_mgr = StudyPlanManager()
    weeks = study_mgr.get_all_weeks()
    print(f"✅ Plano de estudos carregado com {len(weeks)} semanas.")

    # Teste 3: Pergunta e Resposta RAG
    query = "O que é Regressão Logística?"
    resposta = agent.answer_user_query(query, use_tavily=False)
    print(f"✅ Teste de Pergunta ({query}): Resposta gerada com sucesso! ({len(resposta)} caracteres)")

    # Teste 4: Tavily Scraper Fallback/Mock
    scraper = TavilyScraper(api_key="")
    docs = scraper.search_and_extract("Scikit-Learn Classification")
    print(f"✅ Teste de Extração Web: {len(docs)} documento(s) retornado(s).")

    print("\n🎉 TODOS OS TESTES PASSARAM COM SUCESSO!")

if __name__ == "__main__":
    run_all_tests()
