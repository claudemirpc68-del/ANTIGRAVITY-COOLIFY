"""
ESCALA_FÁCIL - Menu Handler Service
Lógica de tratamento das opções de menu.
"""
from typing import Optional
from scripts import api_supabase, api_groq

MSG_OPCAO_INVALIDA = "❌ Opção inválida. Escolha uma das opções do menu ou digite 'MENU'."

class MenuHandler:
    @staticmethod
    def process_colaborador(opcao: str, matricula: str, nome: str, numero_telefone: str, media_url: Optional[str] = None) -> str:
        """Trata as escolhas do colaborador."""
        
        # Auxiliar para evitar repetição
        def log_solicitacao(tipo: str, prompt: str) -> str:
            from sessions import SessionManager
            SessionManager().update(numero_telefone, estado="aguardando_texto", tipo_solicitacao=tipo)
            return prompt

        opcoes = {
            "1": lambda: api_supabase.get_escala_semanal(matricula),
            "2": lambda: api_supabase.get_proxima_folga(matricula),
            "3": lambda: api_supabase.get_domingos_folga(matricula),
            "4": lambda: log_solicitacao("Troca de Escala", "✍️ Digite os detalhes da troca (mencione quem seria o colega, se souber) ou envie uma foto do pedido assinado:"),
            "5": lambda: log_solicitacao("Justificativa", "✍️ Por favor, descreva o motivo da falta/atraso ou anexe uma foto do atestado:"),
            "6": lambda: log_solicitacao("Dúvida Geral", "✍️ Como posso te ajudar? Digite sua dúvida abaixo:")
        }
        
        handler = opcoes.get(opcao)
        if handler:
            return handler()
        
        return MSG_OPCAO_INVALIDA

    @staticmethod
    def process_gestor(opcao: str, nome: str, numero_telefone: str, media_url: Optional[str] = None) -> str:
        """Trata as escolhas do gestor."""
        from sessions import SessionManager
        sessao = SessionManager().get(numero_telefone)
        matricula = sessao.get("matricula") if sessao else None

        def log_solicitacao_gestor(tipo: str, prompt: str) -> str:
            SessionManager().update(numero_telefone, estado="aguardando_texto", tipo_solicitacao=tipo)
            return prompt

        opcoes = {
            "1": lambda: api_supabase.get_resumo_equipe(),
            "2": lambda: api_supabase.listar_solicitacoes_pendentes(),
            "3": lambda: log_solicitacao_gestor("Mensagem Equipe", "📢 Digite o comunicado para a equipe (será registrado no log):"),
            "4": lambda: api_supabase.get_relatorio_mensal_equipe(),
            "5": lambda: api_supabase.listar_solicitacoes_pendentes(tipo_filtro="Justificativa"),
            "6": lambda: api_supabase.listar_solicitacoes_pendentes(tipo_filtro="Troca")
        }
        
        handler = opcoes.get(opcao)
        if handler:
            return handler()
        
        return MSG_OPCAO_INVALIDA
