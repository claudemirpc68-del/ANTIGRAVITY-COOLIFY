"""
ESCALA_FÁCIL - Gerenciador de Sessões
Mantém o estado da conversa por número de telefone em memória.
Para produção com múltiplos workers, substituir por Redis.
"""

from typing import Optional


class SessionManager:
    """
    Armazena o estado da conversa por número de telefone.

    Estrutura da sessão:
    {
        "matricula": "7101309",
        "nome": "CLAUDEMIR",
        "tipo": "colaborador" | "gestor"
    }
    """

    def __init__(self):
        self._sessions: dict[str, dict] = {}

    def get(self, numero: str) -> Optional[dict]:
        """Retorna a sessão atual do número, ou None se não existir."""
        return self._sessions.get(numero)

    def set(self, numero: str, dados: dict) -> None:
        """Salva ou atualiza a sessão do número."""
        self._sessions[numero] = dados

    def clear(self, numero: str) -> None:
        """Limpa a sessão do número (reinicia a conversa)."""
        self._sessions.pop(numero, None)

    def update(self, numero: str, **kwargs) -> None:
        """Atualiza campos específicos da sessão."""
        if numero in self._sessions:
            self._sessions[numero].update(kwargs)
        else:
            self._sessions[numero] = kwargs
