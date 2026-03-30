# Estrutura do Workflow - Angie Assistant

## Visão Geral

O workflow da Angie Assistant é composto por 5 fases principais:

1. **Trigger** - Recebimento da mensagem do Telegram
2. **Processamento** - Verificação do tipo de mensagem (texto/áudio)
3. **IA** - Análise da mensagem e decisão sobre ferramentas
4. **Execução** - Chamada das APIs externas
5. **Resposta** - Envio da resposta ao usuário

## Diagrama de Fluxo

```
Telegram Trigger
       │
       ▼
Check Message Type
       │
       ├────► (áudio) ──► Get Audio ──► Transcribe
       │                                    │
       ▼                                    ▼
  Prepare Message ◄───────────────────────►
       │
       ▼
  AI Function Call
       │
       ▼
 If Tools Called?
       │
       ├────► SIM ──► Parse Tools ──► Loop
       │                        │
       │                        ▼
       │              ┌────┬────┬────┬────┐
       │              │    │    │    │    │
       │              ▼    ▼    ▼    ▼    ▼
       │           Gmail Calendar Tasks Contacts
       │              │    │    │    │    │
       │              └────┴────┴────┴────┘
       │                        │
       ▼                        ▼
  AI Final Response ◄── Collect Results
       │
       ▼
  Send Reply (Telegram)
```

## Nós Principais

### Trigger
- **Telegram Trigger**: Recebe mensagens de texto e áudio

### Processamento
- **Code (Check Message Type)**: Identifica se é áudio ou texto
- **IF**: Direciona o fluxo baseado no tipo
- **Telegram**: Baixa arquivos de áudio

### IA
- **HTTP Request (OpenAI)**: Chama API da OpenAI com tools
- **Code**: Prepara mensagens para a IA
- **IF**: Verifica se a IA usou ferramentas

### Execução
- **Split in Batches**: Itera sobre as ferramentas a chamar
- **IFs**: Direciona para cada API específica
- **Gmail**: Busca e-mails
- **Google Calendar**: Busca eventos
- **Baserow**: Busca tarefas e contatos

### Resposta
- **HTTP Request**: Gera resposta final com resultados
- **Telegram (Send)**: Envia mensagem ao usuário

## Configuração de Variáveis de Ambiente

```bash
# .env
TELEGRAM_BOT_TOKEN=seu_bot_token
OPENAI_API_KEY=sua_openai_key
BASEROW_API_KEY=sua_baserow_key
BASEROW_TABLE_TASKS=id_da_tabela
BASEROW_TABLE_CONTATOS=id_da_tabela
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
```

## Credenciais no n8n

1. **Telegram API**: Bot Token do @BotFather
2. **OpenAI API**: API Key da plataforma OpenAI
3. **Google OAuth2**: Credentials do GCP
4. **Baserow API**: API Token do Baserow
