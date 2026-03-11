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
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const initialUser = getInitialUser();
  const [user, setUser] = useState(initialUser);
  const [view, setView] = useState(initialUser ? initialUser.role : 'login');

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
          <Header user={user} title={view === 'gestor' ? "PAINEL ADMINISTRATIVO" : "MINHA ESCALA"} onLogout={handleLogout} />
          <main style={{ padding: '0 20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {view === 'colaborador' && <ColaboradorDashboard user={user} />}
              {view === 'gestor' && <GestorDashboard user={user} />}

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
