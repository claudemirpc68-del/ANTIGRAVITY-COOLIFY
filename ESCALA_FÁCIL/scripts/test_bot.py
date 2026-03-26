import requests
import time

URL = "http://localhost:5000/webhook"

def enviar_mensagem(numero, texto):
    print(f"\n📲 [Enviando de {numero}]: {texto}")
    payload = {
        "From": f"whatsapp:{numero}",
        "Body": texto
    }
    response = requests.post(URL, data=payload)
    if response.status_code == 200:
        # Simplificando a resposta TwiML para exibição
        body = response.text.split("<Body>")[1].split("</Body>")[0]
        # Decodificar entidades HTML básicas
        body = body.replace("&quot;", '"').replace("&apos;", "'").replace("&gt;", ">").replace("&lt;", "<").replace("&amp;", "&")
        print(f"🤖 [Bot Responde]:\n{body}")
    else:
        print(f"❌ Erro {response.status_code}: {response.text}")

def simular_fluxo_gestor():
    print("🚀 Iniciando Simulação do ESCALA_FÁCIL")
    
    # Limpa sessões anteriores
    enviar_mensagem("+5511999990001", "REINICIAR")
    enviar_mensagem("+5511888880000", "REINICIAR")
    
    # 1. Simular um colaborador enviando uma solicitação fictícia
    print("\n--- PASSO 1: Colaborador solicita algo ---")
    enviar_mensagem("+5511999990001", "7101309") # Identifica Claudemir
    enviar_mensagem("+5511999990001", "4") # Solicitar troca
    enviar_mensagem("+5511999990001", "Gostaria de trocar meu turno com o Kaique na próxima terça.")
    
    time.sleep(1)
    
    # 2. Simular o Gestor acessando
    print("\n--- PASSO 2: Gestor acessa o sistema ---")
    enviar_mensagem("+5511888880000", "101010") # Identifica Anderson Cubas (Gestor)
    
    time.sleep(1)
    
    # 3. Gestor vê resumo da equipe
    print("\n--- PASSO 3: Gestor vê resumo da equipe ---")
    enviar_mensagem("+5511888880000", "1")
    
    time.sleep(1)
    
    # 4. Gestor vê solicitações pendentes
    print("\n--- PASSO 4: Gestor vê solicitações pendentes ---")
    enviar_mensagem("+5511888880000", "2")

if __name__ == "__main__":
    try:
        simular_fluxo_gestor()
    except Exception as e:
        print(f"❌ Erro na simulação: {e}")
        print("Certifique-se de que o servidor (server.py) está rodando!")
