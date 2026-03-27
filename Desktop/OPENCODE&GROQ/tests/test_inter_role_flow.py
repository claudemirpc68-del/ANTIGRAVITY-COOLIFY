import os
import pytest
import sys
from unittest.mock import patch, MagicMock

# 1. MOCK GLOBAL DO SESSION MANAGER (Deve ser feito antes dos imports de server/services)
sessions_db = {}
mock_sess_instance = MagicMock()
mock_sess_instance.get.side_effect = lambda p: sessions_db.get(p)
mock_sess_instance.set.side_effect = lambda p, d: sessions_db.update({p: d})
mock_sess_instance.update.side_effect = lambda p, **k: sessions_db[p].update(k) if p in sessions_db else sessions_db.update({p: k})
mock_sess_instance.clear.side_effect = lambda p: sessions_db.pop(p, None)

mock_sessions_module = MagicMock()
mock_sessions_module.SessionManager.return_value = mock_sess_instance
sys.modules['sessions'] = mock_sessions_module

# 2. AGORA IMPORTA O APP E OS SERVIÇOS
from server import app, bot_service

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.debug = True 
    with app.test_client() as client:
        yield client

@patch('services.bot_service.api_supabase')
@patch('services.menu_handler.api_supabase')
def test_full_inter_role_flow(mock_sup_menu, mock_sup_bot, client):
    """
    Simula uma jornada completa entre Colaborador e Gestor.
    """
    global sessions_db
    sessions_db.clear()
    
    # Injeta explicitamente no bot_service global (redundância de segurança)
    bot_service.sessions = mock_sess_instance
    
    colab_phone = 'whatsapp:+5511999990001'
    gestor_phone = 'whatsapp:+5511888880000'

    # MOCK IDENTIFICAR USUARIO
    mock_sup_bot.identificar_usuario.return_value = {
        "tipo": "colaborador", "nome": "João Silva", "matricula": "123456"
    }

    # --- Passo 1: Colaborador Login ---
    resp = client.post('/webhook', data={'From': colab_phone, 'Body': '123456'})
    assert 'João Silva' in resp.data.decode('utf-8')
    assert 'Menu Colaborador' in resp.data.decode('utf-8')

    # --- Passo 2: Colaborador Solicita Troca (Opção 4) ---
    resp = client.post('/webhook', data={'From': colab_phone, 'Body': '4'})
    assert 'Digite os detalhes' in resp.data.decode('utf-8')
    
    # Envio do texto da solicitação (estado aguardando_texto)
    resp = client.post('/webhook', data={'From': colab_phone, 'Body': 'Quero trocar domingo'})
    assert 'foi registrada com sucesso' in resp.data.decode('utf-8')

    # --- Passo 3: Gestor Login ---
    mock_sup_bot.identificar_usuario.return_value = {
        "tipo": "gestor", "nome": "Ederson", "matricula": "101010"
    }
    
    resp = client.post('/webhook', data={'From': gestor_phone, 'Body': '101010'})
    assert 'Ederson' in resp.data.decode('utf-8')
    assert 'Menu Gestor' in resp.data.decode('utf-8')

    # --- Passo 4: Gestor visualiza solicitações (Opção 2) ---
    mock_sup_menu.listar_solicitacoes_pendentes.return_value = "📋 *Solicitações Pendentes:*\n1. João Silva - Troca"
    
    resp = client.post('/webhook', data={'From': gestor_phone, 'Body': '2'})
    assert 'Solicitações Pendentes' in resp.data.decode('utf-8')
    assert 'João Silva' in resp.data.decode('utf-8')
