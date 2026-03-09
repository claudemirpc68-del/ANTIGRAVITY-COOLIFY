import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Clock, Calendar, ArrowLeftRight, MessageSquare, Sun, Moon, Coffee } from 'lucide-react';
import ScaleManager from '../gestor/ScaleManager';
import Modal from '../common/Modal';
import { MOCK_COLABORADORES, DIAS_IMAGEM, IMAGE_GRID } from '../../logic/mockData';

// ─── Helpers ───────────────────────────────────────────────────────────────

const getShiftDisplay = (horario) => {
    if (horario === '14:30') return { label: '14:30 — 22:50', nome: '2º Turno', icon: 'moon' };
    return { label: '07:30 — 14:30', nome: '1º Turno', icon: 'sun' };
};

const getTodayIndex = () => {
    const hoje = new Date();
    const inicio = new Date('2026-02-16');
    const diffDias = Math.floor((hoje - inicio) / (1000 * 60 * 60 * 24));
    if (diffDias < 0 || diffDias > 27) return -1;
    return diffDias;
};

const DIAS_SEMANA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const getStatusHoje = (colabId, todayIdx) => {
    if (todayIdx < 0) return { label: 'Fora do Período', color: '#888', bg: '#F5F5F5', icon: null };
    const grade = IMAGE_GRID[colabId] || [];
    const val = grade[todayIdx] || '';
    if (val === 'F') return { label: 'Folga', color: '#E65100', bg: 'rgba(255,102,0,0.12)', icon: '🌴' };
    if (val === 'D') return { label: 'Descanso (D)', color: '#1565C0', bg: 'rgba(33,150,243,0.12)', icon: '😴' };
    return { label: 'Em Serviço', color: '#2E7D32', bg: 'rgba(46,125,50,0.10)', icon: '✅' };
};

const getProximasFolgas = (colabId, todayIdx) => {
    if (todayIdx < 0) return [];
    const grade = IMAGE_GRID[colabId] || [];
    const folgas = [];
    for (let i = todayIdx + 1; i < DIAS_IMAGEM.length; i++) {
        if (grade[i] === 'F') {
            const dataBase = new Date('2026-02-16');
            dataBase.setDate(dataBase.getDate() + i);
            folgas.push({
                diaNum: dataBase.getDate(),
                mes: MESES[dataBase.getMonth()],
                semana: DIAS_SEMANA[dataBase.getDay()].substring(0, 3).toUpperCase()
            });
            if (folgas.length >= 3) break;
        }
    }
    return folgas;
};

// ─── Componente ────────────────────────────────────────────────────────────

const ColaboradorDashboard = ({ user = { nome: 'Colaborador', id: '1' } }) => {
    const [showScale, setShowScale] = useState(false);
    const [showJustificativa, setShowJustificativa] = useState(false);
    const [showTroca, setShowTroca] = useState(false);
    const [loading, setLoading] = useState(false);

    const todayIdx = getTodayIndex();
    const colabData = MOCK_COLABORADORES.find(c => c.id === user.id) || {};
    const { horario = '07:30', funcao = 'OP. LOJA' } = colabData;
    const turno = getShiftDisplay(horario);
    const statusHoje = getStatusHoje(user.id, todayIdx);
    const proximasFolgas = getProximasFolgas(user.id, todayIdx);
    const isFolgaHoje = statusHoje.label === 'Folga' || statusHoje.label === 'Descanso (D)';

    const handleSubmitJustificativa = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            alert('Justificativa enviada com sucesso para análise do gestor!');
            setShowJustificativa(false);
            setLoading(false);
        }, 1200);
    };

    const handleSubmitTroca = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            alert('Pedido de troca de turno registrado! Aguarde a confirmação de um colega ou gestor.');
            setShowTroca(false);
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
            <header style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Olá, {user.nome.split(' ')[0]}! 👋</h2>
                <p style={{ color: 'var(--text-secondary)' }}>{funcao} · Mercearia Suzano 068</p>
            </header>

            <Card className="assai-gradient" style={{ color: 'white', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '14px', borderRadius: '50%', flexShrink: 0 }}>
                        {turno.icon === 'moon' ? <Moon size={30} /> : <Sun size={30} />}
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', opacity: 0.85, marginBottom: '2px' }}>{turno.nome} — Seu turno:</p>
                        <h3 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '1px' }}>{turno.label}</h3>
                    </div>
                </div>

                <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', opacity: 0.9 }}>Status hoje:</span>
                    <span style={{ fontSize: '14px', fontWeight: '700' }}>
                        {statusHoje.icon && `${statusHoje.icon} `}{statusHoje.label}
                    </span>
                </div>

                {!isFolgaHoje && (
                    <div style={{ marginTop: '14px' }}>
                        <Button variant="secondary" style={{ width: '100%', background: 'white', color: 'var(--assai-orange)', fontWeight: '700' }}>
                            BATER PONTO
                        </Button>
                    </div>
                )}
            </Card>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <div style={{ padding: '12px', borderRadius: '10px', background: '#FFF8F0', border: turno.nome === '1º Turno' ? '2px solid var(--assai-orange)' : '1px solid #FFE0C8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sun size={18} color="var(--assai-orange)" />
                    <div>
                        <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', margin: 0 }}>1º TURNO</p>
                        <p style={{ fontSize: '13px', fontWeight: '700', margin: 0, color: 'var(--assai-orange)' }}>07:30 — 14:30</p>
                    </div>
                </div>
                <div style={{ padding: '12px', borderRadius: '10px', background: '#F3F0FF', border: turno.nome === '2º Turno' ? '2px solid #6A1B9A' : '1px solid #D8CAFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Moon size={18} color="#6A1B9A" />
                    <div>
                        <p style={{ fontSize: '10px', color: 'var(--text-tertiary)', margin: 0 }}>2º TURNO</p>
                        <p style={{ fontSize: '13px', fontWeight: '700', margin: 0, color: '#6A1B9A' }}>14:30 — 22:50</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <Card style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setShowScale(!showScale)}>
                    <Calendar size={24} color={showScale ? 'var(--status-success)' : 'var(--assai-orange)'} style={{ marginBottom: '8px' }} />
                    <p style={{ fontSize: '13px', fontWeight: '600' }}>{showScale ? 'Ocultar Escala' : 'Minha Escala'}</p>
                </Card>
                <Card style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setShowTroca(true)}>
                    <ArrowLeftRight size={24} color="var(--assai-orange)" style={{ marginBottom: '8px' }} />
                    <p style={{ fontSize: '13px', fontWeight: '600' }}>Trocar Turno</p>
                </Card>
                <Card style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setShowJustificativa(true)}>
                    <MessageSquare size={24} color="var(--assai-orange)" style={{ marginBottom: '8px' }} />
                    <p style={{ fontSize: '13px', fontWeight: '600' }}>Justificativa</p>
                </Card>
                <Card style={{ textAlign: 'center', cursor: 'pointer' }}>
                    <Coffee size={24} color="var(--assai-orange)" style={{ marginBottom: '8px' }} />
                    <p style={{ fontSize: '13px', fontWeight: '600' }}>Intervalos</p>
                </Card>
            </div>

            <Modal isOpen={showJustificativa} onClose={() => setShowJustificativa(false)} title="Enviar Justificativa">
                <form onSubmit={handleSubmitJustificativa}>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Justifique atrasos, faltas ou saídas antecipadas.</p>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Motivo:</label>
                    <select required style={{ width: '100%', marginBottom: '16px', padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }}>
                        <option value="">Selecione um motivo...</option>
                        <option value="atestado">Atestado Médico</option>
                        <option value="transporte">Problemas com Transporte</option>
                        <option value="pessoal">Problema Pessoal / Familiar</option>
                        <option value="outros">Outros</option>
                    </select>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Observações:</label>
                    <textarea required placeholder="Descreva brevemente o ocorrido..." style={{ width: '100%', height: '80px', marginBottom: '20px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <Button type="submit" variant="primary" style={{ width: '100%' }} disabled={loading}>{loading ? 'Enviando...' : 'Enviar para Gestor'}</Button>
                </form>
            </Modal>

            <Modal isOpen={showTroca} onClose={() => setShowTroca(false)} title="Solicitar Troca de Turno">
                <form onSubmit={handleSubmitTroca}>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Deseja trocar seu turno {turno.nome} por outro? Selecione o dia:</p>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Dia da Troca:</label>
                    <input type="date" required style={{ width: '100%', marginBottom: '16px', padding: '8px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Turno Desejado:</label>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <label style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' }}>
                            <input type="radio" name="turno" value="1" defaultChecked={turno.nome === '2º Turno'} /> <span style={{ marginLeft: '8px', fontSize: '13px' }}>1º Turno</span>
                        </label>
                        <label style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center', cursor: 'pointer' }}>
                            <input type="radio" name="turno" value="2" defaultChecked={turno.nome === '1º Turno'} /> <span style={{ marginLeft: '8px', fontSize: '13px' }}>2º Turno</span>
                        </label>
                    </div>
                    <Button type="submit" variant="primary" style={{ width: '100%' }} disabled={loading}>{loading ? 'Processando...' : 'Solicitar Troca'}</Button>
                </form>
            </Modal>

            {showScale && <div style={{ marginBottom: '24px', animation: 'fadeIn 0.3s' }}><ScaleManager colaboradorId={user.id} /></div>}

            <Card style={{ padding: '15px' }}>
                <h4 style={{ fontSize: '14px', marginBottom: '12px', fontWeight: '700' }}>🗓️ Próximas Folgas</h4>
                {proximasFolgas.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', padding: '10px 0' }}>Sem folgas previstas no período.</p>
                ) : (
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                        {proximasFolgas.map((f, i) => (
                            <div key={i} style={{ background: i === 0 ? '#FFF5F0' : '#F8F9FA', padding: '12px 14px', borderRadius: '10px', border: `1px solid ${i === 0 ? '#FFD0B0' : '#E0E0E0'}`, minWidth: '90px', textAlign: 'center', flexShrink: 0 }}>
                                <p style={{ fontSize: '10px', color: i === 0 ? 'var(--assai-orange)' : 'var(--text-tertiary)', fontWeight: '600', marginBottom: '4px' }}>{f.semana}</p>
                                <p style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>{f.diaNum}</p>
                                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>{f.mes}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ColaboradorDashboard;
