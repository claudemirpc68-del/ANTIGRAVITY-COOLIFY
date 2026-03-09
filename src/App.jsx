import React, { useState } from 'react'
import Header from './components/common/Header'
import LoginForm from './components/common/LoginForm'
import Button from './components/common/Button'
import ColaboradorDashboard from './components/colaborador/ColaboradorDashboard'
import GestorDashboard from './components/gestor/GestorDashboard'

function App() {
  const [view, setView] = useState('login') // 'login', 'colaborador', 'gestor'
  const [user, setUser] = useState(null)

  const handleLogin = (role, nome, id) => {
    setUser({ nome, role, id });
    setView(role);
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
  };

  return (
    <div className="app-container">
      {view === 'login' ? (
        <div style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <img src="/assets/logo-assai.png" alt="Assai Logo" style={{ height: '100px', width: 'auto', objectFit: 'contain', marginBottom: '30px' }} />
          <LoginForm onLogin={handleLogin} />
          <footer style={{ marginTop: 'auto', padding: '20px', fontSize: '11px', color: 'var(--text-tertiary)', textAlign: 'center' }}>
            © {new Date().getFullYear()} Assai Supermercados • Mercearia Suzano 068
          </footer>
        </div>
      ) : (
        <>
          <Header user={user} title={view === 'gestor' ? "PAINEL ADMINISTRATIVO" : "MINHA ESCALA"} />
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
