# 🚀 Viral LinkedIn

O **Viral LinkedIn** é uma plataforma avançada de criação e análise de conteúdo voltada para maximizar o engajamento na rede profissional. Utilizando o poder da Inteligência Artificial (Gemini e OpenAI), o projeto oferece ferramentas completas para creators e profissionais que buscam consistência e viralidade.

## ✨ Funcionalidades

- **📊 Análise de Conteúdo:** Avalie seus posts e receba insights baseados em IA para melhorar performance e alcance.
- **🎨 Gerador de Carrossel:** Crie carrosséis visualmente impactantes para o LinkedIn de forma automatizada.
- **🖼️ Galeria de Imagens AI:** Gere imagens personalizadas com prompts e estilos diversos para ilustrar suas publicações.
- **💬 Chat de Ideação:** Um assistente inteligente para brainstorm de temas, roteiros e estratégias de conteúdo.
- **📅 Calendário Editorial:** Organize sua frequência de postagens e planeje seu crescimento a longo prazo.
- **🏠 Dashboard Centralizado:** Visão geral das suas métricas e acesso rápido a todas as ferramentas.

## 🛠️ Tecnologias

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Backend/Banco de Dados:** [Supabase](https://supabase.com/) (Auth & PostgreSQL)
- **Inteligência Artificial:**
  - [Google Gemini AI](https://ai.google.dev/)
  - [OpenAI (GPT-4/DALL-E)](https://openai.com/)
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Deployment:** [Coolify](https://coolify.io/) & Docker

## 🚀 Como Começar

### Pré-requisitos

- Node.js 20+
- Conta no Supabase
- Chaves de API do Google Gemini e/ou OpenAI

### Instalação Local

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/ANTIGRAVITY-COOLIFY.git
    cd viral-linkedin
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env.local` na raiz do projeto e adicione suas credenciais:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=seu_url_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
    GEMINI_API_KEY=sua_chave_gemini
    OPENAI_API_KEY=sua_chave_openai
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📦 Deployment via Coolify

Este projeto está configurado para ser implantado facilmente usando o **Coolify**.

1.  Conecte seu repositório GitHub ao painel do Coolify.
2.  Utilize o `Dockerfile` ou a configuração automática de Nixpacks inclusa no projeto.
3.  Configure as variáveis de ambiente no painel administrativo do Coolify.
4.  O projeto utiliza a porta `3000` por padrão.

---

Desenvolvido com ❤️ para transformar sua presença no LinkedIn.

