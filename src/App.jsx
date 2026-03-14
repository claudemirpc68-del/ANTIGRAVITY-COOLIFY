import React, { useState } from 'react'
import Header from './components/common/Header'
import LoginForm from './components/common/LoginForm'
import Button from './components/common/Button'
import ColaboradorDashboard from './components/colaborador/ColaboradorDashboard'
import GestorDashboard from './components/gestor/GestorDashboard'

function App() {
  // Inicializar estado a partir do localStorage
  const getInitialUser = () => {
    const saved = localStorage.getItem('assai_user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  };

  const initialUser = getInitialUser();
  const [user, setUser] = useState(initialUser);
  const [view, setView] = useState(initialUser ? initialUser.role : 'login');

  // Estado global de mensagens e notificações
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('assai_messages');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('assai_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [historico, setHistorico] = useState(() => {
    try {
      const saved = localStorage.getItem('assai_historico');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
        { id: 1, nome: 'CLAUDEMIR ROSA', motivo: 'Atestado Médico (15/02)', status: 'aprovado', obs: 'Atestado validado por EDERSON. Retorna dia 16/02.', data: '12/03/2026' },
        { id: 2, nome: 'AMANDA PORTO', motivo: 'Troca de Turno', status: 'rejeitado', obs: 'Sem cobertura para o horário.', data: '15/02/2024' },
        { id: 3, nome: 'VITORIA RIBEIRO', motivo: 'Atestado Medico (1/1)', status: 'aprovado', obs: 'Aprovado pelo Gestor na interação de ontem.', data: '11/03/2026' }
    ];
  });

  const [pontosBatidos, setPontosBatidos] = useState(() => {
    try {
      const saved = localStorage.getItem('assai_pontos_batidos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.data === new Date().toLocaleDateString() && Array.isArray(parsed.lista)) {
          // Filtra garantindo que sejam objetos do novo formato (com colabId)
          return parsed.lista.filter(p => p && typeof p === 'object' && p.colabId);
        }
      }
    } catch (e) { console.warn("Erro ao ler pontos:", e); }
    return [];
  });

  // Salvar no localStorage sempre que mudar
  React.useEffect(() => {
    localStorage.setItem('assai_messages', JSON.stringify(messages));
  }, [messages]);

  React.useEffect(() => {
    localStorage.setItem('assai_notifications', JSON.stringify(notifications));
  }, [notifications]);

  React.useEffect(() => {
    localStorage.setItem('assai_historico', JSON.stringify(historico));
  }, [historico]);

  React.useEffect(() => {
    localStorage.setItem('assai_pontos_batidos', JSON.stringify({
      data: new Date().toLocaleDateString(),
      lista: pontosBatidos
    }));
  }, [pontosBatidos]);

  const handleLogin = (role, nome, id) => {
    const userData = { nome, role, id };
    setUser(userData);
    setView(role);
    localStorage.setItem('assai_user_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
    localStorage.removeItem('assai_user_session');
  };

  const addMessage = (msg) => {
    const newMsg = { ...msg, id: Date.now(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, newMsg]);
  };

  const addNotification = (notif) => {
    const newNotif = { ...notif, id: Date.now(), timestamp: new Date().toISOString(), read: false };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleBaterPonto = (pontoData) => {
    // pontoData: { colabId, timestamp, coords, networkIP }
    setPontosBatidos(prev => {
      if (prev.find(p => p.colabId === pontoData.colabId)) return prev;
      return [...prev, pontoData];
    });
  };

  return (
    <div className="app-container">
      {view === 'login' ? (
        <div style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
            <img src="/assets/logo-assai.png" alt="Assai Logo" style={{ height: '100px', width: 'auto', objectFit: 'contain', marginBottom: '4px' }} />
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>By: Claudemir</span>
          </div>
          <LoginForm onLogin={handleLogin} />
          <footer style={{ marginTop: 'auto', padding: '20px', fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'center' }}>
            © {new Date().getFullYear()} Assai Supermercados • Mercearia Suzano 068
          </footer>
        </div>
      ) : (
        <>
          <Header 
            user={user} 
            title={view === 'gestor' ? "PAINEL ADMINISTRATIVO" : "MINHA ESCALA"} 
            onLogout={handleLogout}
            notificationCount={notifications.filter(n => !n.read).length}
          />
          <main style={{ padding: '0 20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {view === 'colaborador' && (
                <ColaboradorDashboard 
                  user={user} 
                  messages={messages} 
                  notifications={notifications}
                  historico={historico}
                  pontosBatidos={pontosBatidos}
                  onAddMessage={addMessage}
                  onMarkRead={markNotificationAsRead}
                  onBaterPonto={handleBaterPonto}
                />
              )}
              {view === 'gestor' && (
                <GestorDashboard 
                  user={user} 
                  messages={messages} 
                  notifications={notifications}
                  historico={historico}
                  pontosBatidos={pontosBatidos}
                  onAddMessage={addMessage}
                  onAddNotification={addNotification}
                  onMarkRead={markNotificationAsRead}
                />
              )}

              <div style={{ marginTop: '30px', borderTop: '1px solid #E0E0E0', paddingTop: '20px', textAlign: 'center' }}>
                <Button onClick={handleLogout} variant="ghost" style={{ fontSize: '12px' }}>
                  Sair do Sistema
                </Button>
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  )
}

export default App
