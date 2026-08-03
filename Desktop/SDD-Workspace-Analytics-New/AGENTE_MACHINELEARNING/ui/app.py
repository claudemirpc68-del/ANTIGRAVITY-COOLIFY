import sys
from pathlib import Path

# Adiciona o diretório raiz ao PYTHONPATH
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

import streamlit as st
from core.agent import TutorMLAgent
from core.study_plan import StudyPlanManager
from config.settings import PERSONA

# Configuração da Página do Streamlit
st.set_page_config(
    page_title="AgenteTutorML - Mentor de Machine Learning",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Injeta CSS Customizado
css_path = ROOT_DIR / "ui" / "styles.css"
if css_path.exists():
    with open(css_path, "r", encoding="utf-8") as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

# Inicializa o Agente na Sessão
if "agent" not in st.session_state:
    st.session_state.agent = TutorMLAgent()

if "study_mgr" not in st.session_state:
    st.session_state.study_mgr = StudyPlanManager()

if "chat_history" not in st.session_state:
    st.session_state.chat_history = [
        {
            "role": "assistant",
            "content": f"Olá! Eu sou o **{PERSONA['name']}**, seu {PERSONA['role']}. Estou aqui para te guiar do zero ao avançado em Machine Learning com foco prático e No-Code/Low-Code! Em que posso te ajudar hoje?"
        }
    ]

# Header Principal
st.markdown(f"""
<div class="header-card">
    <div class="header-title">🤖 AgenteTutorML</div>
    <div class="header-subtitle">Seu Mentor de Machine Learning para Iniciantes • No-Code / Low-Code & RAG com Tavily API</div>
</div>
""", unsafe_allow_html=True)

# Sidebar com Status e Configurações
with st.sidebar:
    st.image("https://img.icons8.com/color/96/000000/brain.png", width=70)
    st.title("📌 Status do Tutor")
    st.write(f"**Persona:** {PERSONA['name']}")
    st.write(f"**Tom:** {PERSONA['tone']}")
    st.write(f"**Abordagem:** {PERSONA['approach']}")
    st.markdown("---")
    st.subheader("⚙️ Configurações RAG")
    tavily_enabled = st.checkbox("Ativar Busca Web Tavily (Documentações)", value=True)
    st.markdown("---")
    st.info("💡 **Dica:** Utilize o plano de 6 semanas na aba ao lado para acompanhar sua evolução!")

# Abas da Aplicação
tab_chat, tab_plan, tab_tavily, tab_quiz = st.tabs([
    "💬 Chat com TutorML",
    "📅 Plano de Estudos (6 Semanas)",
    "🌐 Central Tavily (Web Scraping)",
    "🧩 Quizzes & Mini-Projetos"
])

# ---------------------------------------------------------
# TAB 1: Chat Interativo com o TutorML
# ---------------------------------------------------------
with tab_chat:
    st.subheader("💬 Converse com o TutorML")
    st.caption("Faça perguntas sobre Machine Learning, peça explicações teóricas ou envie códigos para receber feedback didático.")

    # Exibe Histórico de Chat
    for msg in st.session_state.chat_history:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    # Entrada do Usuário
    user_input = st.chat_input("Digite sua dúvida de ML (ex: O que é Regressão Logística? Como funciona o K-Means?)...")

    if user_input:
        # Adiciona mensagem do usuário
        st.session_state.chat_history.append({"role": "user", "content": user_input})
        with st.chat_message("user"):
            st.markdown(user_input)

        # Gera resposta do TutorML
        with st.chat_message("assistant"):
            with st.spinner("TutorML está consultando as documentações oficiais e preparando sua resposta..."):
                response = st.session_state.agent.answer_user_query(user_input, use_tavily=tavily_enabled)
                st.markdown(response)
                st.session_state.chat_history.append({"role": "assistant", "content": response})

# ---------------------------------------------------------
# TAB 2: Plano de Estudos em 6 Semanas
# ---------------------------------------------------------
with tab_plan:
    st.subheader("📅 Trilha de Aprendizado em 6 Semanas")
    st.write("Estrutura sequencial elaborada para transformar iniciantes em praticantes de Machine Learning.")

    weeks = st.session_state.study_mgr.get_all_weeks()
    selected_week_num = st.selectbox(
        "Selecione a Semana para Detalhes:",
        options=[w["week"] for w in weeks],
        format_func=lambda x: f"Semana {x}: {weeks[x-1]['topic']}"
    )

    week_data = st.session_state.study_mgr.get_week_details(selected_week_num)

    if week_data:
        st.markdown(f"""
        <div class="week-card">
            <div class="week-badge">SEMANA {week_data['week']}</div>
            <h3>{week_data['topic']}</h3>
            <p>{week_data['summary']}</p>
            <p><strong>🛠️ Ferramenta Recomendada (No-Code / Low-Code):</strong> {week_data['low_code_tool']}</p>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("#### 🧪 Mini-Projeto & Notebook Prático (Google Colab)")
        st.write(f"**Título:** {week_data['mini_project']['title']}")
        st.write(f"**Objetivo:** {week_data['mini_project']['goal']}")
        
        st.code(week_data['mini_project']['colab_snippet'], language="python")

# ---------------------------------------------------------
# TAB 3: Central Tavily (Raspagem & RAG)
# ---------------------------------------------------------
with tab_tavily:
    st.subheader("🌐 Extração de Documentação Oficial via Tavily API")
    st.write("Digite um tópico para raspar conteúdos atualizados de páginas como IBM, TensorFlow, Google Developers e Scikit-Learn para alimentar a base de conhecimento RAG do tutor.")

    col1, col2 = st.columns([3, 1])
    with col1:
        scrape_topic = st.text_input("Tópico de ML para Pesquisar e Indexar:", placeholder="ex: PyCaret Classification tutorial, TensorFlow Keras, Scikit-Learn Pipelines")
    with col2:
        st.write("") # Espaçamento
        st.write("")
        btn_scrape = st.button("🔍 Extrair e Indexar")

    if btn_scrape and scrape_topic:
        with st.spinner(f"Raspando páginas oficiais sobre '{scrape_topic}' via Tavily..."):
            results = st.session_state.agent.scrape_and_index_topic(scrape_topic)
            st.success(f"Sucesso! {len(results)} documento(s) raspado(s) e indexados no Banco Vetorial RAG!")
            
            for doc in results:
                with st.expander(f"📌 {doc['title']}"):
                    st.write(f"**URL:** [{doc['url']}]({doc['url']})")
                    st.write(f"**Snippet Extraído:** {doc['snippet']}")

    st.markdown("---")
    st.subheader("📚 Documentos Atualmente Indexados na Base Vetorial")
    all_docs = st.session_state.agent.vector_store.documents
    if all_docs:
        st.write(f"Total de Documentos no Banco: **{len(all_docs)}**")
        for idx, d in enumerate(all_docs, 1):
            st.caption(f"{idx}. {d.get('title')} ({d.get('url')})")
    else:
        st.info("Nenhum documento indexado ainda. Faça uma busca acima!")

# ---------------------------------------------------------
# TAB 4: Quizzes & Mini-Projetos
# ---------------------------------------------------------
with tab_quiz:
    st.subheader("🧩 Avaliação de Conhecimento e Feedback Automático")
    st.write("Teste seu aprendizado com quizzes ou submeta um trecho de código/resposta para receber análise do TutorML.")

    quiz_week = st.selectbox("Escolha o tópico da semana para o Quiz:", options=[1, 2, 3, 4, 5, 6], format_func=lambda x: f"Semana {x}")
    week_info = st.session_state.study_mgr.get_week_details(quiz_week)

    if week_info and "quiz" in week_info and week_info["quiz"]:
        st.markdown(f"### Quiz da Semana {quiz_week}: {week_info['topic']}")
        
        for q_idx, quiz_item in enumerate(week_info["quiz"]):
            st.markdown(f"**Pergunta {q_idx + 1}:** {quiz_item['question']}")
            user_choice = st.radio(
                f"Selecione uma opção (Q{q_idx+1}):",
                options=quiz_item["options"],
                key=f"quiz_{quiz_week}_{q_idx}"
            )
            
            if st.button(f"Verificar Resposta (Q{q_idx+1})", key=f"btn_{quiz_week}_{q_idx}"):
                chosen_idx = quiz_item["options"].index(user_choice)
                if chosen_idx == quiz_item["correct"]:
                    st.success(f"🎉 Correto! {quiz_item['explanation']}")
                else:
                    st.error(f"❌ Não foi desta vez! {quiz_item['explanation']}")
            st.markdown("---")

    st.markdown("### 📝 Enviar Código / Resposta para Feedback")
    user_submission = st.text_area("Cole seu código Python ou escreva sua explicação abaixo:", height=150, placeholder="def treinar_modelo():\n    ...")
    if st.button("Enviar para Feedback do TutorML"):
        if user_submission:
            feedback_res = st.session_state.agent.evaluate_submission(user_submission, topic=week_info['topic'])
            st.markdown(feedback_res)
        else:
            st.warning("Escreva ou cole algo antes de enviar!")
