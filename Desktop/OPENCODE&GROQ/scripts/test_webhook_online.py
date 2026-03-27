import requests

URL = "https://assai-bot.72.61.130.70.sslip.io/webhook"

payload = {
    "From": "whatsapp:+5511961909818",
    "Body": "7101309"
}

print("Enviando matricula 7101309...")
response = requests.post(URL, data=payload)
print(f"Status: {response.status_code}")
print(f"Resposta: {response.text[:500] if response.text else 'vazia'}")
