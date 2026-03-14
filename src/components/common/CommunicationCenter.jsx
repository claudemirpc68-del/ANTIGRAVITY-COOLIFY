import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';

const CommunicationCenter = ({ user, messages, notifications, onAddMessage, onMarkRead }) => {
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' or 'alerts'
  const [msgType, setMsgType] = useState('all'); // 'all' (mural) or 'private'
  const [newMessage, setNewMessage] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');

  const colaboradores = user.role === 'gestor' ? (window.MOCK_COLABORADORES || []) : [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (msgType === 'private' && !selectedRecipient && user.role === 'gestor') {
      alert('Por favor, selecione um destinatário.');
      return;
    }

    onAddMessage({
      senderId: user.id,
      senderName: user.nome,
      recipientId: msgType === 'all' ? 'all' : (user.role === 'gestor' ? selectedRecipient : '0'),
      text: newMessage,
      type: 'text',
      isPrivate: msgType === 'private'
    });

    setNewMessage('');
    alert('Mensagem enviada com sucesso!');
  };

  const filteredMessages = messages.filter(m => {
    if (m.recipientId === 'all') return true;
    if (m.recipientId === user.id || m.senderId === user.id) return true;
    return false;
  });

  return (
    <div className="animate-fade-in" style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Button 
          onClick={() => setActiveTab('messages')} 
          variant={activeTab === 'messages' ? 'primary' : 'ghost'}
          style={{ flex: 1 }}
        >
          Mensagens
        </Button>
        <Button 
          onClick={() => setActiveTab('alerts')} 
          variant={activeTab === 'alerts' ? 'primary' : 'ghost'}
          style={{ flex: 1 }}
        >
          Notificações {notifications.filter(n => !n.read).length > 0 && `(${notifications.filter(n => !n.read).length})`}
        </Button>
      </div>

      {activeTab === 'messages' ? (
        <Card title="Canais de Comunicação">
          <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
            <button 
              onClick={() => setMsgType('all')}
              style={{ 
                flex: 1, padding: '8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                background: msgType === 'all' ? 'var(--assai-orange)' : '#f0f0f0',
                color: msgType === 'all' ? 'white' : 'var(--text-secondary)',
                border: 'none', fontWeight: 'bold'
              }}
            >
              Mural Público
            </button>
            <button 
              onClick={() => setMsgType('private')}
              style={{ 
                flex: 1, padding: '8px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                background: msgType === 'private' ? 'var(--assai-orange)' : '#f0f0f0',
                color: msgType === 'private' ? 'white' : 'var(--text-secondary)',
                border: 'none', fontWeight: 'bold'
              }}
            >
              Conversa Privada
            </button>
          </div>

          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', padding: '10px', background: '#f9f9f9', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
            {filteredMessages.filter(m => msgType === 'all' ? !m.isPrivate : m.isPrivate).length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '13px' }}>Nenhuma mensagem aqui.</p>
            ) : (
              filteredMessages.filter(m => msgType === 'all' ? !m.isPrivate : m.isPrivate).map((msg) => (
                <div key={msg.id} style={{ 
                  marginBottom: '12px', 
                  padding: '10px', 
                  borderRadius: '12px', 
                  background: msg.senderId === user.id ? '#E3F2FD' : 'white',
                  border: '1px solid #EEE',
                  alignSelf: msg.senderId === user.id ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: msg.isPrivate ? '#1976D2' : 'var(--assai-orange)', marginBottom: '4px' }}>
                    {msg.senderName} {msg.isPrivate ? ' (Privado)' : ''}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{msg.text}</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', textAlign: 'right', marginTop: '4px' }}>
                    {new Date(msg.timestamp).toLocaleString('pt-BR')}
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {msgType === 'private' && user.role === 'gestor' && (
              <select 
                value={selectedRecipient} 
                onChange={(e) => setSelectedRecipient(e.target.value)}
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px' }}
              >
                <option value="">Selecione o destinatário...</option>
                {colaboradores.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            )}
            {msgType === 'private' && user.role === 'colaborador' && (
              <div style={{ fontSize: '12px', color: '#1976D2', fontWeight: 'bold', padding: '5px' }}>
                Enviando mensagem direta para o Gestor.
              </div>
            )}
            <textarea
              placeholder={msgType === 'all' ? "Postar no mural..." : "Digite sua mensagem privada..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{
                width: '100%',
                minHeight: '60px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #E0E0E0',
                fontFamily: 'inherit',
                fontSize: '14px',
                resize: 'none'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Como: <strong>{user.nome}</strong>
              </span>
              <Button type="submit" variant="primary" style={{ padding: '8px 20px' }}>
                Enviar {msgType === 'all' ? 'Mural' : 'Privado'}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card title="Alertas e Solicitações">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '13px', padding: '20px' }}>
                Você não tem notificações pendentes.
              </p>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} style={{ 
                  padding: '15px', 
                  borderRadius: '12px', 
                  background: notif.read ? 'white' : 'rgba(255, 102, 0, 0.05)', 
                  borderLeft: `5px solid ${notif.read ? '#EEE' : 'var(--assai-orange)'}`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{notif.title}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{new Date(notif.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>{notif.message}</p>
                  
                  {!notif.read && (
                    <Button 
                      onClick={() => onMarkRead(notif.id)} 
                      variant="ghost" 
                      style={{ fontSize: '11px', padding: '4px 8px' }}
                    >
                      Marcar como lido
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CommunicationCenter;
