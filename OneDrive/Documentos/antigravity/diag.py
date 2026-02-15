import requests
import json

url = "https://n8n.srv1067081.hstgr.cloud/webhook/contatos-final"
data = {
    "operation": "create",
    "data": {
        "nome_completo": "Teste",
        "sobrenome": "Debug",
        "email": "debug@teste.com"
    }
}

try:
    print(f"Enviando requisição de leitura para: {url}")
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print("Corpo da Resposta:")
    print(response.text)
    
    # Se a resposta for JSON, tentar formatar
    try:
        parsed = response.json()
        print("\nJSON Formatado:")
        print(json.dumps(parsed, indent=2))
    except:
        pass
        
except Exception as e:
    print(f"Erro na requisição: {e}")
