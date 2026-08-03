import os
import logging
from config.settings import PERSONA, TAVILY_API_KEY, GROQ_API_KEY, GROQ_MODEL, GEMINI_API_KEY, OPENAI_API_KEY
from core.tavily_scraper import TavilyScraper
from core.vector_store import VectorStoreManager
from core.tutor_skills import TutorSkillsManager
from core.study_plan import StudyPlanManager

logger = logging.getLogger("TutorMLAgent")

class TutorMLAgent:
    """
    Agente Orquestrador TutorML.
    Combina a persona didática com suporte a Groq LLM (gratuito e ultrarrápido),
    busca RAG (Vector Store + Tavily API) e habilidades educacionais.
    """
    def __init__(self):
        self.persona = PERSONA
        self.tavily = TavilyScraper()
        self.vector_store = VectorStoreManager()
        self.skills = TutorSkillsManager()
        self.study_plan_mgr = StudyPlanManager()
        self.groq_client = None

        if GROQ_API_KEY:
            try:
                from groq import Groq
                self.groq_client = Groq(api_key=GROQ_API_KEY)
                logger.info(f"Provedor Groq LLM inicializado com sucesso ({GROQ_MODEL}).")
            except Exception as e:
                logger.error(f"Erro ao inicializar Groq Client: {e}")

    def answer_user_query(self, query: str, use_tavily: bool = True) -> str:
        """
        Fluxo de interação do agente:
        1. Consulta o banco vetorial e/ou Tavily para RAG.
        2. Se GROQ_API_KEY estiver configurada, chama o modelo Llama-3 via Groq.
        3. Caso contrário, gera a resposta estruturada do TutorML.
        """
        rag_context = ""

        # Step 1: Tentar recuperar do Banco Vetorial
        vector_docs = self.vector_store.search(query, top_k=2)
        if vector_docs:
            rag_context = vector_docs[0].get("snippet", "")

        # Step 2: Se não houver contexto suficiente e Tavily estiver ativado
        if not rag_context and use_tavily:
            tavily_results = self.tavily.search_and_extract(query)
            if tavily_results:
                self.vector_store.add_documents(tavily_results)
                rag_context = tavily_results[0].get("snippet", "")

        # Step 3: Se o cliente Groq estiver ativo, usa o modelo de IA do Groq
        if self.groq_client:
            try:
                system_prompt = self.persona["system_prompt"]
                if rag_context:
                    system_prompt += f"\n\nContexto RAG de Documentação Técnica:\n{rag_context}"

                completion = self.groq_client.chat.completions.create(
                    model=GROQ_MODEL,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": query}
                    ],
                    temperature=0.7,
                    max_tokens=1000
                )
                return completion.choices[0].message.content
            except Exception as e:
                logger.error(f"Erro ao chamar API do Groq: {e}. Alternando para gerador padrão.")

        # Fallback estruturado
        response = self.skills.format_theoretical_explanation(query, content_context=rag_context)
        response += "\n\n" + self.skills.generate_colab_exercise(query)
        return response


    def evaluate_submission(self, user_code_or_answer: str, topic: str = "ML Basics") -> str:
        """Avalia a submissão do usuário e devolve um feedback didático."""
        return self.skills.evaluate_user_response(user_code_or_answer, expected_context=topic)

    def scrape_and_index_topic(self, topic: str) -> list:
        """Executa raspagem via Tavily de páginas oficiais e indexa no banco vetorial."""
        results = self.tavily.search_and_extract(topic, max_results=5)
        count = self.vector_store.add_documents(results)
        return results
