"""
ESCALA_FÁCIL - Servidor Flask / Webhook Twilio
Recebe mensagens do WhatsApp via Twilio e responde com a lógica do bot.
"""

import os
import sys
from flask import Flask, request, send_from_directory
from flask_cors import CORS
from twilio.twiml.messaging_response import MessagingResponse
from dotenv import load_dotenv

# Adiciona o diretório raiz ao path para importar os scripts
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sessions import SessionManager
from scripts.api_supabase import (
    identificar_usuario,
    get_escala_semanal,
    get_proxima_folga,
    get_domingos_folga,
    get_resumo_equipe,
    salvar_solicitacao,
    listar_solicitacoes_pendentes,
    get_relatorio_mensal_equipe,
)

load_dotenv()

app = Flask(__name__, static_folder='assets', static_url_path='/assets')
CORS(app) # Permite que o simulador web acesse o webhook
sessions = SessionManager()

# -----------------------------------------------------------------------
# Menus
# -----------------------------------------------------------------------

MENU_COLABORADOR = (
    "Olá, *{nome}*! Como posso ajudar?\n\n"
    "1 - Ver minha escala semanal\n"
    "2 - Consultar minha próxima folga\n"
    "3 - Ver domingos de folga do mês\n"
    "4 - Solicitar troca de turno/folga\n"
    "5 - Justificar ausência ou atraso\n"
    "6 - Solicitar mudança de setor/horário\n"
    "7 - Reportar problema ou conflito\n"
    "8 - Falar diretamente com o gestor\n\n"
    "Digite o número da opção desejada."
)

MENU_GESTOR = (
    "Bem-vindo, *{nome}* (Gestor)!\n\n"
    "1 - Resumo da equipe hoje\n"
    "2 - Validar justificativas de ausência/atraso\n"
    "3 - Autorizar mudança de setor/horário\n"
    "4 - Ajustar escala da equipe\n"
    "5 - Resolver problemas ou conflitos\n"
    "6 - Gerar relatórios da equipe\n"
    "7 - Enviar comunicado aos colaboradores\n\n"
    "Digite o número da opção desejada."
)

MSG_PEDIR_MATRICULA = (
    "Olá! Eu sou o *ESCALA_FÁCIL* 🤖\n"
    "_Organizando sua escala para que você faça toda a diferença!_\n\n"
    "Por favor, informe sua *matrícula* para acessar o sistema:"
)

MSG_NAO_ENCONTRADO = (
    "❌ Matrícula não encontrada. Verifique o número e tente novamente.\n"
    "Ou digite *REINICIAR* para começar de novo."
)

MSG_OPCAO_INVALIDA = (
    "⚠️ Opção inválida. Por favor, digite o número correspondente à opção desejada.\n"
    "Ou digite *MENU* para ver as opções novamente. ↩️"
)

MSG_EM_BREVE = (
    "⏳ Esta funcionalidade estará disponível em breve.\n"
    "Digite *MENU* para voltar ao menu principal."
)

# -----------------------------------------------------------------------
# Processamento de mensagens
# -----------------------------------------------------------------------

def processar_mensagem(numero_telefone: str, texto: str) -> str:
    """Processa a mensagem recebida e retorna a resposta do bot."""
    texto = texto.strip()
    sessao = sessions.get(numero_telefone)

    # Comandos especiais
    if texto.upper() in ("REINICIAR", "RESTART", "OI", "OLÁ", "OLA", "INICIO", "START"):
        sessions.clear(numero_telefone)
        return MSG_PEDIR_MATRICULA

    # Inteligência de Resete: Se o usuário digitar algo que parece uma matrícula (6+ dígitos), 
    # forçamos o resete da sessão para logar novamente, mesmo que já exista uma sessão ativa.
    # Isso evita o erro de "Olção Inválida" quando o usuário tenta logar de novo.
    if texto.isdigit() and len(texto) >= 6:
        sessions.clear(numero_telefone)
        sessao = None

    if texto.upper() == "MENU":
        if sessao and sessao.get("nome"):
            if sessao.get("tipo") == "gestor":
                return MENU_GESTOR.format(nome=sessao["nome"])
            else:
                return MENU_COLABORADOR.format(nome=sessao["nome"])
        sessions.clear(numero_telefone)
        return MSG_PEDIR_MATRICULA

    # Etapa 1: ainda não tem matrícula → tudo que chega é tentativa de matrícula
    if not sessao or not sessao.get("matricula"):
        usuario = identificar_usuario(texto)

        if usuario["tipo"] == "nao_encontrado":
            return MSG_NAO_ENCONTRADO

        # Salva a sessão
        sessions.set(numero_telefone, {
            "matricula": texto,
            "nome": usuario["nome"],
            "tipo": usuario["tipo"],
        })

        if usuario["tipo"] == "gestor":
            return MENU_GESTOR.format(nome=usuario["nome"])
        else:
            return MENU_COLABORADOR.format(nome=usuario["nome"])

    # Etapa 2: usuário já identificado — processa opcão do menu
    matricula = sessao["matricula"]
    tipo = sessao["tipo"]
    nome = sessao["nome"]

    # Verifica se há um estado ativo aguardando texto livre
    estado = sessao.get("estado")
    if estado:
        tipo_solicitacao = sessao.get("tipo_solicitacao", "Solicitação")
        salvar_solicitacao(matricula, nome, tipo_solicitacao, texto)
        sessions.update(numero_telefone, estado=None, tipo_solicitacao=None)
        return (
            f"✅ Sua solicitação de *{tipo_solicitacao}* foi registrada com sucesso!\n\n"
            "O gestor foi notificado e avaliará o mais breve possível.\n"
            "Digite *MENU* para voltar às opções. ↩️"
        )

    if tipo == "colaborador":
        return _processar_colaborador(texto, matricula, nome, numero_telefone)
    elif tipo == "gestor":
        return _processar_gestor(texto, nome, numero_telefone)

    return MSG_OPCAO_INVALIDA


def _processar_colaborador(opcao: str, matricula: str, nome: str, numero_telefone: str) -> str:
    """Processa uma opção do menu de colaborador."""
    
    def pedir_solicitacao(tipo_solicitacao: str, mensagem_prompt: str) -> str:
        sessions.update(numero_telefone, estado="aguardando_texto", tipo_solicitacao=tipo_solicitacao)
        return mensagem_prompt

    opcoes = {
        "1": lambda: get_escala_semanal(matricula),
        "2": lambda: get_proxima_folga(matricula),
        "3": lambda: get_domingos_folga(matricula),
        "4": lambda: pedir_solicitacao("Troca de Turno/Folga", "Por favor, digite os detalhes da sua solicitação de troca de turno ou folga (quais dias e se já alinhou com alguém):"),
        "5": lambda: pedir_solicitacao("Justificativa de Ausência/Atraso", "Por favor, digite o motivo da sua ausência ou atraso (caso possua atestado, entregue via RH):"),
        "6": lambda: pedir_solicitacao("Mudança de Setor/Horário", "Qual setor ou horário você gostaria de solicitar e por qual motivo?"),
        "7": lambda: pedir_solicitacao("Problema ou Conflito", "Por favor, descreva brevemente o problema ou conflito para que possamos ajudar:"),
        "8": lambda: "📞 Sua mensagem foi encaminhada ao gestor responsável.\n\n⚠️ _O gestor tem a última palavra e pode alterar em caso de necessidade operacional._",
    }

    handler = opcoes.get(opcao)
    if handler:
        resposta = handler()
        if callable(resposta):
            return resposta
        return f"{resposta}\n\nDigite *MENU* para voltar ao menu principal. ↩️"

    # --- SUPORTE A TEXTO LIVRE INTELIGENTE ---
    from scripts.api_openai import processar_texto_ia
    from scripts.api_supabase import salvar_mensagem_direta
    
    resposta_ia = processar_texto_ia(opcao, {"matricula": matricula, "nome": nome})
    if resposta_ia:
        salvar_mensagem_direta(matricula, nome, f"IA Answer: {resposta_ia} | Original: {opcao}")
        return f"{resposta_ia}\n\nDigite *MENU* para voltar. ↩️"

    # Fallback se a IA falhar ou não estiver disponível
    sucesso = salvar_mensagem_direta(matricula, nome, opcao)
    if sucesso:
        return (
            "Recebi sua mensagem! 📩\n\n"
            "Como ela não corresponde a uma opção do menu, eu a encaminhei para análise do gestor.\n\n"
            "Deseja algo mais? Digite o número ou **MENU**."
        )

    return MSG_OPCAO_INVALIDA


def _processar_gestor(opcao: str, nome: str, numero_telefone: str) -> str:
    """Processa uma opção do menu de gestor."""
    opcoes = {
        "1": lambda: get_resumo_equipe(),
        "2": lambda: listar_solicitacoes_pendentes("Justificativa"),
        "3": lambda: listar_solicitacoes_pendentes("Mudança"),
        "4": lambda: listar_solicitacoes_pendentes("Troca"),
        "5": lambda: listar_solicitacoes_pendentes("Problema"),
        "6": lambda: get_relatorio_mensal_equipe(),
        "7": lambda: "📣 A função de envio em massa de comunicados será liberada via painel web.",
    }

    handler = opcoes.get(opcao)
    if handler:
        resposta = handler()
        if callable(resposta):
            return resposta
        return f"{resposta}\n\nDigite *MENU* para ver as opções novamente. ↩️"

    # --- SUPORTE A TEXTO LIVRE INTELIGENTE (GESTOR) ---
    from scripts.api_openai import processar_texto_ia
    from scripts.api_supabase import salvar_mensagem_direta

    resposta_ia = processar_texto_ia(opcao, {"matricula": "GESTOR", "nome": nome})
    if resposta_ia:
        salvar_mensagem_direta("GESTOR", nome, f"IA Answer: {resposta_ia} | Original: {opcao}")
        return f"{resposta_ia}\n\nDigite *MENU* para voltar. ↩️"

    # Fallback
    salvar_mensagem_direta("GESTOR", nome, opcao)
    return (
        "Mensagem anotada, Gestor! 📝\n\n"
        "Estou processando seu pedido de texto livre. Em breve poderei responder dúvidas complexas usando IA.\n\n"
        "Por enquanto, você pode usar as opções numéricas ou digitar **MENU**."
    )


# -----------------------------------------------------------------------
# Webhook Twilio
# -----------------------------------------------------------------------

@app.route("/webhook", methods=["POST"])
def webhook():
    """Endpoint que recebe mensagens do Twilio."""
    numero = request.form.get("From", "")
    texto = request.form.get("Body", "").strip()

    resposta_texto = processar_mensagem(numero, texto)

    resp = MessagingResponse()
    msg = resp.message()
    msg.body(resposta_texto)

    return str(resp), 200


@app.route("/health", methods=["GET"])
def health():
    """Health check para o Coolify."""
    return {"status": "ok", "bot": "ESCALA_FÁCIL"}, 200


# -----------------------------------------------------------------------
# Rotas de Interface
# -----------------------------------------------------------------------

@app.route("/", methods=["GET"])
def index():
    """Serve a interface web do simulador (frontend)."""
    return send_from_directory(".", "simulator.html")


# -----------------------------------------------------------------------
# Execução local para testes
# -----------------------------------------------------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"[ESCALA_FÁCIL] Servidor rodando na porta {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)
