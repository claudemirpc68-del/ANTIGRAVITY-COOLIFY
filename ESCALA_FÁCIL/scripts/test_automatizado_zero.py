"""
TESTE AUTOMATIZADO DO ESCALA_FÁCIL - DESDE O ZERO
Começa com mensagem de boas-vindas e pedindo matricula
"""

import os
import requests
import time
from dotenv import load_dotenv

load_dotenv()

account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
whatsapp_number = os.environ.get('TWILIO_WHATSAPP_NUMBER')

NUMERO_TESTE = "whatsapp:+5511961909818"

def enviar_mensagem(texto):
    url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
    auth = (account_sid, auth_token)
    data = {"To": NUMERO_TESTE, "From": whatsapp_number, "Body": texto}
    response = requests.post(url, auth=auth, data=data)
    if response.status_code in [200, 201]:
        result = response.json()
        print(f"   [ENVIADO] {texto}")
        return True
    else:
        print(f"   [ERRO] {response.status_code}")
        return False

print("="*60)
print("TESTE AUTOMATIZADO - ESCALA_FACIL (DESDE O ZERO)")
print("="*60)
print(f"\nNumero de teste: {NUMERO_TESTE}")
print("\nIniciando fluxo...\n")

print("[1] Enviando OI (boas-vindas)...")
enviar_mensagem("OI")
time.sleep(3)

print("\n[2] Enviando matricula 7101309...")
enviar_mensagem("7101309")
time.sleep(3)

print("\n[3] Solicitando MENU...")
enviar_mensagem("MENU")
time.sleep(3)

print("\n[4] Consultando proxima folga (opcao 2)...")
enviar_mensagem("2")
time.sleep(3)

print("\n[5] Verificando domingos de folga (opcao 3)...")
enviar_mensagem("3")

print("\n" + "="*60)
print("TESTE ENVIADO! Verifique o WhatsApp.")
print("="*60)
