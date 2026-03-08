import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import ScaleManager from './ScaleManager';
import { MOCK_COLABORADORES } from '../../logic/mockData';
import { Users, Calendar as CalendarIcon, AlertCircle, TrendingUp } from 'lucide-react';

const GestorDashboard = () => {
    return (
        <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
            <header style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Painel de Gestão</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Setor: Mercearia | Unidade: Suzano 068</p>
            </header>

            {/* Indicadores Rápidos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <Card style={{ borderLeft: '4px solid var(--status-success)', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <Users size={20} color="var(--status-success)" />
                        <span style={{ fontSize: '18px', fontWeight: '800' }}>82</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Trabalhando Hoje</p>
                </Card>

                <Card style={{ borderLeft: '4px solid var(--assai-orange)', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <CalendarIcon size={20} color="var(--assai-orange)" />
                        <span style={{ fontSize: '18px', fontWeight: '800' }}>14</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Folgas Hoje</p>
                </Card>

                <Card style={{ borderLeft: '4px solid var(--status-error)', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <AlertCircle size={20} color="var(--status-error)" />
                        <span style={{ fontSize: '18px', fontWeight: '800' }}>5</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Alertas de Domingos</p>
                </Card>
            </div>

            {/* Ações do Gestor */}
            <Card style={{ marginBottom: '24px' }}>
                <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '700' }}>Ações Rápidas</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <Button variant="primary" style={{ width: '100%' }}>Aprovar Justificativas</Button>
                    <Button variant="outline" style={{ width: '100%' }}>Histórico Mensal</Button>
                </div>
            </Card>

            {/* Grade de Escala - Mercearia */}
            <div style={{ marginBottom: '24px' }}>
                <ScaleManager />
            </div>

            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '700' }}>Resumo da Equipe</h4>
                    <TrendingUp size={18} color="var(--text-tertiary)" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {MOCK_COLABORADORES?.slice(0, 3)?.map((colab, i) => (
                        colab ? (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 2 ? '1px solid #F0F0F0' : 'none' }}>
                                <span style={{ fontSize: '14px', fontWeight: '500' }}>{colab.nome}</span>
                                <span style={{ fontSize: '11px', background: i === 0 ? '#E8F5E9' : '#FFF3E0', color: i === 0 ? '#2E7D32' : '#E65100', padding: '2px 8px', borderRadius: '12px' }}>
                                    {i === 0 ? 'Em Serviço' : 'Folga'}
                                </span>
                            </div>
                        ) : null
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default GestorDashboard;
