import requests
import time

URL = "https://assai-bot.72.61.130.70.sslip.io/webhook"

def enviar_mensagem(numero, texto):
    print(f"\n📲 [Enviando de {numero}]: {texto}")
    payload = {
        "From": f"whatsapp:{numero}",
        "Body": texto
    }
    try:
        response = requests.post(URL, data=payload)
        if response.status_code == 200:
            # Simplificando a resposta TwiML para exibição
            if "<Body>" in response.text:
                body = response.text.split("<Body>")[1].split("</Body>")[0]
                # Decodificar entidades HTML básicas
                body = body.replace("&quot;", '"').replace("&apos;", "'").replace("&gt;", ">").replace("&lt;", "<").replace("&amp;", "&")
                print(f"🤖 [Bot Responde]:\n{body}")
            else:
                print(f"🤖 [Bot Responde (TwiML Raw)]:\n{response.text}")
        else:
            print(f"❌ Erro {response.status_code}: {response.text}")
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")

def simular_fluxo_simples():
    print(f"🚀 Iniciando Teste de Produção: {URL}")
    
    # 1. Identificação de Colaborador (Claudemir - 7101309)
    print("\n--- TESTE 1: Identificação de Colaborador ---")
    enviar_mensagem("+5511999990001", "7101309")
    
    time.sleep(2)
    
    # 2. Consultar Escala
    print("\n--- TESTE 2: Consulta de Escala ---")
    enviar_mensagem("+5511999990001", "1")
    
    time.sleep(2)

    # 3. Identificação de Gestor (Ederson - 101010)
    print("\n--- TESTE 3: Identificação de Gestor ---")
    enviar_mensagem("+5511888880000", "101010")

if __name__ == "__main__":
    simular_fluxo_simples()
