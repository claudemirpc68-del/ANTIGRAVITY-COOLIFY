import React, { useState, useMemo } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import ScaleManager from './ScaleManager';
import Modal from '../common/Modal';
import CommunicationCenter from '../common/CommunicationCenter';
import { MOCK_COLABORADORES, DIAS_IMAGEM, MOCK_GESTOR } from '../../logic/mockData';
import { generateScale } from '../../logic/scaleEngine';
import { SCALE_TYPES } from '../../logic/constants';
import { Users, Calendar as CalendarIcon, AlertCircle, ChevronDown, ChevronUp, Paperclip, CheckCircle2, XCircle, FileText, Pencil, AlertTriangle, Umbrella, HeartPulse, UserX, CheckCircle, Clock, Flag, MessageSquare, Share2 } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import WhatsAppModal from '../common/WhatsAppModal';

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

const getSituacaoConfig = (colaborador, dynamicGrid, todayIdx, situacaoEspecial, bateuPonto) => {
    if (!colaborador) return { label: 'Desconhecido', bg: '#eee', color: '#666', icon: 'clock' };
    
    const colabId = colaborador.id;
    // Situação especial tem PRIORIDADE máxima
    const especial = situacaoEspecial[colabId];
    if (especial && SITUACOES_ESPECIAIS[especial]) return SITUACOES_ESPECIAIS[especial];

    // Caso contrário, usa a escala dinâmica
    const grade = dynamicGrid[colabId] || [];
    const val = grade[todayIdx] || '';
    if (val === 'F' || val === 'D') return { label: 'Folga', bg: '#FFF3E0', color: '#E65100', icon: 'calendar' };

    const horario = colaborador.horario;
    
    // Calcular intervalo e horários de forma dinâmica
    let label = `Em serviço`;
    let bg = 'rgba(46,125,50,0.1)';
    let color = '#2E7D32';
    let icon = 'check';
    let interval = 'Horário não definido';

    if (horario) {
        const [h, m] = horario.split(':').map(Number);
        const minutosTurnoInicio = h * 60 + m;
        // Turno padrão de 8h20m (incluindo 1h de intervalo ou conforme regra local)
        const minutosTurnoFim = (minutosTurnoInicio + (8 * 60 + 20)) % 1440;
        
        const hFim = Math.floor(minutosTurnoFim / 60);
        const mFim = minutosTurnoFim % 60;
        interval = `${horario}—${String(hFim).padStart(2, '0')}:${String(mFim).padStart(2, '0')}`;
        label = `Trabalhando (${interval})`;

        const agora = new Date();
        const minutosAtual = agora.getHours() * 60 + agora.getMinutes();

        // Lógica para turnos que atravessam a meia-noite (ex: 22:00 -> 06:20)
        const atravessaMeiaNoite = minutosTurnoFim < minutosTurnoInicio;
        
        let estaNoTurno = false;
        if (atravessaMeiaNoite) {
            estaNoTurno = minutosAtual >= minutosTurnoInicio || minutosAtual <= minutosTurnoFim;
        } else {
            estaNoTurno = minutosAtual >= minutosTurnoInicio && minutosAtual <= minutosTurnoFim;
        }

        if (!estaNoTurno) {
            if (atravessaMeiaNoite) {
                // Se atravessa meia-noite, "Aguardando" é entre o fim do turno e o próximo início
                if (minutosAtual > minutosTurnoFim && minutosAtual < minutosTurnoInicio) {
                    label = `Aguardando (${interval})`;
                    color = '#F57C00';
                    bg = 'rgba(245,124,0,0.10)';
                    icon = 'clock';
                }
            } else {
                if (minutosAtual < minutosTurnoInicio) {
                    label = `Aguardando (${interval})`;
                    color = '#F57C00';
                    bg = 'rgba(245,124,0,0.10)';
                    icon = 'clock';
                } else if (minutosAtual > minutosTurnoFim) {
                    label = `Encerrado (${interval})`;
                    color = '#616161';
                    bg = 'rgba(97,97,97,0.10)';
                    icon = 'flag';
                }
            }
        }
    }

    // Se ele está no horário do turno mas NÃO bateu o ponto
    if (label.includes('Trabalhando') && !bateuPonto) {
        label = `Ponto Pendente (${interval})`;
        color = '#D32F2F'; // Vermelho de alerta
        bg = 'rgba(211,47,47,0.1)';
        icon = 'alert';
    } else if (label.includes('Trabalhando') && bateuPonto) {
        label = `Em Serviço (${interval})`;
        color = '#2E7D32';
        bg = 'rgba(46,125,50,0.1)';
        icon = 'check';
    }

    return { label, bg, color, icon };
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
    if (icon === 'clock') return <Clock size={size} />;
    if (icon === 'flag') return <Flag size={size} />;
    return <CheckCircle size={size} />;
};

const GestorDashboard = ({ user, messages, notifications, historico, pontosBatidos = [], onAddMessage, onAddNotification, onMarkRead }) => {
    const [showEquipe, setShowEquipe] = useState(false);
    const [showAprovar, setShowAprovar] = useState(false);
    const [showHistorico, setShowHistorico] = useState(false);
    const [colaboradores, setColaboradores] = useState(MOCK_COLABORADORES);
    const [editColab, setEditColab] = useState(null);
    const [editForm, setEditForm] = useState({});
    // Situações especiais: { colabId: 'AUSENCIA' | 'ATESTADO' | 'FERIAS' | 'AFASTADO' | null }
    const [situacaoEspecial, setSituacaoEspecial] = useState({});
    const [editSituacaoColab, setEditSituacaoColab] = useState(null);
    const [listModal, setListModal] = useState(null); 
    const [activeMainTab, setActiveMainTab] = useState('dashboard'); // 'dashboard' or 'communication'
    const [waModalOpen, setWaModalOpen] = useState(false);
    const [waRecipient, setWaRecipient] = useState(null);
    const [waTemplate, setWaTemplate] = useState('');

    // Dia selecionado para o resumo (inicializa com o dia de hoje)
    const [selectedDayIdx, setSelectedDayIdx] = useState(() => getTodayIndex());
    const [justificativas, setJustificativas] = useState([
        { id: 1, nome: 'KAUA PEREIRA', motivo: 'Atestado Médico', obs: 'Consulta de rotina no dentista.', status: 'pendente', temAnexo: true, arquivo: 'atestado_0603.jpg' },
        { id: 2, nome: 'AMANDA PORTO', motivo: 'Transporte', obs: 'Ônibus quebrado na Av. Principal.', status: 'pendente', temAnexo: false }
    ]);



    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const dynamicScale = useMemo(() => generateScale(colaboradores, currentYear, currentMonth), [colaboradores, currentYear, currentMonth]);
    const dynamicGrid = useMemo(() => {
        const grid = {};
        dynamicScale.forEach(entry => {
            if (!grid[entry.colaborador_id]) grid[entry.colaborador_id] = [];
            grid[entry.colaborador_id].push(entry.tipo);
        });
        return grid;
    }, [dynamicScale]);

    const todayIdx = getTodayIndex();

    // Contagem geral por situação (guarda a lista em vez de só o contador)
    const resumoHoje = useMemo(() => {
        const data = { trabalhando: [], folga: [], ausencia: [], atestado: [], ferias: [], afastado: [], emServico: [], aguardando: [] };
        colaboradores.forEach(c => {
            const esp = situacaoEspecial[c.id];
            if (esp === 'AUSENCIA') { data.ausencia.push(c); return; }
            if (esp === 'ATESTADO') { data.atestado.push(c); return; }
            if (esp === 'FERIAS') { data.ferias.push(c); return; }
            if (esp === 'AFASTADO') { data.afastado.push(c); return; }
            
            const grade = dynamicGrid[c.id] || [];
            const val = grade[selectedDayIdx] || '';
            if (val === 'F' || val === 'D') {
                data.folga.push(c);
            } else {
                data.trabalhando.push(c);
                // Classificação extra baseada no horário atual se for o dia de hoje
                if (selectedDayIdx === todayIdx) {
                    const pontoInfo = Array.isArray(pontosBatidos) ? pontosBatidos.find(p => p && p.colabId === c.id) : null;
                    const bateu = !!pontoInfo;
                    const config = getSituacaoConfig(c, dynamicGrid, todayIdx, situacaoEspecial, bateu);
                    if (config.label.includes('Em Serviço') || config.label.includes('Ponto Pendente')) data.emServico.push(c);
                    else if (config.label.includes('Aguardando')) data.aguardando.push(c);
                }
            }
        });
        return data;
    }, [colaboradores, situacaoEspecial, dynamicGrid, selectedDayIdx, todayIdx]);

    const handleAction = (id, action) => {
        alert(action === 'aprovar' ? 'Justificativa Aprovada!' : 'Justificativa Rejeitada!');
        setJustificativas(justificativas.filter(j => j.id !== id));
    };
    const handleVerAnexo = (arquivo) => alert(`Abrindo visualização do arquivo: ${arquivo}`);
    
    const handleExportPDF = () => {
        const doc = new jsPDF();
        
        // Header
        doc.setFillColor(255, 102, 0); // Assaí Orange
        doc.rect(0, 0, 210, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Relatório e Histórico da Escala - ${currentMonth}/${currentYear}`, 14, 13);
        
        // Subtitle Info
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Setor: Mercearia | Unidade: Suzano 068', 14, 28);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 14, 34);
        
        // Table Data for History
        const tableColumn = ["Data", "Colaborador", "Motivo", "Status", "Observação"];
        const tableRows = [];
        
        historico.forEach(h => {
            const hData = [
                h.data,
                h.nome,
                h.motivo,
                h.status.toUpperCase(),
                h.obs
            ];
            tableRows.push(hData);
        });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text("Histórico de Ações e Alterações", 14, 45);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 50,
            theme: 'striped',
            headStyles: { fillColor: [255, 102, 0] },
            styles: { fontSize: 8 }
        });

        // Add Current Shift Summary Page
        doc.addPage();
        doc.setFillColor(25, 118, 210); // Secondary Blue
        doc.rect(0, 0, 210, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Resumo Geral da Equipe`, 14, 13);
        
        let yPos = 30;
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(10);
        
        const summaryData = [
            ['Trabalhando Hoje', resumoHoje.trabalhando.length],
            ['Folgas/Descanso', resumoHoje.folga.length],
            ['Ausentes/Atestado/Férias/Afastado', resumoHoje.ausencia.length + resumoHoje.atestado.length + resumoHoje.ferias.length + resumoHoje.afastado.length]
        ];

        doc.autoTable({
            head: [['Situação', 'Quantidade']],
            body: summaryData,
            startY: yPos,
            theme: 'grid',
            headStyles: { fillColor: [50, 50, 50] }
        });

        doc.save(`Escala_e_Historico_Assai_${currentMonth}_${currentYear}.pdf`);
    };

    const handleWhatsAppContact = (colab, templateType = 'general') => {
        if (!colab.telefone) {
            alert('Este colaborador não possui telefone cadastrado.');
            return;
        }

        const templates = {
            general: `Olá ${colab.nome}, aqui é o gestor ${user.nome} do Assaí Suzano. Gostaria de falar sobre sua escala.`,
            folga: `Oi ${colab.nome}, confirmando sua folga para amanhã conforme nossa escala 6x1. Até mais!`,
            ponto: `Olá ${colab.nome}, notei que seu ponto ainda está pendente no sistema. Tudo certo por aí?`,
            troca: `Olá ${colab.nome}, temos uma solicitação de troca de turno que envolve seu horário. Poderia me confirmar se é possível?`,
            escala: generateScaleSummary(colab)
        };

        setWaRecipient(colab);
        setWaTemplate(templates[templateType] || templates.general);
        setWaModalOpen(true);
    };

    const generateScaleSummary = (colab) => {
        const grade = dynamicGrid[colab.id] || [];
        const folgas = [];
        const mesNome = MESES[currentMonth - 1];

        DIAS_IMAGEM.forEach((d, idx) => {
            if (grade[idx] === 'F' || grade[idx] === 'D') {
                folgas.push(d.dia);
            }
        });

        return `🗓️ *SUA ESCALA - ${mesNome.toUpperCase()}*\n\nOlá ${colab.nome}, segue o resumo das suas folgas para este mês:\n\n*Folgas:* ${folgas.join(', ')}\n*Turno:* ${colab.horario}\n\n_Favor conferir no Painel Zen._`;
    };

    const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const handleEditSave = () => {
        setColaboradores(prev => prev.map(c => c.id === editColab.id ? { ...c, ...editForm, folgaFixa: parseInt(editForm.folgaFixa) } : c));
        setEditColab(null);
        alert(`✅ Dados de ${editForm.nome} atualizados com sucesso!`);
    };

    const handleSetSituacao = (colabId, situacao) => {
        setSituacaoEspecial(prev => ({ ...prev, [colabId]: situacao === 'NORMAL' ? null : situacao }));
        setEditSituacaoColab(null);
    };

    const handleSendSwapRequest = (colab) => {
        const confirmResult = window.confirm(`Deseja enviar uma solicitação de TROCA DE TURNO para ${colab.nome}?`);
        if (confirmResult) {
            onAddNotification({
                title: '🔄 Solicitação de Troca de Turno',
                message: `O gestor ${user.nome} solicitou uma conversa com você sobre uma possível troca de turno na escala atual. Por favor, entre em contato ou aguarde no local.`,
                type: 'swap',
                senderId: user.id,
                recipientId: colab.id
            });
            alert('Solicitação enviada como notificação para o colaborador!');
        }
    };

    return (
        <>
            {/* Modal: WhatsApp Flexível e Editável */}
            <WhatsAppModal 
                isOpen={waModalOpen} 
                onClose={() => setWaModalOpen(false)} 
                recipient={waRecipient} 
                templateMessage={waTemplate} 
            />

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
                            { label: 'WhatsApp (com DDD)', key: 'telefone', type: 'text' },
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
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Ações Realizadas Recentes</p>
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
                            listModal.list.map((c, i) => {
                                const ponto = Array.isArray(pontosBatidos) ? pontosBatidos.find(p => p && typeof p === 'object' && p.colabId === c.id) : null;
                                const hasValidTimestamp = ponto && ponto.timestamp && !isNaN(new Date(ponto.timestamp).getTime());
                                
                                return (
                                    <div key={c.id || i} style={{ display: 'flex', flexDirection: 'column', padding: '12px', borderBottom: '1px solid #eee' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontWeight: '600', fontSize: '13px', color: '#333' }}>{c.nome}</div>
                                                <div style={{ fontSize: '11px', color: '#777' }}>{c.funcao} · Mat. {c.matricula}</div>
                                            </div>
                                            <div style={{ fontSize: '10px', fontWeight: 'bold', color: listModal.color, background: `${listModal.color}15`, padding: '4px 8px', borderRadius: '4px' }}>
                                                {hasValidTimestamp ? `PONTO: ${new Date(ponto.timestamp).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}` : (ponto ? 'REGISTRADO' : 'PENDENTE')}
                                            </div>
                                        </div>
                                        {ponto && (
                                            <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {ponto.networkIP && <span style={{ fontSize: '10px', background: '#F0F0F0', padding: '2px 6px', borderRadius: '4px', color: '#666' }}>IP: {ponto.networkIP}</span>}
                                                {ponto.coords ? (
                                                    <a 
                                                        href={`https://www.google.com/maps?q=${ponto.coords.lat},${ponto.coords.lng}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        style={{ fontSize: '10px', background: 'rgba(0,184,148,0.1)', padding: '2px 6px', borderRadius: '4px', color: '#00B894', textDecoration: 'none', fontWeight: 'bold' }}
                                                    >
                                                        📍 Ver Localização (Mapa)
                                                    </a>
                                                ) : (
                                                    <span style={{ fontSize: '10px', background: '#FFF0F0', padding: '2px 6px', borderRadius: '4px', color: '#D32F2F' }}>📍 GPS Desligado</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                        <Button variant="outline" style={{ marginTop: '10px' }} onClick={() => setListModal(null)}>Fechar</Button>
                    </div>
                )}
            </Modal>

            <div className="animate-fade-in" style={{ paddingBottom: '40px' }}>
                <header style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Painel de Gestão</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Setor: Mercearia | Unidade: Suzano 068</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Button 
                                onClick={() => setActiveMainTab('dashboard')} 
                                variant={activeMainTab === 'dashboard' ? 'primary' : 'outline'}
                                style={{ fontSize: '13px' }}
                            >
                                Painel Principal
                            </Button>
                            <Button 
                                onClick={() => setActiveMainTab('communication')} 
                                variant={activeMainTab === 'communication' ? 'primary' : 'outline'}
                                style={{ fontSize: '13px' }}
                            >
                                WhatsApp (Contatos)
                            </Button>
                        </div>
                    </div>
                </header>

                {activeMainTab === 'communication' ? (
                    <CommunicationCenter 
                        user={user} 
                        messages={messages} 
                        notifications={notifications}
                        onAddMessage={onAddMessage}
                        onAddNotification={onAddNotification}
                        onMarkRead={onMarkRead}
                    />
                ) : (
                    <>
                    <Card style={{ marginBottom: '20px', background: 'linear-gradient(135deg, #1A1C1E 0%, #2D2F33 100%)', color: 'white', border: 'none' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'white', margin: 0 }}>
                            📊 Situação da Equipe
                        </h4>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                            {DIAS_IMAGEM[selectedDayIdx] ? `${DIAS_IMAGEM[selectedDayIdx].dia}/${String(currentMonth).padStart(2, '0')} (${DIAS_IMAGEM[selectedDayIdx].sem?.toUpperCase()})` : 'Selecionado'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '10px', marginBottom: '6px', WebkitOverflowScrolling: 'touch', minWidth: '100%', scrollSnapType: 'x mandatory' }}>

                            {[
                                { label: 'Em Serviço', list: (selectedDayIdx === todayIdx) ? resumoHoje.emServico : resumoHoje.trabalhando, color: '#00E676', bg: 'rgba(0,230,118,0.12)' },
                                { label: 'Aguardando', list: resumoHoje.aguardando, color: '#FFB300', bg: 'rgba(255,179,0,0.12)' },
                                { label: 'Folga/Desc.', list: resumoHoje.folga, color: '#E65100', bg: 'rgba(230,81,0,0.12)' },
                                { label: 'Ausência', list: resumoHoje.ausencia, color: '#EF5350', bg: 'rgba(239,83,80,0.15)' },
                                { label: 'Atestado', list: resumoHoje.atestado, color: '#42A5F5', bg: 'rgba(66,165,245,0.15)' },
                                { label: 'Férias', list: resumoHoje.ferias, color: '#CE93D8', bg: 'rgba(206,147,216,0.15)' },
                                { label: 'Afastado', list: resumoHoje.afastado, color: '#FFD54F', bg: 'rgba(255,213,79,0.15)' },
                            ].map(s => (
                                <div
                                    key={s.label}
                                    onClick={() => setListModal({ title: s.label, list: s.list, color: s.color })}
                                    title="Clique para ver quem são"
                                    style={{ flex: '0 0 auto', minWidth: '100px', background: s.bg, borderRadius: '10px', padding: '10px', textAlign: 'center', border: `1px solid ${s.color}33`, cursor: 'pointer', transition: 'transform 0.1s', scrollSnapAlign: 'start' }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <div style={{ fontSize: '22px', fontWeight: '800', color: s.color }}>{s.list.length}</div>
                                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', fontWeight: '500', whiteSpace: 'nowrap' }}>{s.label}</div>

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
                <div style={{ display: 'flex', overflowX: 'auto', gap: '16px', paddingBottom: '10px', marginBottom: '14px', WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}>
                    <Card
                        style={{ flex: '0 0 auto', minWidth: '160px', borderLeft: '4px solid var(--status-success)', padding: '16px', cursor: 'pointer', scrollSnapAlign: 'start' }}

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
                        style={{ flex: '0 0 auto', minWidth: '160px', borderLeft: '4px solid var(--assai-orange)', padding: '16px', cursor: 'pointer', scrollSnapAlign: 'start' }}
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
                        style={{ flex: '0 0 auto', minWidth: '160px', borderLeft: '4px solid var(--status-error)', padding: '16px', cursor: 'pointer', scrollSnapAlign: 'start' }}
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
                    <ScaleManager
                        onExport={handleExportPDF}
                        selectedDayIndex={selectedDayIdx}
                        setSelectedDayIndex={setSelectedDayIdx}
                        justificativas={justificativas}
                        historico={historico}
                        colaboradores={colaboradores}
                    />
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
                                const pontoInfo = Array.isArray(pontosBatidos) ? pontosBatidos.find(p => p && p.colabId === colab.id) : null;
                                const bateu = !!pontoInfo;
                                const situacaoConfig = getSituacaoConfig(colab, dynamicGrid, todayIdx, situacaoEspecial, bateu);
                                const isMe = colab.nome === MOCK_GESTOR.nome;
                                return (
                                    <div key={colab.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 8px', borderBottom: i < colaboradores.length - 1 ? '1px solid #F5F5F5' : 'none', borderRadius: '6px', background: isMe ? 'rgba(255,102,0,0.05)' : 'transparent' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: bateu ? '#4CAF50' : (situacaoConfig.label.includes('Ponto Pendente') ? '#F44336' : '#DDD') }}></div>
                                            <span style={{ fontSize: '13px', fontWeight: isMe ? '700' : '500', color: isMe ? 'var(--assai-orange)' : 'var(--text-primary)' }}>{colab.nome}</span>
                                            <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{colab.funcao} · {colab.horario}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div title="Trocar Turno" onClick={e => { e.stopPropagation(); handleSendSwapRequest(colab); }} style={{ cursor: 'pointer', padding: '5px', borderRadius: '6px', background: 'rgba(255,102,0,0.08)', color: 'var(--assai-orange)', display: 'flex', alignItems: 'center' }}>
                                                <Users size={14} />
                                            </div>
                                            <div title="Trocar Turno" onClick={e => { e.stopPropagation(); handleSendSwapRequest(colab); }} style={{ cursor: 'pointer', padding: '5px', borderRadius: '6px', background: 'rgba(255,102,0,0.08)', color: 'var(--assai-orange)', display: 'flex', alignItems: 'center' }}>
                                                <Users size={14} />
                                            </div>
                                            <span
                                                title="Clique para alterar situação"
                                                onClick={() => setEditSituacaoColab(colab)}
                                                style={{ fontSize: '11px', background: situacaoConfig.bg, color: situacaoConfig.color, padding: '3px 10px', borderRadius: '12px', fontWeight: '600', whiteSpace: 'nowrap', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', border: `1px solid ${situacaoConfig.color}40` }}
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
                </>
                )}
            </div>
        </>
    );
};


export default GestorDashboard;
