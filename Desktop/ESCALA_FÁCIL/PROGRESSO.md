# Progresso ESCALA_FÁCIL - 25/03/2026

## O que foi feito hoje

### 1. Correção do servidor local
- Problema: Twilio não instalava no Windows (erro caminhos longos)
- Solução: Instalar twilio em diretório curto `C:\twilio_lib`
- Arquivo: `server.py` atualizado com caminho condicional para Windows

### 2. Correção do simulador
- Problema: Rota `/simulator.html` retornava 404
- Solução: Adicionada rota explícita e variável BASE_DIR

### 3. Integração Groq
- Criado `scripts/api_groq.py` para usar Groq API (mais rápido e barato que OpenAI)
- Atualizado `bot_service.py` e `menu_handler.py` para usar Groq
- Adicionado `groq==0.11.0` no requirements.txt
- API Key Groq configurada no Coolify

### 4. Correção do modelo Groq
- Problema: Modelo `llama-3.1-70b-versatile` foi descontinuado
- Solução: Atualizado para `llama-3.3-70b-versatile`

### 5. Correção de login
- Problema: Não conseguia fazer login com sessão ativa
- Solução: Permite login com matrícula de 6 dígitos a qualquer momento

## URLs
- Bot produção: https://assai-bot.72.61.130.70.sslip.io
- GitHub: https://github.com/claudemirpc68-del/ANTIGRAVITY-COOLIFY

## Variáveis de Ambiente (Coolify)
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_WHATSAPP_NUMBER
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- GROQ_API_KEY

## Para continuar amanhã
1. Testar o bot via WhatsApp (enviar 101010)
2. Verificar se o Groq está respondendo corretamente
3. Ajustar o system prompt se necessário
