from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

CONVERSAS = {}

SYSTEM_PROMPT = """Voce e um assistente virtual inteligente e prestativo.
Responda de forma clara, objetiva e amigavel em portugues brasileiro.
Seja conciso nas respostas, mas completo quando necessario."""

@app.route("/webhook", methods=["POST"])
def webhook():
    incoming_msg = request.form.get("Body", "")
    sender = request.form.get("From", "")
    
    if sender not in CONVERSAS:
        CONVERSAS[sender] = []
    
    CONVERSAS[sender].append({"role": "user", "content": incoming_msg})
    
    if len(CONVERSAS[sender]) > 20:
        CONVERSAS[sender] = CONVERSAS[sender][-20:]
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                *CONVERSAS[sender]
            ],
            temperature=0.7,
            max_tokens=1024
        )
        
        assistant_msg = response.choices[0].message.content
        CONVERSAS[sender].append({"role": "assistant", "content": assistant_msg})
        
    except Exception as e:
        assistant_msg = f"Desculpe, ocorreu um erro: {str(e)}"
    
    resp = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>{assistant_msg}</Message>
</Response>"""
    return resp, 200, {"Content-Type": "text/xml"}

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    message = data.get("message", "")
    session_id = data.get("session_id", "web")
    
    if session_id not in CONVERSAS:
        CONVERSAS[session_id] = []
    
    CONVERSAS[session_id].append({"role": "user", "content": message})
    
    if len(CONVERSAS[session_id]) > 20:
        CONVERSAS[session_id] = CONVERSAS[session_id][-20:]
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                *CONVERSAS[session_id]
            ],
            temperature=0.7,
            max_tokens=1024
        )
        
        assistant_msg = response.choices[0].message.content
        CONVERSAS[session_id].append({"role": "assistant", "content": assistant_msg})
        
        return jsonify({"response": assistant_msg})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def index():
    return send_file("whatsapp-button.html")

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"Servidor rodando em http://localhost:{port}")
    print(f"Chat Interface: http://localhost:{port}/")
    print(f"Webhook Twilio: http://localhost:{port}/webhook")
    print(f"Chat API: http://localhost:{port}/chat")
    app.run(host="0.0.0.0", port=port, debug=True)
