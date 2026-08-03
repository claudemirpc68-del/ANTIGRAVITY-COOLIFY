import pytest
import sys
from pathlib import Path

# Garantir PYTHONPATH
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from core.agent import TutorMLAgent
from core.study_plan import StudyPlanManager
from core.tavily_scraper import TavilyScraper

def test_tutor_agent_initialization():
    agent = TutorMLAgent()
    assert agent.persona["name"] == "TutorML"
    assert agent.persona["role"] is not None

def test_study_plan_weeks():
    mgr = StudyPlanManager()
    weeks = mgr.get_all_weeks()
    assert len(weeks) == 6
    assert weeks[0]["week"] == 1
    assert "Fundamentos" in weeks[0]["topic"]

def test_agent_query_response():
    agent = TutorMLAgent()
    response = agent.answer_user_query("O que é Regressão Linear?", use_tavily=False)
    assert "TutorML" in response or "Aprendendo sobre" in response
    assert "Google Colab" in response

def test_tavily_mock_extraction():
    scraper = TavilyScraper(api_key="")
    results = scraper.search_and_extract("Scikit-Learn Classification")
    assert len(results) > 0
    assert "Scikit-Learn" in results[0]["title"] or "Guia" in results[0]["title"]
