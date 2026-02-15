# Projeto Antigravity

Bem-vindo ao repositório oficial do projeto **Antigravity**. Este é um monorepo que integra múltiplas aplicações modernas, automação e inteligência artificial.

## 📂 Estrutura do Monorepo

O projeto está organizado em três aplicações principais:

1.  **`viral-linkedin`** (Next.js)
    *   **Propósito**: Aplicação web para geração de posts virais e análise de engajamento no LinkedIn usando IA.
    *   **Tecnologias**: Next.js 14+, TailwindCSS, OpenAI API, Supabase Auth.
    *   **Localização**: `/viral-linkedin`

2.  **`aplicativo-cadastro-api`** (Node.js)
    *   **Propósito**: API REST para gerenciamento e cadastro de clientes.
    *   **Tecnologias**: Node.js, Express, PostgreSQL (Supabase).
    *   **Localização**: `/APLICATIVO_CADASTRO/server`

3.  **`antigravity-raiz`** (Node.js)
    *   **Propósito**: Aplicação central/dashboard (em desenvolvimento).
    *   **Tecnologias**: Node.js.
    *   **Localização**: `/` (Raiz)

---

## 🚀 Guia de Deploy (Coolify)

Este projeto utiliza **Dockerfiles** nativos para garantir builds robustos e independentes da plataforma.

### Pré-requisitos
- Instância do Coolify rodando.
- Chaves de API (OpenAI, Supabase) em mãos.

### Configuração Obrigatória no Coolify
Para que os deploys funcionem corretamente no Coolify, você **DEVE** ajustar manualmente os caminhos de build para cada aplicação. O Coolify não detecta automaticamente Dockerfiles em subdiretórios de monorepos complexos sem essa ajuda.

#### 1. Configurar Caminhos (Base Directory & Dockerfile)
Vá em **Configuration** > **General** (ou Build Pack) de cada aplicação e defina:

| Aplicação | Build Pack | Base Directory | Dockerfile Location |
| :--- | :--- | :--- | :--- |
| **viral-linkedin** | Dockerfile | `/` | `/viral-linkedin/Dockerfile` |
| **aplicativo-cadastro-api** | Dockerfile | `/` | `/APLICATIVO_CADASTRO/server/Dockerfile` |
| **antigravity-raiz** | Dockerfile | `/` | `/Dockerfile` |

> **Atenção**: Definir o Base Directory como `/` é crucial para que o Docker tenha acesso a todo o contexto do repositório durante o build.

#### 2. Variáveis de Ambiente (Environment Variables)
Configure as seguintes variáveis na aba **Environment Variables** das respectivas aplicações:

**Para `viral-linkedin`:**
*   `OPENAI_API_KEY`: Sua chave da OpenAI (começa com `sk-...`).
*   `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase.
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave pública do Supabase.

**Para `aplicativo-cadastro-api`:**
*   `DATABASE_URL` (ou variáveis de conexão específicas do seu código): String de conexão com o PostgreSQL do Supabase.

---

## 🤖 Integrações

### OpenAI (IA Generativa)
O projeto `viral-linkedin` utiliza a API da OpenAI (modelos GPT-4o ou GPT-3.5-turbo) para:
- Gerar sugestões de posts com copy persuasiva.
- Analisar tendências e melhoria de perfil.
Configuração: A chave `OPENAI_API_KEY` deve estar presente nas variáveis de ambiente.

### Supabase (Backend as a Service)
Utilizamos o Supabase para:
- **Autenticação**: Gerenciamento de usuários (Login/Cadastro).
- **Database**: Banco de dados PostgreSQL para persistência de dados.
Configuração: As credenciais (`URL` e `ANON_KEY`) são necessárias tanto no frontend quanto no backend.

### n8n (Automação)
Fluxos de trabalho inteligentes (localizados na pasta `Workflow n8n` ou gerenciados externamente) interagem com o banco de dados para automações de CRM e marketing.

---

## 🛠️ Como Rodar Localmente

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/claudemirpc68-del/ANTIGRAVITY-COOLIFY.git
    cd ANTIGRAVITY-COOLIFY
    ```

2.  **Para `viral-linkedin`:**
    ```bash
    cd viral-linkedin
    npm install
    # Crie um arquivo .env.local com suas chaves
    npm run dev
    ```

3.  **Para `aplicativo-cadastro-api`:**
    ```bash
    cd APLICATIVO_CADASTRO/server
    npm install
    npm start
    ```

---

*Documentação atualizada automaticamente pelo Agente Antigravity.*
