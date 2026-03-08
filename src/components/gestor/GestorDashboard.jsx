import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import ScaleManager from './ScaleManager';
import { MOCK_COLABORADORES, DIAS_IMAGEM, IMAGE_GRID } from '../../logic/mockData';
import { Users, Calendar as CalendarIcon, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

// Calcula o índice do dia atual dentro da grade (16/02 a 15/03/2026)
const getTodayIndex = () => {
    const hoje = new Date();
    const inicio = new Date('2026-02-16');
    const diffDias = Math.floor((hoje - inicio) / (1000 * 60 * 60 * 24));
    if (diffDias < 0 || diffDias > 27) return -1;
    return diffDias;
};

const getStatusColab = (colab, todayIdx) => {
    if (todayIdx < 0) return { label: 'Fora do Período', bg: '#F5F5F5', color: '#888' };
    const grade = IMAGE_GRID[colab.id] || [];
    const val = grade[todayIdx] || '';
    if (val === 'F') return { label: 'Folga', bg: '#FFF3E0', color: '#E65100' };
    if (val === 'D') return { label: 'Descanso (D)', bg: '#E3F2FD', color: '#1565C0' };
    if (val === '10:30') return { label: 'Turno 10:30', bg: '#F3E5F5', color: '#6A1B9A' };
    if (val === '22:00') return { label: 'Turno 22:00', bg: '#EDE7F6', color: '#4527A0' };
    return { label: 'Em Serviço', bg: '#E8F5E9', color: '#2E7D32' };
};

const GestorDashboard = () => {
    const [showEquipe, setShowEquipe] = useState(false);
    const todayIdx = getTodayIndex();

    const totais = MOCK_COLABORADORES.reduce((acc, colab) => {
        const grade = IMAGE_GRID[colab.id] || [];
        const val = grade[todayIdx] || '';
        if (val === 'F' || val === 'D') acc.folgas++;
        else acc.trabalhando++;
        return acc;
    }, { trabalhando: 0, folgas: 0 });

    const hoje = DIAS_IMAGEM[todayIdx];

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
            <header style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Painel de Gestão</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Setor: Mercearia | Unidade: Suzano 068</p>
            </header>

            {/* Indicadores calculados dinamicamente */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <Card style={{ borderLeft: '4px solid var(--status-success)', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <Users size={20} color="var(--status-success)" />
                        <span style={{ fontSize: '18px', fontWeight: '800' }}>{totais.trabalhando}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Trabalhando Hoje</p>
                </Card>

                <Card style={{ borderLeft: '4px solid var(--assai-orange)', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <CalendarIcon size={20} color="var(--assai-orange)" />
                        <span style={{ fontSize: '18px', fontWeight: '800' }}>{totais.folgas}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Folgas/Descanso Hoje</p>
                </Card>

                <Card style={{ borderLeft: '4px solid var(--status-error)', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <AlertCircle size={20} color="var(--status-error)" />
                        <span style={{ fontSize: '18px', fontWeight: '800' }}>{hoje ? `${hoje.dia}` : '--'}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Hoje ({hoje ? hoje.sem.toUpperCase() : ''})</p>
                </Card>
            </div>

            {/* Ações Rápidas */}
            <Card style={{ marginBottom: '24px' }}>
                <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '700' }}>Ações Rápidas</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <Button variant="primary" style={{ width: '100%' }}>Aprovar Justificativas</Button>
                    <Button variant="outline" style={{ width: '100%' }}>Histórico Mensal</Button>
                </div>
            </Card>

            {/* Grade da Escala Completa */}
            <div style={{ marginBottom: '24px' }}>
                <ScaleManager />
            </div>

            {/* Resumo da Equipe — Expansível ao clicar na seta */}
            <Card>
                <div
                    onClick={() => setShowEquipe(!showEquipe)}
                    style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        marginBottom: showEquipe ? '16px' : '0', cursor: 'pointer', userSelect: 'none'
                    }}
                >
                    <h4 style={{ fontSize: '16px', fontWeight: '700' }}>
                        Resumo da Equipe
                        <span style={{ fontSize: '11px', fontWeight: '400', color: 'var(--text-tertiary)', marginLeft: '8px' }}>
                            ▶ {totais.trabalhando} em serviço · {totais.folgas} de folga
                        </span>
                    </h4>
                    {showEquipe
                        ? <ChevronUp size={22} color="var(--assai-orange)" />
                        : <ChevronDown size={22} color="var(--text-tertiary)" />
                    }
                </div>

                {showEquipe && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', animation: 'fadeIn 0.3s' }}>
                        {MOCK_COLABORADORES.map((colab, i) => {
                            const status = getStatusColab(colab, todayIdx);
                            const isMe = colab.nome === 'CLAUDEMIR';
                            return (
                                <div key={colab.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '10px 8px',
                                    borderBottom: i < MOCK_COLABORADORES.length - 1 ? '1px solid #F5F5F5' : 'none',
                                    borderRadius: '6px',
                                    background: isMe ? 'rgba(255,102,0,0.05)' : 'transparent'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: isMe ? '700' : '500', color: isMe ? 'var(--assai-orange)' : 'var(--text-primary)' }}>
                                            {colab.nome}
                                        </span>
                                        <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                                            {colab.horario}
                                        </span>
                                    </div>
                                    <span style={{
                                        fontSize: '11px', background: status.bg, color: status.color,
                                        padding: '3px 10px', borderRadius: '12px', fontWeight: '600', whiteSpace: 'nowrap'
                                    }}>
                                        {status.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default GestorDashboard;
