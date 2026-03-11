import React from 'react';
import { STORE_UNIT, SECTOR } from '../../logic/constants';
import { ArrowLeft } from 'lucide-react';

const Header = ({ user, title = "ESCALA DE TRABALHO", onLogout }) => {
    return (
        <header className="animate-fade-in" style={{ padding: '24px', background: 'white', borderBottom: '1px solid #E0E0E0', marginBottom: '20px' }}>
            {onLogout && (
                <button
                    onClick={onLogout}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        background: 'none', border: 'none', color: '#0060B1',
                        fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                        padding: '0', marginBottom: '16px'
                    }}
                >
                    <ArrowLeft size={16} /> Voltar para Tela Inicial
                </button>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <img src="/assets/logo-assai.png" alt="Assai Logo" style={{ height: '100px', width: 'auto', objectFit: 'contain', marginBottom: '8px' }} />
                    <span style={{ fontSize: '8px', color: 'var(--text-secondary)', fontWeight: 'bold', marginLeft: '2px' }}>By: Claudemir</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--assai-orange)', margin: 0 }}>{title}</h2>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>SETOR: {SECTOR}</p>
                </div>
            </div>

            <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', padding: '12px', fontSize: '11px', background: '#F8F9FA' }}>
                <div><strong>CENTRO DE RESULTADO:</strong> 5356</div>
                <div><strong>ESTABELECIMENTO:</strong> 283</div>
                <div><strong>GESTOR:</strong> {user?.role === 'gestor' ? user.nome : 'JOHN/ANTONIO/LEONARDO'}</div>
                <div><strong>LOJA:</strong> {STORE_UNIT}</div>
            </div>
        </header>
    );
};

export default Header;
