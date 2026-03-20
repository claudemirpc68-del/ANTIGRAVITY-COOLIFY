"""
ESCALA_FÁCIL - Gerenciador de Sessões (Supabase)
Mantém o estado da conversa por número de telefone persistido no PostgreSQL.
"""

from typing import Optional
from supabase_client import get_supabase


class SessionManager:
    """
    Armazena o estado da conversa por número de telefone no Supabase.

    Estrutura da sessão na tabela 'sessoes':
    - numero_telefone (PK)
    - matricula
    - nome
    - tipo (colaborador | gestor)
    - estado
    - tipo_solicitacao
    """

    def __init__(self):
        self.supabase = get_supabase()
        self.table = "sessoes"

    def get(self, numero: str) -> Optional[dict]:
        """Retorna a sessão atual do número, ou None se não existir."""
        try:
            response = self.supabase.table(self.table).select("*").eq("numero_telefone", numero).execute()
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            print(f"❌ Erro ao buscar sessão: {e}")
            return None

    def set(self, numero: str, dados: dict) -> None:
        """Salva ou atualiza a sessão do número."""
        try:
            # Garante que o número de telefone está no payload
            payload = {"numero_telefone": numero}
            payload.update(dados)
            self.supabase.table(self.table).upsert(payload).execute()
        except Exception as e:
            print(f"❌ Erro ao salvar sessão: {e}")

    def clear(self, numero: str) -> None:
        """Limpa a sessão do número (reinicia a conversa)."""
        try:
            self.supabase.table(self.table).delete().eq("numero_telefone", numero).execute()
        except Exception as e:
            print(f"❌ Erro ao limpar sessão: {e}")

    def update(self, numero: str, **kwargs) -> None:
        """Atualiza campos específicos da sessão."""
        try:
            # Primeiro tenta buscar para ver se existe (upsert direto com kwargs pode falhar se faltar dados obrigatorios)
            # Mas na nossa tabela sessoes, quase tudo é opcional exceto PK.
            payload = {"numero_telefone": numero}
            payload.update(kwargs)
            self.supabase.table(self.table).upsert(payload).execute()
        except Exception as e:
            print(f"❌ Erro ao atualizar sessão: {e}")
