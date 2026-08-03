import requests
import json
import logging
from pathlib import Path
from config.settings import TAVILY_API_KEY, DOCS_CACHE_DIR

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("TavilyScraper")

class TavilyScraper:
    def __init__(self, api_key: str = TAVILY_API_KEY):
        self.api_key = api_key
        self.base_url = "https://api.tavily.com/search"

    def search_and_extract(self, query: str, domains: list = None, max_results: int = 5) -> list:
        """
        Realiza raspagem e busca de documentação oficial usando a API do Tavily.
        Domínios recomendados: ibm.com, tensorflow.org, developers.google.com, scikit-learn.org, pytorch.org
        """
        if not domains:
            domains = [
                "scikit-learn.org",
                "tensorflow.org",
                "developers.google.com",
                "ibm.com",
                "pytorch.org"
            ]

        if not self.api_key or self.api_key.startswith("tvly-your"):
            logger.warning("TAVILY_API_KEY não configurada. Utilizando modo de simulação de documentação oficial.")
            return self._mock_extraction(query)

        headers = {
            "Content-Type": "application/json"
        }

        payload = {
            "api_key": self.api_key,
            "query": f"Machine Learning official documentation {query}",
            "include_domains": domains,
            "search_depth": "advanced",
            "include_raw_content": True,
            "max_results": max_results
        }

        try:
            response = requests.post(self.base_url, headers=headers, json=payload, timeout=15)
            response.raise_for_status()
            data = response.json()

            results = []
            for item in data.get("results", []):
                cleaned_text = self._clean_text(item.get("raw_content") or item.get("content", ""))
                doc = {
                    "title": item.get("title", "Documentação ML"),
                    "url": item.get("url", ""),
                    "content": cleaned_text,
                    "snippet": item.get("content", "")[:300]
                }
                results.append(doc)
                self._save_cache(query, doc)

            return results
        except Exception as e:
            logger.error(f"Erro ao buscar no Tavily: {str(e)}")
            return self._mock_extraction(query)

    def _clean_text(self, text: str) -> str:
        """Limpa e normaliza o texto extraído das páginas web."""
        lines = text.split("\n")
        cleaned_lines = [line.strip() for line in lines if len(line.strip()) > 30]
        return "\n\n".join(cleaned_lines)

    def _save_cache(self, query: str, doc: dict):
        """Armazena em cache o conteúdo raspado para rápida consulta."""
        safe_query = "".join(c for c in query if c.isalnum() or c in (" ", "_")).rstrip()
        filename = DOCS_CACHE_DIR / f"{safe_query[:20]}_{hash(doc['url'])}.json"
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(doc, f, ensure_ascii=False, indent=2)

    def _mock_extraction(self, query: str) -> list:
        """Fallback educacional para testes quando a chave do Tavily não está configurada."""
        return [
            {
                "title": f"Guia de Referência: {query} (Google Developers / Scikit-Learn)",
                "url": "https://developers.google.com/machine-learning/crash-course",
                "content": f"O conceito de '{query}' é fundamental no aprendizado de máquina. No contexto de No-Code/Low-Code, pipelines automatizados como Scikit-Learn ou PyCaret permitem treinar modelos e avaliar métricas com apenas poucas linhas de código. Principais etapas: 1. Coleta e Limpeza de Dados; 2. Divisão Treino/Teste (80/20); 3. Validação e Ajuste de Hiperparâmetros.",
                "snippet": f"Documentação sobre {query} focada em fundamentos e boas práticas de ML."
            }
        ]
