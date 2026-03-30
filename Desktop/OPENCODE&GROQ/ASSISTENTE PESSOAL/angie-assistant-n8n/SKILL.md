---
name: angie-assistant-n8n
description: Cria workflows de automação no n8n para a assistente pessoal Angie. Use esta skill sempre que o usuário quiser criar, modificar ou expandir automações no n8n para uma assistente de IA que integra Telegram, Gmail, Google Calendar, e Baserow (para tarefas e contatos). Inclui templates prontos para deploy e instruções de configuração de credenciais.
---

# Angie Assistant - n8n Automation Skill

Esta skill cria workflows completos no n8n para uma assistente pessoal de IA chamada Angie que opera via Telegram.

## Quando usar esta skill

Use esta skill quando o usuário mencionar:
- "Angie" ou "assistente pessoal"
- "automação n8n" ou "workflow n8n"
- "Telegram bot" + "IA"
- Integrações com Gmail, Calendar, Baserow
- Assistente de voz ou texto via Telegram

## Estrutura do Projeto

```
angie-assistant-n8n/
├── SKILL.md
├── references/
│   ├── workflow-structure.md
│   └── n8n-nodes-reference.md
└── templates/
    ├── main-workflow.json
    ├── telegram-trigger.json
    ├── gmail-integration.json
    ├── calendar-integration.json
    └── baserow-integration.json
```

## Workflow Principal

### 1. Telegram Trigger (Gatilho)

O workflow inicia com um nó Telegram Trigger que fica à escuta de mensagens.

**Configuração do nó Telegram:**
- **Trigger Type**: Receive Message
- **Updates**: message (para receber mensagens de texto)
- **Additional Fields**: audio (para mensagens de voz)

### 2. Verificação de Tipo de Mensagem

**Nós IF:**
- Verifica `json.message.audio` existe
- Se SIM → ir para nó de Transcription
- Se NÃO → ir para nó de Processamento de Texto

### 3. Transcription (Áudio → Texto)

**Nós necessários:**
- Telegram Binary Data (para obter o arquivo de áudio)
- OpenAI Speech to Text
  - Model: whisper-1
  - Language: pt-BR (para português)

### 4. Processamento de Texto

**Nós necessários:**
- Set (copiar texto da mensagem)
- IF (verificar tipo de comando)

### 5. Integrações

#### Gmail - Buscar E-mails
- ** nó: Gmail**
- **Operation**: getMany
- **Return All**: true
- **Filters**: `after: {{ $json.date }}`

#### Google Calendar - Buscar Eventos
- ** nó: Google Calendar**
- **Operation**: getMany
- **Start Time**: `{{ $json.startDate }}`
- **End Time**: `{{ $json.endDate }}`

#### Baserow - Tarefas
- ** nó: Baserow**
- **Operation**: list rows
- **Table ID**: (ID da tabela de tarefas)
- **Filter**: `field: status, operator: equals, value: pending`

#### Baserow - Contatos
- ** nó: Baserow**
- **Operation**: list rows
- **Table ID**: (ID da tabela de contatos)

### 6. IA Processing (OpenAI)

**Nós necessários:**
- HTTP Request (chamar API OpenAI)
- Method: POST
- URL: `https://api.openai.com/v1/chat/completions`
- Headers:
  - Authorization: `Bearer {{ $credentials.openai_api_key }}`
  - Content-Type: application/json
- Body:
```json
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "Você é a Angie, uma assistente pessoal útil. Responda de forma clara e concisa."
    },
    {
      "role": "user",
      "content": "{{ $json.user_message }}"
    }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_emails",
        "description": "Buscar e-mails recentes",
        "parameters": {
          "type": "object",
          "properties": {
            "date": {"type": "string", "description": "Data no formato YYYY-MM-DD"}
          },
          "required": ["date"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "get_calendar",
        "description": "Buscar eventos do calendário",
        "parameters": {
          "type": "object",
          "properties": {
            "startDate": {"type": "string"},
            "endDate": {"type": "string"}
          },
          "required": ["startDate", "endDate"]
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "get_tasks",
        "description": "Buscar tarefas pendentes",
        "parameters": {
          "type": "object",
          "properties": {}
        }
      }
    },
    {
      "type": "function",
      "function": {
        "name": "get_contacts",
        "description": "Buscar contatos",
        "parameters": {
          "type": "object",
          "properties": {
            "name": {"type": "string", "description": "Nome do contato"}
          },
          "required": ["name"]
        }
      }
    }
  ],
  "tool_choice": "auto"
}
```

### 7. Execução de Ferramentas

Após a IA decidir qual ferramenta usar:
- **Switch**: verificar `json.tool_calls[0].function.name`
- Para cada função: executar a chamada correspondente
- **Merge**: combinar resultados das ferramentas

### 8. Resposta Final

**Nós necessários:**
- OpenAI (segunda chamada para gerar resposta final)
- Telegram (Send Message)
- **Chat ID**: `{{ $json.message.chat.id }}`
- **Text**: `{{ $json.ai_response }}`

## Configuração de Credenciais

### Telegram
1. Criar bot via @BotFather no Telegram
2. Obter Bot Token
3. No n8n: Credentials > Telegram > Add > Bot Token

### OpenAI
1. Gerar API Key em platform.openai.com
2. No n8n: Credentials > OpenAI API > Add > API Key

### Google (Gmail + Calendar)
1. Criar projeto em console.cloud.google.com
2. Habilitar Gmail API e Google Calendar API
3. Criar OAuth credentials
4. No n8n: Credentials > Google OAuth2 > Add

### Baserow
1. Criar conta em baserow.io
2. Criar banco de dados com tabelas: Tarefas, Contatos
3. Gerar API Token em Baserow
4. No n8n: Credentials > Baserow API > Add > API Token

## Estrutura das Tabelas Baserow

### Tabela: Tarefas
| Campo | Tipo |
|-------|------|
| titulo | Single line text |
| descricao | Long text |
| data_limite | Date |
| status | Single select (Pendente, Concluída) |
| prioridade | Single select (Alta, Média, Baixa) |

### Tabela: Contatos
| Campo | Tipo |
|-------|------|
| nome | Single line text |
| telefone | Phone number |
| email | Email |
| empresa | Single line text |
| cargo | Single line text |

## Templates JSON

Para cada componente, gere o JSON completo do workflow n8n seguindo o formato padrão:

```json
{
  "name": "Angie Assistant - Main Workflow",
  "nodes": [
    {
      "parameters": {},
      "id": "telegram-trigger",
      "name": "Telegram Trigger",
      "type": "n8n-nodes-base.telegramTrigger",
      "typeVersion": 1,
      "position": [250, 300],
      "webhookId": "angie-assistant"
    }
  ],
  "connections": {},
  "active": false,
  "settings": {},
  "id": "angie-main-workflow"
}
```

## Como gerar a automação

1. **Identifique a necessidade**: Pergunte qual parte do workflow precisa criar/modificar
2. **Gere o JSON**: Crie o template JSON do nó/componente necessário
3. **Explique a configuração**: Forneça instruções passo a passo
4. **Teste**: Indique como testar cada componente

## Boas Práticas

- Sempre use variáveis dinâmicas `{{ $json.campo }}`
- Mantenha credenciais em variáveis de ambiente quando possível
- Adicione nós de Error Workflow para tratar falhas
- Useノード de IF para verificar dados antes de processar
- Implemente rate limiting para evitar abuse
- Faça backup dos workflows antes de modificar
