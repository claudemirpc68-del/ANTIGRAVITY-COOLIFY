import sys
import os
import logging
from pathlib import Path

# Ajusta encodamento de saída no Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding='utf-8')

# Adiciona a raiz do projeto ao sys.path
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from config.settings import PERSONA, GROQ_API_KEY, GROQ_MODEL, TAVILY_API_KEY
from core.agent import TutorMLAgent
from core.study_plan import StudyPlanManager
from core.tavily_scraper import TavilyScraper
from core.vector_store import VectorStoreManager

logging.basicConfig(level=logging.INFO)

def run_agent_validation():
    print("=" * 60)
    print("🧪 INICIANDO SCRIPT DE VALIDAÇÃO COMPLETA DO AGENTETUTORML")
    print("=" * 60)

    # -------------------------------------------------------------
    # Teste 1: Validação de Persona e Configuração
    # -------------------------------------------------------------
    print("\n[1/5] 👤 Verificando Persona e Configurações...")
    print(f"  • Nome do Agente: {PERSONA.get('name')}")
    print(f"  • Papel: {PERSONA.get('role')}")
    print(f"  • Abordagem: {PERSONA.get('approach')}")
    assert PERSONA.get("name") == "TutorML", "Erro: Persona name incorreto!"
    print("  ✅ Persona e Configurações validadas com sucesso.")

    # -------------------------------------------------------------
    # Teste 2: Validação do Plano de Estudos (6 Semanas)
    # -------------------------------------------------------------
    print("\n[2/5] 📅 Verificando Plano de Estudos...")
    study_mgr = StudyPlanManager()
    weeks = study_mgr.get_all_weeks()
    print(f"  • Total de Semanas no Currículo: {len(weeks)}")
    for w in weeks:
        print(f"    - Semana {w['week']}: {w['topic']}")
    assert len(weeks) == 6, "Erro: Esperado 6 semanas no plano de estudos!"
    print("  ✅ Plano de Estudos de 6 semanas validado.")

    # -------------------------------------------------------------
    # Teste 3: Validação do Banco Vetorial e RAG
    # -------------------------------------------------------------
    print("\n[3/5] 🧠 Verificando Banco Vetorial & Busca Semântica RAG...")
    vector_mgr = VectorStoreManager(index_name="test_val_store")
    test_docs = [
        {
            "title": "Documentação Scikit-Learn Random Forest",
            "url": "https://scikit-learn.org/stable/modules/ensemble.html",
            "content": "Random Forest é um algoritmo de aprendizado supervisionado baseado em várias árvores de decisão.",
            "snippet": "Random Forest combina múltiplas árvores para reduzir overfitting."
        }
    ]
    vector_mgr.add_documents(test_docs)
    results = vector_mgr.search("Random Forest", top_k=1)
    print(f"  • Documentos encontrados na busca RAG: {len(results)}")
    if results:
        print(f"  • Título do doc recuperado: '{results[0]['title']}'")
    assert len(results) > 0, "Erro: Falha na busca semântica RAG!"
    print("  ✅ Banco Vetorial RAG validado com sucesso.")

    # -------------------------------------------------------------
    # Teste 4: Validação do Integrador Groq & Respostas do Agente
    # -------------------------------------------------------------
    print("\n[4/5] ⚡ Verificando Orquestrador e Respostas do Agente...")
    agent = TutorMLAgent()
    if agent.groq_client:
        print(f"  • Provedor Groq detectado! Modelo: {GROQ_MODEL}")
    else:
        print("  • Modo de simulação estruturada (GROQ_API_KEY não informada).")

    prompt_teste = "O que é Overfitting e como podemos evitá-lo?"
    print(f"  • Pergunta enviada ao TutorML: '{prompt_teste}'")
    resposta = agent.answer_user_query(prompt_teste, use_tavily=False)
    
    print("\n--- RESPOSTA GERADA PELO TUTORML ---")
    print(resposta[:400] + "...\n[resto omitido para brevidade]")
    print("------------------------------------")
    
    assert len(resposta) > 100, "Erro: Resposta do agente muito curta ou vazia!"
    print("  ✅ Agente respondeu com sucesso!")

    # -------------------------------------------------------------
    # Teste 5: Validação do Feedback de Código/Resposta
    # -------------------------------------------------------------
    print("\n[5/5] 📝 Verificando Avaliador de Feedback...")
    codigo_aluno = "def treinar():\n    model.fit(X, y)"
    feedback = agent.evaluate_submission(codigo_aluno, topic="Supervisionado")
    print(f"  • Feedback gerado ({len(feedback)} chars).")
    assert "Feedback" in feedback or "TutorML" in feedback, "Erro no gerador de feedback!"
    print("  ✅ Avaliador de Feedback validado.")

    print("\n" + "=" * 60)
    print("🎉 VALIDAÇÃO COMPLETA DO AGENTETUTORML CONCLUÍDA COM 100% DE SUCESSO!")
    print("=" * 60)

if __name__ == "__main__":
    run_agent_validation()
