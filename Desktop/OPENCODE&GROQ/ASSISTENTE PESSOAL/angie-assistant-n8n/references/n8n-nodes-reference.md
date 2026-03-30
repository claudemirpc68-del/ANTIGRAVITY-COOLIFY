# Referência de Nós n8n

## Nós Utilizados

### Telegram Trigger
- **Pacote**: n8n-nodes-base
- **Versão**: 1.2
- **Configuração**:
  - Updates: message, edited_message, callback_query
  - Webhook ID: angie-assistant

### Telegram
- **Pacote**: n8n-nodes-base
- **Versão**: 3
- **Operações**:
  - sendMessage: Envia mensagem de texto
  - sendAudio: Envia arquivo de áudio
  - get: Baixa arquivo

### OpenAI
- **Pacote**: n8n-nodes-base
- **Versão**: 3
- **Operações**:
  - whisper: Transcreve áudio
  - chat: Gera respostas
  - assistant: Gerencia assistentes

### Gmail
- **Pacote**: n8n-nodes-base
- **Versão**: 2
- **Operações**:
  - getAll: Busca e-mails
  - send: Envia e-mail
  - label: Gerencia labels

### Google Calendar
- **Pacote**: n8n-nodes-base
- **Versão**: 3
- **Operações**:
  - getAll: Lista eventos
  - create: Cria evento
  - update: Atualiza evento

### Baserow
- **Pacote**: n8n-nodes-base
- **Versão**: 1
- **Operações**:
  - listRows: Lista registros
  - getRow: Busca registro específico
  - createRow: Cria registro
  - updateRow: Atualiza registro
  - deleteRow: Deleta registro

### Code
- **Pacote**: n8n-nodes-base
- **Versão**: 2
- **JavaScript**: Executa código JavaScript
- **Exemplo**:
```javascript
// Acessar dados de entrada
const input = $input.first().json;

// Retornar novos dados
return {
  json: {
    novo_campo: input.campo_existente
  }
};
```

### IF
- **Pacote**: n8n-nodes-base
- **Versão**: 1.1
- **Condições suportadas**:
  - string: equals, notEqual, contains, startsWith, endsWith
  - number: equals, notEqual, greater, smaller
  - boolean: isTrue, isFalse
  - object: isEmpty, isNotEmpty

### Switch
- **Pacote**: n8n-nodes-base
- **Versão**: 1
- **Data mode**: Boolean, Number, String, Expression
- **Fallback**: Rota padrão quando nenhuma condição é atendida

### Merge
- **Pacote**: n8n-nodes-base
- **Versão**: 2
- **Modes** - join, pass, combine
- **Multiple input**: Ate 4 entradas

### Split in Batches
- **Pacote**: n8n-nodes-base
- **Versão**: 3
- **Batch size**: Número de itens por execução
- **Options**: Loop over items, dot notation

### HTTP Request
- **Pacote**: n8n-nodes-base
- **Versão**: 4
- **Methods**: GET, POST, PUT, PATCH, DELETE
- **Authentication**:
  - None, Basic Auth, Header Auth, OAuth2, API Key

## Configuração de Credentials

### Telegram
```json
{
  "accessToken": "bot_token_aqui"
}
```

### OpenAI
```json
{
  "apiKey": "sk-aqui"
}
```

### Google OAuth2
```json
{
  "clientId": "client_id",
  "clientSecret": "client_secret",
  "oauthTokenData": {
    "access_token": "token",
    "refresh_token": "refresh_token",
    "expires_in": 3600
  }
}
```

### Baserow
```json
{
  "apiToken": "token_aqui"
}
```
