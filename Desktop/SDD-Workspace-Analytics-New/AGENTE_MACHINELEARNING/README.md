# 🤖 AgenteTutorML - Mentor de Machine Learning para Iniciantes

O **AgenteTutorML** é um agente inteligente interativo projetado para ensinar Machine Learning a iniciantes de forma acessível, amigável e com forte orientação **No-Code/Low-Code**. 

Ele integra raspagem de documentações técnicas oficiais (IBM, TensorFlow, Google Developers, Scikit-Learn, PyTorch) via **Tavily API**, banco vetorial local/RAG, e um plano de estudos estruturado de 6 semanas com quizzes e mini-projetos para Google Colab.

---

## ✨ Funcionalidades Principais

- 🤖 **Persona TutorML**: Atendimento didático, encorajador e adaptado ao nível de conhecimento do usuário.
- 🌐 **RAG & Web Scraping com Tavily**: Busca e extração automática de páginas oficiais para fundamentar respostas teóricas.
- 🧠 **Banco Vetorial RAG**: Armazenamento semântico de documentos técnicos para consultas instantâneas.
- 📅 **Plano de Estudos de 6 Semanas**:
  - **Semana 1:** Fundamentos de dados e estatística
  - **Semana 2:** Aprendizado supervisionado (Regressão e Classificação)
  - **Semana 3:** Aprendizado não supervisionado (Clustering e PCA)
  - **Semana 4:** Redes neurais e deep learning
  - **Semana 5:** NLP e visão computacional
  - **Semana 6:** MLOps e aplicações reais
- 🧩 **Quizzes & Mini-Projetos Automáticos**: Avaliação contínua de conhecimento e gerador de exercícios prontos para rodar no Google Colab.
- 🖥️ **Interface Web Interativa**: Painel Streamlit em tom Dark Mode com design de alta fidelidade e visualização rica.

---

## 🚀 Como Executar o Projeto

### 1. Instalar as Dependências
Abra o terminal no diretório do projeto e execute:

```bash
pip install -r requirements.txt
```

### 2. Configurar Variáveis de Ambiente (Opcional)
Crie um arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

Adicione sua chave da API do Tavily se desejar buscar documentações em tempo real:
`TAVILY_API_KEY=tvly-sua-chave-aqui`

*(Nota: Se a chave não for configurada, o sistema utilizará a base interna e o modo de simulação sem falhar).*

### 3. Iniciar a Interface Web
Execute o comando do Streamlit:

```bash
streamlit run ui/app.py
```

Acesse no seu navegador em `http://localhost:8501`.

---

## 🧪 Rodar a Suíte de Testes

Para garantir o funcionamento de todos os módulos:

```bash
pytest tests/
```
