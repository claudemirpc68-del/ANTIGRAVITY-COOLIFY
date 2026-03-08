import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Clock, Calendar, ArrowLeftRight, MessageSquare } from 'lucide-react';
import ScaleManager from '../gestor/ScaleManager';

const ColaboradorDashboard = ({ user = { nome: 'Amanda Porto' } }) => {
    const [showScale, setShowScale] = useState(false);

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
            <header style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Olá, {user.nome.split(' ')[0]}!</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Bom trabalho hoje na Mercearia.</p>
            </header>

            {/* Status do Dia */}
            <Card className="assai-gradient" style={{ color: 'white', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '50%' }}>
                        <Clock size={32} />
                    </div>
                    <div>
                        <p style={{ fontSize: '14px', opacity: 0.9 }}>Seu turno hoje:</p>
                        <h3 style={{ fontSize: '22px', fontWeight: '800' }}>08:00 — 14:30</h3>
                    </div>
                </div>
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <Button variant="secondary" style={{ flex: 1, background: 'white', color: 'var(--assai-orange)' }}>
                        BATER PONTO
                    </Button>
                </div>
            </Card>

            {/* Ações Rápidas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <Card style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setShowScale(!showScale)}>
                    <Calendar size={24} color={showScale ? "var(--status-success)" : "var(--assai-orange)"} style={{ marginBottom: '8px' }} />
                    <p style={{ fontSize: '13px', fontWeight: '600' }}>{showScale ? 'Ocultar Escala' : 'Minha Escala'}</p>
                </Card>
                <Card style={{ textAlign: 'center', cursor: 'pointer' }}>
                    <ArrowLeftRight size={24} color="var(--assai-orange)" style={{ marginBottom: '8px' }} />
                    <p style={{ fontSize: '13px', fontWeight: '600' }}>Trocar Turno</p>
                </Card>
                <Card style={{ textAlign: 'center', cursor: 'pointer' }}>
                    <MessageSquare size={24} color="var(--assai-orange)" style={{ marginBottom: '8px' }} />
                    <p style={{ fontSize: '13px', fontWeight: '600' }}>Justificativa</p>
                </Card>
            </div>

            {showScale && (
                <div style={{ marginBottom: '24px', animation: 'fadeIn 0.3s' }}>
                    <ScaleManager />
                </div>
            )}

            <Card style={{ padding: '15px' }}>
                <h4 style={{ fontSize: '14px', marginBottom: '10px' }}>Próximas Folgas</h4>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                    <div style={{ background: '#FFF5F0', padding: '10px', borderRadius: '8px', border: '1px solid #FFE0D0', minWidth: '100px', textAlign: 'center' }}>
                        <p style={{ fontSize: '10px', color: 'var(--assai-orange)' }}>DOMINGO</p>
                        <p style={{ fontSize: '16px', fontWeight: '700' }}>15 Mar</p>
                    </div>
                    <div style={{ background: '#F8F9FA', padding: '10px', borderRadius: '8px', border: '1px solid #E0E0E0', minWidth: '100px', textAlign: 'center' }}>
                        <p style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>QUARTA</p>
                        <p style={{ fontSize: '16px', fontWeight: '700' }}>18 Mar</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ColaboradorDashboard;
