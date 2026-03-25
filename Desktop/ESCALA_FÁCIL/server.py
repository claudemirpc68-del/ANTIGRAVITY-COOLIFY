"""
ESCALA_FÁCIL - Servidor Flask / Webhook Twilio
Recebe mensagens do WhatsApp via Twilio e responde com a lógica do bot.
Refatorado para arquitetura de serviços (BotService).
"""

import os
import sys
from typing import Optional
from functools import wraps

import platform
if platform.system() == "Windows":
    TWILIO_LIB_PATH = r"C:\twilio_lib"
    if TWILIO_LIB_PATH not in sys.path:
        sys.path.insert(0, TWILIO_LIB_PATH)
from flask import Flask, request, send_from_directory
from flask_cors import CORS
from twilio.twiml.messaging_response import MessagingResponse
from twilio.request_validator import RequestValidator
from dotenv import load_dotenv

# Adiciona o diretório raiz ao path para importar os scripts/serviços
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from services.bot_service import BotService

load_dotenv()

app = Flask(__name__, static_folder='assets', static_url_path='/assets')
CORS(app)

# Inicializa o orquestrador do bot
bot_service = BotService()

# -----------------------------------------------------------------------
# Segurança: Validação de Assinatura Twilio
# -----------------------------------------------------------------------

def validate_twilio_request(f):
    """Decorador para validar se a requisição partiu realmente do Twilio ou do Simulador."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Se for do simulador (mesmo origin), permitimos
        # Nota: Em produção real, poderíamos usar um token específico para o simulador
        is_simulator = request.referrer and request.host in request.referrer
        
        if is_simulator:
            return f(*args, **kwargs)

        validator = RequestValidator(os.environ.get("TWILIO_AUTH_TOKEN"))
        
        # FIX PROXY: O Coolify/Traefik passa a requisição como http:// internamente, 
        # mas o Twilio assina como https://. Forçamos a conversão.
        url = request.url.replace("http://", "https://", 1) if "http://" in request.url else request.url
        
        signature = request.headers.get("X-Twilio-Signature", "")
        params = request.form.to_dict()

        if not validator.validate(url, params, signature) and not app.debug:
            print(f"⚠️ Acesso bloqueado (Signature Mismatch). URL: {url} | Signature: {signature}")
            return "Unauthorized", 403
        
        return f(*args, **kwargs)
    return decorated_function

# -----------------------------------------------------------------------
# Rotas
# -----------------------------------------------------------------------

@app.route("/", methods=["GET"])
def index():
    """Serve a interface web do simulador (frontend)."""
    return send_from_directory(".", "simulator.html")


@app.route("/webhook", methods=["POST"])
@validate_twilio_request
def webhook():
    """Endpoint principal do Webhook WhatsApp."""
    numero = request.form.get("From", "")
    texto = request.form.get("Body", "").strip()
    
    # Captura múltiplas mídias
    num_media = int(request.form.get("NumMedia", 0))
    media_urls = [request.form.get(f"MediaUrl{i}") for i in range(num_media) if request.form.get(f"MediaUrl{i}")]
    media_url_str = ",".join(media_urls) if media_urls else None

    # Processamento Pro-Max via BotService
    resposta_texto = bot_service.process_message(numero, texto, media_url=media_url_str)

    resp = MessagingResponse()
    resp.message(resposta_texto)

    return str(resp), 200


@app.route("/health", methods=["GET"])
def health():
    return {"status": "ok", "project": "ESCALA_FÁCIL"}, 200


# Ativos estáticos são servidos automaticamente via Flask static_folder='assets'


# -----------------------------------------------------------------------
# Execução
# -----------------------------------------------------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"[ESCALA_FÁCIL] Servidor Pro-Max rodando na porta {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)
