import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
Você é o assistente inteligente do sistema ESCALA_FÁCIL. 
Sua missão é ajudar colaboradores e gestores a entenderem suas escalas e solicitações.

REGRAS:
1. Seja cordial e profissional.
2. Use o contexto do usuário (Matrícula e Nome) para personalizar a resposta.
3. Se o usuário quiser trocar de turno, justificar falta ou mudar setor, confirme que entendeu e diga que a solicitação foi registrada.
4. Você tem acesso a ferramentas para consultar escalas se necessário (simulado).

CONTEXTO ATUAL:
- Sistema: ESCALA_FÁCIL
- Empresa: Assai Atacadista (Simulação)
"""

def processar_texto_ia(texto, usuario_info):
    """
    Processa o texto usando GPT-3.5/4 para entender a intenção e responder.
    Se a API Key não estiver configurada, retorna uma resposta amigável de fallback.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or "your_api_key" in api_key:
        return None # Indica que deve usar o fallback local

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT + f"\nUSUÁRIO ATUAL: {usuario_info['nome']} (Matrícula: {usuario_info['matricula']})"},
                {"role": "user", "content": texto}
            ],
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"❌ Erro OpenAI: {e}")
        return None
