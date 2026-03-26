import os
import requests
import time
from dotenv import load_dotenv

load_dotenv()

whatsapp_number = os.environ.get('TWILIO_WHATSAPP_NUMBER')
numero_teste = "whatsapp:+5511961909818"
account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')

def enviar(mensagem):
    url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
    auth = (account_sid, auth_token)
    data = {"To": numero_teste, "From": whatsapp_number, "Body": mensagem}
    r = requests.post(url, auth=auth, data=data)
    print(f"[ENVIADO] {mensagem}")
    return r.status_code in [200, 201]

print("=== TESTE POS-DEPLOY ===\n")

print("1. OI (boas-vindas)...")
enviar("OI")
time.sleep(3)

print("2. Matricula 7101309...")
enviar("7101309")
time.sleep(3)

print("3. Menu...")
enviar("MENU")
time.sleep(3)

print("4. Proxima folga (2)...")
enviar("2")

print("\n=== VERIFIQUE O WHATSAPP ===")
