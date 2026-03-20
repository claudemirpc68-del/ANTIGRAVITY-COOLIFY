import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
whatsapp_number = os.environ.get('TWILIO_WHATSAPP_NUMBER')

print(f"🔍 Analisando credenciais Twilio...")
print(f"SID: {account_sid[:5]}...")
print(f"Number: {whatsapp_number}")

if not account_sid or not auth_token:
    print("❌ Credenciais ausentes no .env!")
    exit(1)

try:
    client = Client(account_sid, auth_token)
    # Tenta listar as mensagens (apenas para validar conexão)
    messages = client.messages.list(limit=1)
    print("✅ Conexão com Twilio: SUCESSO!")
except Exception as e:
    print(f"❌ Falha na conexão Twilio: {e}")
