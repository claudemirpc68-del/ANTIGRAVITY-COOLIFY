# Manual: Bot do Telegram para Supabase

Este workflow transforma seu bot do Telegram em um administrador para sua tabela `contatos` no Supabase.

## Como Configurar

### 1. Criar o Bot
1. No Telegram, fale com o [@BotFather](https://t.me/botfather).
2. Use o comando `/newbot` e siga as instruções para obter o seu **API Token**.

### 2. Importar no n8n
1. Importe o arquivo `telegram_supabase_bot.json` no n8n.
2. Adicione suas credenciais do **Telegram API** (usando o token que você criou).
3. Adicione suas credenciais do **Supabase**.

## Comandos Disponíveis

Envie uma das mensagens abaixo para o seu bot:

| Objetivo | Comando | Exemplo |
| :--- | :--- | :--- |
| **Listar tudo** | `listar` | `listar` |
| **Cadastrar** | `cadastrar NOME EMAIL` | `cadastrar Carlos carlos@email.com` |
| **Remover** | `deletar ID` | `deletar 12` |

> [!TIP]
> O bot responderá automaticamente com a confirmação ou a lista de contatos formatada.
