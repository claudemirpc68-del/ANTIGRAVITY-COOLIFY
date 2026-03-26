import os
import requests
from dotenv import load_dotenv

load_dotenv()

account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
whatsapp_number = os.environ.get('TWILIO_WHATSAPP_NUMBER')

NUMERO_DESTINO = "whatsapp:+5511961909818"
NOME = "CLAUDEMIR"

def enviar_mensagem():
    print(f"TESTE: Enviando mensagem para {NOME} ({NUMERO_DESTINO})...")

    if not all([account_sid, auth_token, whatsapp_number]):
        print("ERRO: Credenciais nao encontradas!")
        return

    url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"

    auth = (account_sid, auth_token)

    data = {
        "To": NUMERO_DESTINO,
        "From": whatsapp_number,
        "Body": f"Ola, {NOME}!\n\nEste e um teste do assistente ESCALA_FACIL.\nSe voce esta lendo isso, a integracao outbound esta funcionando!\nDigite MENU para comecar."
    }

    try:
        response = requests.post(url, auth=auth, data=data)
        if response.status_code in [200, 201]:
            result = response.json()
            print(f"OK: Mensagem enviada! SID: {result.get('sid')}")
        else:
            print(f"ERRO: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"ERRO: {e}")

if __name__ == "__main__":
    enviar_mensagem()
