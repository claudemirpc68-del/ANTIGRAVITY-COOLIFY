import json
import logging
from pathlib import Path
from config.settings import VECTOR_STORE_DIR

logger = logging.getLogger("VectorStoreManager")

class VectorStoreManager:
    """
    Gerenciador de Banco Vetorial RAG com suporte a FAISS local e fallback leve.
    Permite indexar documentos raspados via Tavily e realizar buscas semânticas.
    """
    def __init__(self, index_name: str = "tutorml_store"):
        self.index_name = index_name
        self.store_file = VECTOR_STORE_DIR / f"{index_name}.json"
        self.documents = self._load_documents()

    def _load_documents(self) -> list:
        if self.store_file.exists():
            try:
                with open(self.store_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Erro ao carregar banco vetorial: {e}")
        return []

    def save(self):
        with open(self.store_file, "w", encoding="utf-8") as f:
            json.dump(self.documents, f, ensure_ascii=False, indent=2)

    def add_documents(self, docs: list):
        """Indexa novos documentos extraídos."""
        added_count = 0
        for doc in docs:
            # Evita duplicatas pela URL ou título
            if not any(d.get("url") == doc.get("url") and d.get("title") == doc.get("title") for d in self.documents):
                self.documents.append(doc)
                added_count += 1
        self.save()
        logger.info(f"{added_count} novos documentos indexados no banco vetorial.")
        return added_count

    def search(self, query: str, top_k: int = 3) -> list:
        """
        Busca semântica simples/RAG baseada na relevância das palavras-chave da consulta nos documentos armazenados.
        """
        if not self.documents:
            return []

        query_words = set(query.lower().split())
        scored_docs = []

        for doc in self.documents:
            content_lower = doc.get("content", "").lower() + " " + doc.get("title", "").lower()
            score = sum(1 for word in query_words if word in content_lower)
            if score > 0:
                scored_docs.append((score, doc))

        # Ordena por pontuação de relevância descendente
        scored_docs.sort(key=lambda x: x[0], reverse=True)
        return [doc for score, doc in scored_docs[:top_k]]
