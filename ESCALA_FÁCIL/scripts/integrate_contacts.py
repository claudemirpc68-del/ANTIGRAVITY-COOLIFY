"""
ESCALA_FÁCIL - Integração de Contatos
Este script faz o seeding dos contatos do grupo no Supabase e envia uma mensagem de boas-vindas via Twilio.
"""

import os
import sys
from twilio.rest import Client
from dotenv import load_dotenv

# Adiciona o diretório raiz ao path para importar o cliente do Supabase
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from supabase_client import get_supabase

load_dotenv()

# Configurações Twilio
account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
whatsapp_number = os.environ.get('TWILIO_WHATSAPP_NUMBER')

# Lista de contatos fornecida pelo usuário
CONTATOS = [
    { "nome": "CLAUDEMIR", "numero": "+5511961909818", "matricula": "7101309", "perfil": "colaborador" },
    { "nome": "Anderson Cubas", "numero": "+5511968613771", "matricula": "101010", "perfil": "gestor" },
    { "nome": "John", "numero": "+5511968504661", "matricula": "111111", "perfil": "gestor" },
    { "nome": "Leonardo", "numero": "+5511942763910", "matricula": "121212", "perfil": "gestor" },
    { "nome": "Ivan", "numero": "+5511942151843", "matricula": "131313", "perfil": "gestor" }
]

def integrar_contatos():
    supabase = get_supabase()
    
    print("🚀 Iniciando integração de contatos...")

    for contato in CONTATOS:
        nome = contato["nome"]
        numero_limpo = contato["numero"].replace("+", "")
        numero_whatsapp = f"whatsapp:+{numero_limpo}"
        matricula = contato["matricula"]
        tipo = contato["perfil"]

        print(f"\n👤 Processando: {nome} ({matricula})")

        # 1. Garantir que o colaborador existe na tabela 'colaboradores'
        try:
            supabase.table("colaboradores").upsert({
                "matricula": matricula,
                "nome": nome,
                "tipo": tipo
            }).execute()
            print("  ✅ Tabela 'colaboradores' atualizada.")
        except Exception as e:
            print(f"  ❌ Erro ao atualizar 'colaboradores': {e}")

        # 2. Pré-criar sessão na tabela 'sessoes' (Auto-login)
        try:
            supabase.table("sessoes").upsert({
                "numero_telefone": numero_whatsapp,
                "matricula": matricula,
                "nome": nome,
                "tipo": tipo,
                "estado": None
            }).execute()
            print("  ✅ Sessão de auto-login criada em 'sessoes'.")
        except Exception as e:
            print(f"  ❌ Erro ao atualizar 'sessoes': {e}")

        # 3. Enviar mensagem de boas-vindas via Twilio
        if account_sid and auth_token and whatsapp_number:
            try:
                client = Client(account_sid, auth_token)
                
                msg_body = (
                    f"Olá, *{nome}*! 🤖\n\n"
                    "O assistente *ESCALA_FÁCIL* já está configurado para o seu número.\n"
                    "Agora você não precisa mais digitar sua matrícula!\n\n"
                    "Digite *MENU* para ver suas opções ou comece a interagir agora mesmo."
                )

                message = client.messages.create(
                    from_=whatsapp_number,
                    body=msg_body,
                    to=numero_whatsapp
                )
                print(f"  📩 Mensagem enviada! SID: {message.sid}")
            except Exception as e:
                print(f"  ⚠️ Falha ao enviar mensagem via Twilio: {e}")
        else:
            print("  ⚠️ Twilio não configurado no .env, pulando envio de mensagem.")

    print("\n✨ Integração concluída!")

if __name__ == "__main__":
    integrar_contatos()
