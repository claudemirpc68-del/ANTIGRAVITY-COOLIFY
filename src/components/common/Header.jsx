import React from 'react';
import { STORE_UNIT, SECTOR } from '../../logic/constants';

const Header = ({ title = "ESCALA DE TRABALHO" }) => {
    return (
        <header className="animate-fade-in" style={{ padding: '24px', background: 'white', borderBottom: '1px solid #E0E0E0', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <img src="https://upload.wikimedia.org/wikipedia/pt/2/2e/Assa%C3%AD_Atacadista_logo.png" alt="Assai Logo" style={{ height: '40px' }} />
                <div style={{ textAlign: 'right' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--assai-orange)' }}>{title}</h2>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>SETOR: {SECTOR}</p>
                </div>
            </div>

            <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', padding: '12px', fontSize: '11px', background: '#F8F9FA' }}>
                <div><strong>CENTRO DE RESULTADO:</strong> 5356</div>
                <div><strong>ESTABELECIMENTO:</strong> 283</div>
                <div><strong>GESTOR:</strong> JOHN/ANTONIO/LEONARDO</div>
                <div><strong>LOJA:</strong> {STORE_UNIT}</div>
            </div>
        </header>
    );
};

export default Header;
