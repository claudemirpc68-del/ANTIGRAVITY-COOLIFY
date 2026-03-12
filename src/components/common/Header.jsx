import React from 'react';
import { STORE_UNIT, SECTOR } from '../../logic/constants';
import { LogOut, Bell, MessageSquare } from 'lucide-react';

const Header = ({ user, title = "ESCALA DE TRABALHO", onLogout, notificationCount = 0 }) => {
  return (
    <header className="assai-gradient" style={{ 
      padding: '20px', 
      color: 'white', 
      borderRadius: '0 0 25px 25px',
      marginBottom: '25px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ background: 'white', padding: '8px', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/assets/logo-assai.png" alt="Assai Logo" style={{ height: '35px', width: 'auto' }} />
          <span style={{ fontSize: '7px', color: '#666', fontWeight: 'bold', marginTop: '-2px' }}>By: Claudemir</span>
        </div>
        <div>
          <h1 style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '0.5px', margin: 0, textTransform: 'uppercase' }}>{title}</h1>
          <p style={{ fontSize: '10px', opacity: 0.9, fontWeight: '500', margin: 0 }}>
            {user?.nome} • {user?.matricula}
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center' }}>
            <Bell size={18} />
          </div>
          {notificationCount > 0 && (
            <div style={{ 
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: 'var(--status-error)', 
              color: 'white', 
              borderRadius: '50%', 
              width: '18px', 
              height: '18px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 'bold',
              border: '2px solid var(--assai-orange)'
            }}>
              {notificationCount}
            </div>
          )}
        </div>
        
        <button onClick={onLogout} style={{ 
          background: 'rgba(255,255,255,0.2)', 
          border: 'none', 
          color: 'white', 
          padding: '8px', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
