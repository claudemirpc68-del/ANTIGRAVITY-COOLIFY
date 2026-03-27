import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

# Configurações Twilio
account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
whatsapp_number = os.environ.get('TWILIO_WHATSAPP_NUMBER')

# Dados de Claudemir
NOME = "CLAUDEMIR"
NUMERO_DESTINO = "whatsapp:+5511961909818"

def enviar_teste():
    print(f"🚀 Enviando mensagem de teste para {NOME} ({NUMERO_DESTINO})...")
    
    if not all([account_sid, auth_token, whatsapp_number]):
        print("❌ Erro: Credenciais do Twilio não encontradas no .env!")
        return

    try:
        client = Client(account_sid, auth_token)
        
        msg_body = (
            f"Olá, *{NOME}*! 🤖\n\n"
            "Este é um teste oficial de envio do assistente *ESCALA_FÁCIL* para o seu número real.\n\n"
            "Se você está lendo isso, a integração outbound está funcionando perfeitamente! ✅\n"
            "Digite *MENU* para começar a interagir."
        )

        message = client.messages.create(
            from_=whatsapp_number,
            body=msg_body,
            to=NUMERO_DESTINO
        )
        print(f"✅ Mensagem enviada com sucesso! SID: {message.sid}")
    except Exception as e:
        print(f"❌ Falha ao enviar mensagem: {e}")

if __name__ == "__main__":
    enviar_teste()
