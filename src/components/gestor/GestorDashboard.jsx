import React, { useState, useMemo } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import ScaleManager from './ScaleManager';
import Modal from '../common/Modal';
import { MOCK_COLABORADORES, DIAS_IMAGEM } from '../../logic/mockData';
import { generateScale } from '../../logic/scaleEngine';
import { SCALE_TYPES } from '../../logic/constants';
import { Users, Calendar as CalendarIcon, AlertCircle, ChevronDown, ChevronUp, Paperclip, CheckCircle2, XCircle, FileText, Pencil, AlertTriangle, Umbrella, HeartPulse, UserX, CheckCircle } from 'lucide-react';

const DIAS_SEMANA_NOMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const FUNCOES = ['OP. LOJA', 'OP. PLENO', 'FISCAL', 'REPOSITOR', 'AUXILIAR'];

// Situações especiais que o gestor pode atribuir manualmente
const SITUACOES_ESPECIAIS = {
    NORMAL: null,
    AUSENCIA: { label: 'Ausência', bg: '#FFEBEE', color: '#B71C1C', icon: 'userx' },
    ATESTADO: { label: 'Atestado', bg: '#E3F2FD', color: '#1565C0', icon: 'heart' },
    FERIAS: { label: 'Férias', bg: '#F3E5F5', color: '#6A1B9A', icon: 'umbrella' },
    AFASTADO: { label: 'Afastado', bg: '#FFF8E1', color: '#F57F17', icon: 'alert' },
};

const getSituacaoConfig = (colabId, dynamicGrid, todayIdx, situacaoEspecial) => {
    // Situação especial tem PRIORIDADE máxima
    const especial = situacaoEspecial[colabId];
    if (especial && SITUACOES_ESPECIAIS[especial]) return SITUACOES_ESPECIAIS[especial];

    // Caso contrário, usa a escala dinâmica
    const grade = dynamicGrid[colabId] || [];
    const val = grade[todayIdx] || '';
    if (val === 'F' || val === 'D') return { label: 'Folga', bg: '#FFF3E0', color: '#E65100', icon: 'calendar' };

    const colab = MOCK_COLABORADORES.find(c => c.id === colabId);
    const isSegundoTurno = colab?.horario === '14:30';
    const interval = isSegundoTurno ? '14:30—22:50' : '07:30—14:30';
    return { label: `Trabalhando (${interval})`, bg: 'rgba(46,125,50,0.1)', color: '#2E7D32', icon: 'check' };
};

const getTodayIndex = () => {
    const hoje = new Date();
    const diaAtual = hoje.getDate();
    const index = DIAS_IMAGEM.findIndex(d => d.dia === diaAtual);
    return index !== -1 ? index : 0;
};

const StatusIcon = ({ icon, size = 14 }) => {
    if (icon === 'userx') return <UserX size={size} />;
    if (icon === 'heart') return <HeartPulse size={size} />;
    if (icon === 'umbrella') return <Umbrella size={size} />;
    if (icon === 'alert') return <AlertTriangle size={size} />;
    if (icon === 'calendar') return <CalendarIcon size={size} />;
    return <CheckCircle size={size} />;
};

const GestorDashboard = () => {
    const [showEquipe, setShowEquipe] = useState(false);
    const [showAprovar, setShowAprovar] = useState(false);
    const [showHistorico, setShowHistorico] = useState(false);
    const [colaboradores, setColaboradores] = useState(MOCK_COLABORADORES);
    const [editColab, setEditColab] = useState(null);
    const [editForm, setEditForm] = useState({});
    // Situações especiais: { colabId: 'AUSENCIA' | 'ATESTADO' | 'FERIAS' | 'AFASTADO' | null }
    const [situacaoEspecial, setSituacaoEspecial] = useState({});
    const [editSituacaoColab, setEditSituacaoColab] = useState(null);
    const [listModal, setListModal] = useState(null); // { title: '', list: [], color: '' }

    const [justificativas, setJustificativas] = useState([
        { id: 1, nome: 'KAUA PEREIRA', motivo: 'Atestado Médico', obs: 'Consulta de rotina no dentista.', status: 'pendente', temAnexo: true, arquivo: 'atestado_0603.jpg' },
        { id: 2, nome: 'AMANDA PORTO', motivo: 'Transporte', obs: 'Ônibus quebrado na Av. Principal.', status: 'pendente', temAnexo: false }
    ]);

    const [historico] = useState([
        { id: 101, nome: 'PEDRO ANGELO', motivo: 'Atestado', data: '05/03/2026', status: 'aprovado', obs: 'Apresentou atestado de 2 dias por gripe.' },
        { id: 102, nome: 'DENISE ISSI', motivo: 'Troca de Turno', data: '04/03/2026', status: 'rejeitado', obs: 'Solicitou troca mas não havia substituto disponível.' },
        { id: 103, nome: 'LUIZA JESUS', motivo: 'Compensatória', data: '02/03/2026', status: 'aprovado', obs: 'Banco de horas positivo utilizado para consulta.' }
    ]);

    const dynamicScale = useMemo(() => generateScale(colaboradores, 2026, 3), [colaboradores]);
    const dynamicGrid = useMemo(() => {
        const grid = {};
        dynamicScale.forEach(entry => {
            if (!grid[entry.colaborador_id]) grid[entry.colaborador_id] = [];
            grid[entry.colaborador_id].push(entry.tipo);
        });
        return grid;
    }, [dynamicScale]);

    const todayIdx = getTodayIndex();
    const hoje = DIAS_IMAGEM[todayIdx];

    // Contagem geral por situação (guarda a lista em vez de só o contador)
    const resumoHoje = useMemo(() => {
        const data = { trabalhando: [], folga: [], ausencia: [], atestado: [], ferias: [], afastado: [] };
        colaboradores.forEach(c => {
            const esp = situacaoEspecial[c.id];
            if (esp === 'AUSENCIA') { data.ausencia.push(c); return; }
            if (esp === 'ATESTADO') { data.atestado.push(c); return; }
            if (esp === 'FERIAS') { data.ferias.push(c); return; }
            if (esp === 'AFASTADO') { data.afastado.push(c); return; }
            const grade = dynamicGrid[c.id] || [];
            const val = grade[todayIdx] || '';
            if (val === 'F' || val === 'D') data.folga.push(c);
            else data.trabalhando.push(c);
        });
        return data;
    }, [colaboradores, situacaoEspecial, dynamicGrid, todayIdx]);

    const handleAction = (id, action) => {
        alert(action === 'aprovar' ? 'Justificativa Aprovada!' : 'Justificativa Rejeitada!');
        setJustificativas(justificativas.filter(j => j.id !== id));
    };
    const handleVerAnexo = (arquivo) => alert(`Abrindo visualização do arquivo: ${arquivo}`);
    const handleExportPDF = () => alert('Gerando Relatório PDF...\nO arquivo "Escala_e_Historico_Assai.pdf" será baixado.');

    const handleEditOpen = (colab) => {
        setEditColab(colab);
        setEditForm({ nome: colab.nome, horario: colab.horario, funcao: colab.funcao, folgaFixa: colab.folgaFixa, matricula: colab.matricula });
    };
    const handleEditSave = () => {
        setColaboradores(prev => prev.map(c => c.id === editColab.id ? { ...c, ...editForm, folgaFixa: parseInt(editForm.folgaFixa) } : c));
        setEditColab(null);
        alert(`✅ Dados de ${editForm.nome} atualizados com sucesso!`);
    };

    const handleSetSituacao = (colabId, situacao) => {
        setSituacaoEspecial(prev => ({ ...prev, [colabId]: situacao === 'NORMAL' ? null : situacao }));
        setEditSituacaoColab(null);
    };

    return (
        <>
            {/* Modal: Alterar Situação do Colaborador */}
            <Modal isOpen={!!editSituacaoColab} onClose={() => setEditSituacaoColab(null)} title={`Situação: ${editSituacaoColab?.nome || ''}`}>
                {editSituacaoColab && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Selecione a situação atual do colaborador para hoje:
                        </p>
                        {[
                            { key: 'NORMAL', label: '✅ Normal (conforme escala)', bg: 'rgba(46,125,50,0.08)', color: '#2E7D32', border: '#A5D6A7' },
                            { key: 'AUSENCIA', label: '🔴 Ausência (falta não justificada)', bg: '#FFEBEE', color: '#B71C1C', border: '#EF9A9A' },
                            { key: 'ATESTADO', label: '🔵 Atestado Médico', bg: '#E3F2FD', color: '#1565C0', border: '#90CAF9' },
                            { key: 'FERIAS', label: '🟣 Férias', bg: '#F3E5F5', color: '#6A1B9A', border: '#CE93D8' },
                            { key: 'AFASTADO', label: '🟡 Afastado / INSS', bg: '#FFF8E1', color: '#F57F17', border: '#FFE082' },
                        ].map(op => {
                            const atual = situacaoEspecial[editSituacaoColab.id] || 'NORMAL';
                            const isActive = op.key === atual;
                            return (
                                <div
                                    key={op.key}
                                    onClick={() => handleSetSituacao(editSituacaoColab.id, op.key)}
                                    style={{ padding: '12px 16px', borderRadius: '10px', background: op.bg, border: `2px solid ${isActive ? op.color : op.border}`, color: op.color, fontWeight: isActive ? '700' : '500', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}
                                >
                                    {op.label} {isActive && '← atual'}
                                </div>
                            );
                        })}
                        <Button variant="outline" style={{ marginTop: '8px' }} onClick={() => setEditSituacaoColab(null)}>Fechar</Button>
                    </div>
                )}
            </Modal>

            {/* Modal: Edição de dados do Colaborador */}
            <Modal isOpen={!!editColab} onClose={() => setEditColab(null)} title={`Editar: ${editColab?.nome || ''}`}>
                {editColab && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {[
                            { label: 'Nome Completo', key: 'nome', type: 'text' },
                            { label: 'Matrícula', key: 'matricula', type: 'text' },
                        ].map(f => (
                            <div key={f.key}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>{f.label}</label>
                                <input type={f.type} value={editForm[f.key] || ''} onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px' }} />
                            </div>
                        ))}
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>Função</label>
                            <select value={editForm.funcao} onChange={e => setEditForm(p => ({ ...p, funcao: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px' }}>
                                {FUNCOES.map(fn => <option key={fn} value={fn}>{fn}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>Turno</label>
                            <select value={editForm.horario} onChange={e => setEditForm(p => ({ ...p, horario: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px' }}>
                                <option value="07:30">1º Turno — 07:30 às 14:30</option>
                                <option value="14:30">2º Turno — 14:30 às 22:50</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>Dia de Folga Fixa Semanal</label>
                            <select value={editForm.folgaFixa} onChange={e => setEditForm(p => ({ ...p, folgaFixa: e.target.value }))} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px' }}>
                                {DIAS_SEMANA_NOMES.map((d, i) => <option key={i} value={i}>{d}</option>)}
                            </select>
                        </div>
                        <div style={{ background: '#FFF8F0', border: '1px solid #FFD0B0', borderRadius: '8px', padding: '10px', fontSize: '11px', color: '#E65100' }}>
                            ⚠️ Alterar o dia de folga fixa irá <strong>recalcular a escala</strong> automaticamente.
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Button variant="outline" style={{ flex: 1 }} onClick={() => setEditColab(null)}>Cancelar</Button>
                            <Button variant="primary" style={{ flex: 1 }} onClick={handleEditSave}>Salvar</Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal: Justificativas */}
            <Modal isOpen={showAprovar} onClose={() => setShowAprovar(false)} title="Justificativas Pendentes">
                {justificativas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>Nenhuma justificativa pendente.</p>
                        <Button variant="outline" onClick={() => setShowAprovar(false)} style={{ marginTop: '16px' }}>Fechar</Button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {justificativas.map(j => (
                            <div key={j.id} style={{ padding: '12px', border: '1px solid #eee', borderRadius: '10px', background: '#f9f9f9' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: '700', fontSize: '13px' }}>{j.nome}</span>
                                    <span style={{ fontSize: '11px', color: 'var(--assai-orange)', fontWeight: '600' }}>{j.motivo}</span>
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>"{j.obs}"</p>
                                {j.temAnexo && (
                                    <div onClick={() => handleVerAnexo(j.arquivo)} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#1565C0', cursor: 'pointer', marginBottom: '12px', padding: '6px', background: 'rgba(21,101,192,0.05)', borderRadius: '6px' }}>
                                        <Paperclip size={14} /><span>Anexo: {j.arquivo}</span>
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

            {/* Modal: Histórico */}
            <Modal isOpen={showHistorico} onClose={() => setShowHistorico(false)} title="Histórico Mensal">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ padding: '10px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
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
                                    {h.status === 'aprovado' ? <><CheckCircle2 size={16} color="var(--status-success)" /><span style={{ fontSize: '11px', color: 'var(--status-success)', fontWeight: '600' }}>Aprovado</span></> : <><XCircle size={16} color="var(--status-error)" /><span style={{ fontSize: '11px', color: 'var(--status-error)', fontWeight: '600' }}>Rejeitado</span></>}
                                </div>
                            </div>
                            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', background: '#F5F5F5', padding: '6px', borderRadius: '4px', fontStyle: 'italic' }}>
                                <strong>Justificativa:</strong> "{h.obs}"
                            </p>
                        </div>
                    ))}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <Button variant="primary" style={{ flex: 1 }} onClick={handleExportPDF}><FileText size={16} style={{ marginRight: '6px' }} /> Exportar</Button>
                        <Button variant="outline" style={{ flex: 1 }} onClick={() => setShowHistorico(false)}>Fechar</Button>
                    </div>
                </div>
            </Modal>

            {/* Modal: Lista de Colaboradores (Clicando nos Cards) */}
            <Modal isOpen={!!listModal} onClose={() => setListModal(null)} title={listModal?.title || 'Lista'}>
                {listModal && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '60vh', overflowY: 'auto' }}>
                        <div style={{ padding: '10px', background: `${listModal.color}15`, borderRadius: '8px', border: `1px solid ${listModal.color}40`, marginBottom: '10px' }}>
                            <p style={{ margin: 0, fontSize: '13px', color: listModal.color, fontWeight: '700' }}>Exibindo {listModal.list.length} colaboradores</p>
                        </div>
                        {listModal.list.length === 0 ? (
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', padding: '20px 0' }}>Nenhum colaborador nesta situação.</p>
                        ) : (
                            listModal.list.map((c, i) => (
                                <div key={c.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '13px', color: '#333' }}>{c.nome}</div>
                                        <div style={{ fontSize: '11px', color: '#777' }}>{c.funcao} • {c.horario === '14:30' ? '2º Turno (14:30—22:50)' : '1º Turno (07:30—14:30)'}</div>
                                    </div>
                                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: listModal.color, background: `${listModal.color}15`, padding: '4px 8px', borderRadius: '4px' }}>Mat. {c.matricula}</div>
                                </div>
                            ))
                        )}
                        <Button variant="outline" style={{ marginTop: '10px' }} onClick={() => setListModal(null)}>Fechar</Button>
                    </div>
                )}
            </Modal>

            <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
                <header style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Painel de Gestão</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Setor: Mercearia | Unidade: Suzano 068</p>
                </header>

                {/* ═══════ SITUAÇÃO DA EQUIPE — HOJE ═══════ */}
                <Card style={{ marginBottom: '20px', background: 'linear-gradient(135deg, #1A1C1E 0%, #2D2F33 100%)', color: 'white', border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'white', margin: 0 }}>
                            📊 Situação da Equipe — Hoje
                        </h4>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{hoje ? `${hoje.dia}/${hoje.mes || '03'} (${hoje.sem?.toUpperCase()})` : 'Hoje'}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                        {[
                            { label: 'Trabalhando', list: resumoHoje.trabalhando, color: '#00E676', bg: 'rgba(0,230,118,0.12)' },
                            { label: 'Folga/Desc.', list: resumoHoje.folga, color: '#FFB300', bg: 'rgba(255,179,0,0.12)' },
                            { label: 'Ausência', list: resumoHoje.ausencia, color: '#EF5350', bg: 'rgba(239,83,80,0.15)' },
                            { label: 'Atestado', list: resumoHoje.atestado, color: '#42A5F5', bg: 'rgba(66,165,245,0.15)' },
                            { label: 'Férias', list: resumoHoje.ferias, color: '#CE93D8', bg: 'rgba(206,147,216,0.15)' },
                            { label: 'Afastado', list: resumoHoje.afastado, color: '#FFD54F', bg: 'rgba(255,213,79,0.15)' },
                        ].map(s => (
                            <div
                                key={s.label}
                                onClick={() => setListModal({ title: s.label, list: s.list, color: s.color })}
                                title="Clique para ver quem são"
                                style={{ background: s.bg, borderRadius: '10px', padding: '10px', textAlign: 'center', border: `1px solid ${s.color}33`, cursor: 'pointer', transition: 'transform 0.1s' }}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <div style={{ fontSize: '22px', fontWeight: '800', color: s.color }}>{s.list.length}</div>
                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                    {/* Lista rápida dos que NÃO estão seguindo a escala normal */}
                    {Object.keys(situacaoEspecial).filter(id => situacaoEspecial[id]).length > 0 && (
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', fontWeight: '600' }}>⚠ ATENÇÃO — Fora da Escala:</p>
                            {Object.keys(situacaoEspecial).filter(id => situacaoEspecial[id]).map(id => {
                                const colab = colaboradores.find(c => c.id === id);
                                const esp = SITUACOES_ESPECIAIS[situacaoEspecial[id]];
                                if (!colab || !esp) return null;
                                return (
                                    <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', padding: '6px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'white' }}>{colab.nome}</span>
                                        <span style={{ fontSize: '11px', background: esp.bg, color: esp.color, padding: '2px 10px', borderRadius: '10px', fontWeight: '700' }}>{esp.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>

                {/* Cards de contagem */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    <Card
                        style={{ borderLeft: '4px solid var(--status-success)', padding: '16px', cursor: 'pointer' }}
                        onClick={() => setListModal({ title: 'Trabalhando Hoje', list: resumoHoje.trabalhando, color: 'var(--status-success)' })}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Users size={20} color="var(--status-success)" />
                            <span style={{ fontSize: '18px', fontWeight: '800' }}>{resumoHoje.trabalhando.length}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Trabalhando Hoje</p>
                        <div style={{ fontSize: '10px', color: 'var(--status-success)', marginTop: '4px', fontWeight: '600' }}>Ver Lista »</div>
                    </Card>
                    <Card
                        style={{ borderLeft: '4px solid var(--assai-orange)', padding: '16px', cursor: 'pointer' }}
                        onClick={() => setListModal({ title: 'Folgas/Descanso', list: resumoHoje.folga, color: 'var(--assai-orange)' })}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <CalendarIcon size={20} color="var(--assai-orange)" />
                            <span style={{ fontSize: '18px', fontWeight: '800' }}>{resumoHoje.folga.length}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Folgas/Descanso</p>
                        <div style={{ fontSize: '10px', color: 'var(--assai-orange)', marginTop: '4px', fontWeight: '600' }}>Ver Lista »</div>
                    </Card>
                    <Card
                        style={{ borderLeft: '4px solid var(--status-error)', padding: '16px', cursor: 'pointer' }}
                        onClick={() => setListModal({ title: 'Ausentes/Atestado', list: [...resumoHoje.ausencia, ...resumoHoje.atestado, ...resumoHoje.afastado], color: 'var(--status-error)' })}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <AlertCircle size={20} color="var(--status-error)" />
                            <span style={{ fontSize: '18px', fontWeight: '800' }}>{resumoHoje.ausencia.length + resumoHoje.atestado.length + resumoHoje.afastado.length}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ausentes/Atestado</p>
                        <div style={{ fontSize: '10px', color: 'var(--status-error)', marginTop: '4px', fontWeight: '600' }}>Ver Lista »</div>
                    </Card>
                </div>

                {/* Ações Rápidas */}
                <Card style={{ marginBottom: '24px' }}>
                    <h4 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '700' }}>Ações Rápidas</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ position: 'relative' }}>
                            <Button variant="primary" style={{ width: '100%' }} onClick={() => setShowAprovar(true)}>Aprovar Justificativas</Button>
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

                {/* Gerenciar Equipe */}
                <Card>
                    <div onClick={() => setShowEquipe(!showEquipe)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showEquipe ? '16px' : '0', cursor: 'pointer', userSelect: 'none' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '700' }}>
                            Gerenciar Equipe
                            <span style={{ fontSize: '11px', fontWeight: '400', color: 'var(--text-tertiary)', marginLeft: '8px' }}>
                                ▶ clique para expandir e editar situação
                            </span>
                        </h4>
                        {showEquipe ? <ChevronUp size={22} color="var(--assai-orange)" /> : <ChevronDown size={22} color="var(--text-tertiary)" />}
                    </div>

                    {showEquipe && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', animation: 'fadeIn 0.3s' }}>
                            {colaboradores.map((colab, i) => {
                                const situacaoConfig = getSituacaoConfig(colab.id, dynamicGrid, todayIdx, situacaoEspecial);
                                const isMe = colab.nome === 'CLAUDEMIR';
                                return (
                                    <div key={colab.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 8px', borderBottom: i < colaboradores.length - 1 ? '1px solid #F5F5F5' : 'none', borderRadius: '6px', background: isMe ? 'rgba(255,102,0,0.05)' : 'transparent' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: isMe ? '700' : '500', color: isMe ? 'var(--assai-orange)' : 'var(--text-primary)' }}>{colab.nome}</span>
                                            <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{colab.funcao} · {colab.horario}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span
                                                title="Clique para alterar situação"
                                                onClick={() => setEditSituacaoColab(colab)}
                                                style={{ fontSize: '11px', background: situacaoConfig.bg, color: situacaoConfig.color, padding: '3px 10px', borderRadius: '12px', fontWeight: '600', whiteSpace: 'nowrap', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                            >
                                                <StatusIcon icon={situacaoConfig.icon} size={12} />
                                                {situacaoConfig.label}
                                            </span>
                                            <div title="Editar dados" onClick={e => { e.stopPropagation(); handleEditOpen(colab); }} style={{ cursor: 'pointer', padding: '5px', borderRadius: '6px', background: 'rgba(33,150,243,0.08)', color: '#1565C0', display: 'flex', alignItems: 'center' }}>
                                                <Pencil size={14} />
                                            </div>
                                        </div>
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
