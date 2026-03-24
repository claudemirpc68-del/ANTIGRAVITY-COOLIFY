"""
ESCALA_FÁCIL - Bot Service
Orquestrador central do fluxo de conversas.
"""
from typing import Optional
from sessions import SessionManager
from scripts import api_supabase, api_openai
from services.menu_handler import MenuHandler

MSG_ERRO_GERAL = "⚠️ Sinto muito, tive um problema técnico ao processar sua mensagem. Tente novamente em instantes."
MSG_BEM_VINDO = "Olá! Seja bem-vindo ao *ESCALA_FÁCIL*. 👋\nPara começar, por favor digite sua *MATRÍCULA*:"

MENU_COLABORADOR = (
    "📋 *Menu Colaborador - {nome}*\n\n"
    "1️⃣ Minha escala da semana\n"
    "2️⃣ Quando é minha próxima folga?\n"
    "3️⃣ Domingos de folga no mês\n"
    "4️⃣ Solicitar Troca de Dia\n"
    "5️⃣ Enviar Justificativa/Atestado\n"
    "6️⃣ Falar com o RH/Dúvida\n\n"
    "Digite o número da opção desejada:"
)

MENU_GESTOR = (
    "📊 *Menu Gestor - {nome}*\n\n"
    "1️⃣ Resumo da equipe hoje\n"
    "2️⃣ Ver todas solicitações pendentes\n"
    "3️⃣ Enviar comunicado geral\n"
    "4️⃣ Relatório mensal estatístico\n"
    "5️⃣ Ver apenas Justificativas\n"
    "6️⃣ Ver apenas Pedidos de Troca\n\n"
    "Digite o número da opção desejada:"
)

class BotService:
    def __init__(self):
        self.sessions = SessionManager()

    def process_message(self, phone: str, text: str, media_url: Optional[str] = None) -> str:
        """Processa a mensagem e decide o fluxo."""
        text = text.strip()
        session = self.sessions.get(phone)

        try:
            # 1. Comandos de Reinicialização e Boas-vindas
            if text.upper() in ["REINICIAR", "RESTART", "OI", "OLÁ", "START", "INICIO"]:
                self.sessions.clear(phone)
                return MSG_BEM_VINDO

            # 2. Fluxo de Identificação (Se não estiver logado)
            if not session:
                if text.isdigit():
                    return self._identificar_usuario(phone, text)
                return MSG_BEM_VINDO

            # Se o usuário pedir o menu a qualquer momento
            if text.upper() in ["MENU", "0", "VOLTAR", "SAIR"]:
                self.sessions.update(phone, estado="menu", tipo_solicitacao=None)
                return self._mostrar_menu_correto(session)

            # 3. Fluxo de Entrada de Dados (Aguardando Texto/Mídia)
            if session.get("estado") == "aguardando_texto":
                return self._processar_input_usuario(phone, session, text, media_url)

            # 4. Fluxo de Menu (Digitando Opção)
            if text.isdigit():
                return self._processar_opcao_menu(phone, session, text, media_url)

            # 5. Fallback: Inteligência Artificial
            usuario_info = {
                "nome": session.get("nome", "Usuário"),
                "matricula": session.get("matricula", "000000"),
                "tipo": session.get("tipo", "colaborador")
            }
            return api_openai.processar_texto_ia(text, usuario_info)

        except Exception as e:
            print(f"❌ Erro no BotService: {e}")
            return MSG_ERRO_GERAL

    def _identificar_usuario(self, phone: str, matricula: str) -> str:
        info = api_supabase.identificar_usuario(matricula)
        if info["tipo"] == "nao_encontrado":
            return "❌ Matrícula não encontrada. Por favor, verifique o número e digite novamente:"
        
        self.sessions.set(phone, {
            "matricula": matricula,
            "nome": info["nome"],
            "tipo": info["tipo"],
            "estado": "menu"
        })
        
        return f"✅ Identificado: *{info['nome']}* ({info['tipo'].capitalize()})\n\n" + self._mostrar_menu_correto(info)

    def _mostrar_menu_correto(self, session: dict) -> str:
        menu = MENU_GESTOR if session["tipo"] == "gestor" else MENU_COLABORADOR
        return menu.format(nome=session["nome"])

    def _processar_input_usuario(self, phone: str, session: dict, text: str, media_url: Optional[str]) -> str:
        """Processa texto ou mídia quando o bot está em estado de espera."""
        tipo = session.get("tipo_solicitacao", "Mensagem Direta")
        
        if tipo == "Mensagem Direta":
            api_supabase.salvar_mensagem_direta(session["matricula"], session["nome"], text, media_url)
        else:
            api_supabase.salvar_solicitacao(session["matricula"], session["nome"], tipo, text, media_url)
        
        self.sessions.update(phone, estado="menu", tipo_solicitacao=None)
        return f"✅ Sua mensagem ({tipo}) foi registrada com sucesso! Voltando ao menu...\n\n" + self._mostrar_menu_correto(session)

    def _processar_opcao_menu(self, phone: str, session: dict, option: str, media_url: Optional[str]) -> str:
        if session["tipo"] == "gestor":
            return MenuHandler.process_gestor(option, session["nome"], phone, media_url)
        return MenuHandler.process_colaborador(option, session["matricula"], session["nome"], phone, media_url)
