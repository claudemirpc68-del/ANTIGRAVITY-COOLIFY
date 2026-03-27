"""
ESCALA_FÁCIL - Identificação por WhatsApp
Baseado na skill escala_facil_interacao
"""
import json
import os
from typing import Optional

CONTATOS_FILE = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "SKILL_ESCALA_FACIL", "contatos_grupo.json"
)

def carregar_contatos() -> list:
    """Carrega contatos do arquivo JSON."""
    try:
        with open(CONTATOS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("contatos", [])
    except Exception as e:
        print(f"❌ Erro ao carregar contatos: {e}")
        return []

def identificar_por_whatsapp(whatsapp: str) -> Optional[dict]:
    """Identifica usuário pelo número do WhatsApp."""
    contatos = carregar_contatos()
    
    normalizar = lambda x: x.replace("whatsapp:", "").replace("+", "").strip()
    whatsapp_normalizado = normalizar(whatsapp)
    
    for contato in contatos:
        contato_whatsapp = normalizar(contato.get("whatsapp", ""))
        if whatsapp_normalizado == contato_whatsapp:
            return contato
    
    return None
