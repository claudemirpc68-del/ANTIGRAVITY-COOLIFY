import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import ScaleManager from './ScaleManager';
import Modal from '../common/Modal';
import { MOCK_COLABORADORES, DIAS_IMAGEM, IMAGE_GRID } from '../../logic/mockData';
import { Users, Calendar as CalendarIcon, AlertCircle, ChevronDown, ChevronUp, Paperclip, Eye, ExternalLink, History, CheckCircle2, XCircle, FileText } from 'lucide-react';

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

    const isSegundoTurno = colab.horario === '14:30';
    const interval = isSegundoTurno ? '14:30 — 22:50' : '07:30 — 14:30';

    return {
        label: isSegundoTurno ? `2º Turno (${interval})` : `1º Turno (${interval})`,
        bg: isSegundoTurno ? 'rgba(106, 27, 154, 0.1)' : 'rgba(46, 125, 50, 0.1)',
        color: isSegundoTurno ? '#6A1B9A' : '#2E7D32'
    };
};

const GestorDashboard = () => {
    const [showEquipe, setShowEquipe] = useState(false);
    const [showAprovar, setShowAprovar] = useState(false);
    const [showHistorico, setShowHistorico] = useState(false);
    const [justificativas, setJustificativas] = useState([
        { id: 1, nome: 'KAUA PEREIRA', motivo: 'Atestado Médico', obs: 'Consulta de rotina no dentista.', status: 'pendente', temAnexo: true, arquivo: 'atestado_0603.jpg' },
        { id: 2, nome: 'AMANDA PORTO', motivo: 'Transporte', obs: 'Ônibus quebrado na Av. Principal.', status: 'pendente', temAnexo: false }
    ]);

    const [historico] = useState([
        { id: 101, nome: 'PEDRO ANGELO', motivo: 'Atestado', data: '05/03/2026', status: 'aprovado', obs: 'Apresentou atestado de 2 dias por gripe.' },
        { id: 102, nome: 'DENISE ISSI', motivo: 'Troca de Turno', data: '04/03/2026', status: 'rejeitado', obs: 'Solicitou troca mas não havia substituto disponível.' },
        { id: 103, nome: 'LUIZA JESUS', motivo: 'Compensatória', data: '02/03/2026', status: 'aprovado', obs: 'Banco de horas positivo utilizado para consulta.' }
    ]);

    const todayIdx = getTodayIndex();
    const totais = MOCK_COLABORADORES.reduce((acc, colab) => {
        const grade = IMAGE_GRID[colab.id] || [];
        const val = grade[todayIdx] || '';
        if (val === 'F' || val === 'D') acc.folgas++;
        else acc.trabalhando++;
        return acc;
    }, { trabalhando: 0, folgas: 0 });

    const hoje = DIAS_IMAGEM[todayIdx];

    const handleAction = (id, action) => {
        alert(action === 'aprovar' ? 'Justificativa Aprovada!' : 'Justificativa Rejeitada!');
        setJustificativas(justificativas.filter(j => j.id !== id));
    };

    const handleVerAnexo = (arquivo) => {
        alert(`Abrindo visualização do arquivo: ${arquivo}\n(Simulação de abertura de JPEG/PDF)`);
    };

    const handleExportPDF = () => {
        const content = historico.map(h => `- ${h.nome}: ${h.motivo} (${h.status}) - Motivo: ${h.obs}`).join('\n');
        alert(`Gerando Relatório PDF...\n\nIncluindo Escala de Trabalho e Histórico Mensal:\n${content}\n\nO arquivo "Escala_e_Historico_Assai.pdf" será baixado em instantes.`);
    };

    return (
        <>
            {/* Modal de Aprovação */}
            <Modal isOpen={showAprovar} onClose={() => setShowAprovar(false)} title="Justificativas Pendentes">
                {justificativas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>Nenhuma justificativa pendente no momento.</p>
                        <Button variant="outline" onClick={() => setShowAprovar(false)} style={{ marginTop: '16px' }}>Fechar</Button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {justificativas.map(j => (
                            <div key={j.id} style={{ padding: '12px', border: '1px solid #eee', borderRadius: '10px', background: '#f9f9f9', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: '700', fontSize: '13px' }}>{j.nome}</span>
                                    <span style={{ fontSize: '11px', color: 'var(--assai-orange)', fontWeight: '600' }}>{j.motivo}</span>
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>"{j.obs}"</p>

                                {j.temAnexo && (
                                    <div
                                        onClick={() => handleVerAnexo(j.arquivo)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#1565C0', cursor: 'pointer', marginBottom: '12px', padding: '6px', background: 'rgba(21, 101, 192, 0.05)', borderRadius: '6px' }}
                                    >
                                        <Paperclip size={14} />
                                        <span>Anexo: {j.arquivo} (Clique para ver)</span>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Button variant="outline" style={{ flex: 1, padding: '6px', fontSize: '12px' }} onClick={() => handleAction(j.id, 'rejeitar')}>Rejeitar</Button>
                                    <Button variant="primary" style={{ flex: 1, padding: '6px', fontSize: '12px' }} onClick={() => handleAction(j.id, 'aprovar')}>Aprovar</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>

            {/* Modal de Histórico */}
            <Modal isOpen={showHistorico} onClose={() => setShowHistorico(false)} title="Histórico Mensal">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee', marginBottom: '5px' }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Ações Realizadas em Março/2026</p>
                    </div>
                    {historico.map(h => (
                        <div key={h.id} style={{ padding: '12px', borderBottom: '1px solid #F0F0F0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <div>
                                    <p style={{ fontSize: '13px', fontWeight: '700', margin: 0 }}>{h.nome}</p>
                                    <p style={{ fontSize: '11px', color: 'var(--text-tertiary)', margin: 0 }}>{h.motivo} · {h.data}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {h.status === 'aprovado' ? (
                                        <><CheckCircle2 size={16} color="var(--status-success)" /> <span style={{ fontSize: '11px', color: 'var(--status-success)', fontWeight: '600' }}>Aprovado</span></>
                                    ) : (
                                        <><XCircle size={16} color="var(--status-error)" /> <span style={{ fontSize: '11px', color: 'var(--status-error)', fontWeight: '600' }}>Rejeitado</span></>
                                    )}
                                </div>
                            </div>
                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', background: '#F5F5F5', padding: '6px', borderRadius: '4px', fontStyle: 'italic' }}>
                                <strong>Justificativa:</strong> "{h.obs}"
                            </p>
                        </div>
                    ))}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <Button variant="primary" style={{ flex: 1 }} onClick={handleExportPDF}>
                            <FileText size={16} style={{ marginRight: '6px' }} /> Exportar este Histórico
                        </Button>
                        <Button variant="outline" style={{ flex: 1 }} onClick={() => setShowHistorico(false)}>Fechar</Button>
                    </div>
                </div>
            </Modal>

            <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
                <header style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Painel de Gestão</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Setor: Mercearia | Unidade: Suzano 068</p>
                </header>

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

                <Card style={{ marginBottom: '24px' }}>
                    <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '700' }}>Ações Rápidas</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ position: 'relative' }}>
                            <Button variant="primary" style={{ width: '100%' }} onClick={() => setShowAprovar(true)}>
                                Aprovar Justificativas
                            </Button>
                            {justificativas.length > 0 && (
                                <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--status-error)', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', zIndex: 10 }}>
                                    {justificativas.length}
                                </span>
                            )}
                        </div>
                        <Button variant="outline" style={{ width: '100%' }} onClick={() => setShowHistorico(true)}>Histórico Mensal</Button>
                    </div>
                </Card>

                <div style={{ marginBottom: '24px' }}>
                    <ScaleManager onExport={handleExportPDF} />
                </div>

                <Card>
                    <div onClick={() => setShowEquipe(!showEquipe)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showEquipe ? '16px' : '0', cursor: 'pointer', userSelect: 'none' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '700' }}>
                            Resumo da Equipe
                            <span style={{ fontSize: '11px', fontWeight: '400', color: 'var(--text-tertiary)', marginLeft: '8px' }}>
                                ▶ {totais.trabalhando} em serviço · {totais.folgas} de folga
                            </span>
                        </h4>
                        {showEquipe ? <ChevronUp size={22} color="var(--assai-orange)" /> : <ChevronDown size={22} color="var(--text-tertiary)" />}
                    </div>

                    {showEquipe && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', animation: 'fadeIn 0.3s' }}>
                            {MOCK_COLABORADORES.map((colab, i) => {
                                const status = getStatusColab(colab, todayIdx);
                                const isMe = colab.nome === 'CLAUDEMIR';
                                return (
                                    <div key={colab.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 8px', borderBottom: i < MOCK_COLABORADORES.length - 1 ? '1px solid #F5F5F5' : 'none', borderRadius: '6px', background: isMe ? 'rgba(255,102,0,0.05)' : 'transparent' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: isMe ? '700' : '500', color: isMe ? 'var(--assai-orange)' : 'var(--text-primary)' }}>{colab.nome}</span>
                                            <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{colab.horario}</span>
                                        </div>
                                        <span style={{ fontSize: '11px', background: status.bg, color: status.color, padding: '3px 10px', borderRadius: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>{status.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
};

export default GestorDashboard;
