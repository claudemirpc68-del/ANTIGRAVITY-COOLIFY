import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';

const CommunicationCenter = ({ user, messages, notifications, onAddMessage, onAddNotification, onMarkRead }) => {
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' or 'alerts'
  const [newMessage, setNewMessage] = useState('');
  const [recipientId, setRecipientId] = useState('all'); // 'all' or specific colab ID

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    onAddMessage({
      senderId: user.id,
      senderName: user.nome,
      recipientId: recipientId,
      text: newMessage,
      type: 'text'
    });

    setNewMessage('');
    alert('Mensagem enviada com sucesso!');
  };

  const filteredMessages = messages.filter(m => 
    m.recipientId === 'all' || 
    m.recipientId === user.id || 
    m.senderId === user.id
  );

  return (
    <div className="animate-fade-in" style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Button 
          onClick={() => setActiveTab('messages')} 
          variant={activeTab === 'messages' ? 'primary' : 'ghost'}
          style={{ flex: 1 }}
        >
          Mensagens/Mural
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
        <Card title="Mural de Comunicação">
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', padding: '10px', background: '#f9f9f9', borderRadius: '8px' }}>
            {filteredMessages.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '13px' }}>Nenhuma mensagem no mural.</p>
            ) : (
              filteredMessages.map((msg) => (
                <div key={msg.id} style={{ 
                  marginBottom: '12px', 
                  padding: '10px', 
                  borderRadius: '8px', 
                  background: msg.senderId === user.id ? '#E3F2FD' : 'white',
                  border: '1px solid #EEE',
                  alignSelf: msg.senderId === user.id ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--assai-orange)', marginBottom: '4px' }}>
                    {msg.senderName} {msg.recipientId === 'all' ? '(Para: Todos)' : ''}
                  </div>
                  <div style={{ fontSize: '13px' }}>{msg.text}</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', textAlign: 'right', marginTop: '4px' }}>
                    {new Date(msg.timestamp).toLocaleString('pt-BR')}
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <textarea
              placeholder="Digite aqui sua mensagem ou aviso..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{
                width: '100%',
                minHeight: '80px',
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
                Enviando como: <strong>{user.nome}</strong>
              </span>
              <Button type="submit" variant="primary" style={{ padding: '8px 20px' }}>
                Enviar ao Mural
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
