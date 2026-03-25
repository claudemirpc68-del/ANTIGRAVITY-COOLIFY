"""
TESTE AUTOMATIZADO DO ESCALA_FÁCIL
Usa agente para testar o bot via Twilio WhatsApp
"""

import os
import requests
import time
from dotenv import load_dotenv

load_dotenv()

# Credenciais Twilio
account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
whatsapp_number = os.environ.get('TWILIO_WHATSAPP_NUMBER')

# URLs
WEBHOOK_URL = "https://assai-bot.72.61.130.70.sslip.io/webhook"

# Número de teste (Claudemir)
NUMERO_TESTE = "whatsapp:+5511961909818"

def enviar_via_twilio(destino, mensagem):
    """Envia mensagem via API Twilio"""
    url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
    auth = (account_sid, auth_token)
    data = {"To": destino, "From": whatsapp_number, "Body": mensagem}
    
    response = requests.post(url, auth=auth, data=data)
    if response.status_code in [200, 201]:
        result = response.json()
        print(f"   [ENVIADO] {mensagem}")
        return result.get('sid')
    else:
        print(f"   [ERRO] {response.status_code}: {response.text}")
        return None

def testar_fluxo_colaborador():
    """Testa o fluxo completo do colaborador"""
    print("\n" + "="*60)
    print("ROBÔ DE TESTE: FLUXO COLABORADOR")
    print("="*60)
    
    print("\n[1] Enviando matrícula 7101309...")
    enviar_via_twilio(NUMERO_TESTE, "7101309")
    time.sleep(3)
    
    print("\n[2] Solicitando menu...")
    enviar_via_twilio(NUMERO_TESTE, "MENU")
    time.sleep(3)
    
    print("\n[3] Consultando próxima folga (opção 2)...")
    enviar_via_twilio(NUMERO_TESTE, "2")
    time.sleep(3)
    
    print("\n[4] Verificando domingos de folga (opção 3)...")
    enviar_via_twilio(NUMERO_TESTE, "3")
    time.sleep(3)
    
    print("\n[5] Verificando escala semanal (opção 1)...")
    enviar_via_twilio(NUMERO_TESTE, "1")
    time.sleep(3)
    
    print("\n[6] Falar com gestor (opção 8)...")
    enviar_via_twilio(NUMERO_TESTE, "8")

def testar_fluxo_gestor():
    """Testa o fluxo do gestor"""
    print("\n" + "="*60)
    print("ROBÔ DE TESTE: FLUXO GESTOR")
    print("="*60)
    
    # Usar número diferente para gestor
    NUMERO_GESTOR = "whatsapp:+5511999999999"
    
    print("\n[1] Identificando como gestor 101010...")
    enviar_via_twilio(NUMERO_GESTOR, "101010")
    time.sleep(3)
    
    print("\n[2] Solicitando menu...")
    enviar_via_twilio(NUMERO_GESTOR, "MENU")
    time.sleep(3)
    
    print("\n[3] Gerar relatórios (opção 6)...")
    enviar_via_twilio(NUMERO_GESTOR, "6")

def executar_testes():
    """Executa todos os testes automaticamente"""
    print("\n" + "="*60)
    print("INICIANDO TESTES AUTOMATIZADOS - ESCALA_FACIL")
    print("="*60)
    print(f"\nBot URL: {WEBHOOK_URL}")
    print(f"Número de Teste: {NUMERO_TESTE}")
    
    # Testar Colaborador
    testar_fluxo_colaborador()
    
    time.sleep(5)
    
    # Testar Gestor
    testar_fluxo_gestor()
    
    print("\n" + "="*60)
    print("TESTES ENVIADOS COM SUCESSO!")
    print("="*60)
    print("\nVerifique o WhatsApp para ver as respostas do bot.")
    print("O robô de teste enviou as mensagens automaticamente.")

if __name__ == "__main__":
    executar_testes()
