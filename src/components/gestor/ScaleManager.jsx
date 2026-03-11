import React, { useState, useMemo } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { MOCK_COLABORADORES, DIAS_IMAGEM, MOCK_GESTOR } from '../../logic/mockData';
import { generateScale } from '../../logic/scaleEngine';
import { Download, Printer, Search, AlertTriangle, CheckCircle, Info, Calendar, MessageSquare, X, Filter } from 'lucide-react';

// Constantes da loja
const LOJA_INFO = {
    setor: 'MERCEARIA',
    loja: 'SUZANO',
    cr: '5356',
    unidade: '068',
    gestor: MOCK_GESTOR?.nome || 'EDERSON CUBAS'
};

const ScaleManager = ({ colaboradorId, onExport, selectedDayIndex: propSelectedDayIndex, setSelectedDayIndex: propSetSelectedDayIndex, justificativas = [], historico = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [shiftFilter, setShiftFilter] = useState('ALL');
    const [obsModalColab, setObsModalColab] = useState(null);
    const [colabDetails, setColabDetails] = useState(null);
    const [obsText, setObsText] = useState('');

    // Suporte a estado local se não for passado pelo pai
    const [localSelectedDayIndex, setLocalSelectedDayIndex] = useState(0);
    const selectedDayIndex = propSelectedDayIndex !== undefined ? propSelectedDayIndex : localSelectedDayIndex;
    const setSelectedDayIndex = propSetSelectedDayIndex !== undefined ? propSetSelectedDayIndex : setLocalSelectedDayIndex;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    // Gerar escala dinâmica para o mês corrente
    const dynamicScale = useMemo(() => generateScale(MOCK_COLABORADORES, currentYear, currentMonth), [currentYear, currentMonth]);

    // Transformar em grid para compatibilidade
    const dynamicGrid = useMemo(() => {
        const grid = {};
        dynamicScale.forEach(entry => {
            if (!grid[entry.colaborador_id]) grid[entry.colaborador_id] = [];
            grid[entry.colaborador_id].push(entry.tipo);
        });
        return grid;
    }, [dynamicScale]);



    // Filter Colleagues
    const filteredColabs = useMemo(() => {
        let list = colaboradorId
            ? MOCK_COLABORADORES.filter(c => c.id === colaboradorId)
            : MOCK_COLABORADORES;

        if (searchTerm) {
            list = list.filter(c => c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.matricula.includes(searchTerm));
        }

        if (shiftFilter !== 'ALL') {
            list = list.filter(c => c.horario === shiftFilter);
        }

        if (statusFilter !== 'ALL') {
            list = list.filter(c => {
                const gridRow = dynamicGrid[c.id] || [];
                const stateToday = gridRow[selectedDayIndex] || '';

                if (statusFilter === 'TRABALHAM') {
                    return stateToday === 'T';
                }
                if (statusFilter === 'FOLGAM') {
                    return stateToday === 'F' || stateToday === 'D';
                }
                return true;
            });
        }

        return list;
    }, [colaboradorId, searchTerm, shiftFilter, statusFilter, selectedDayIndex, dynamicGrid]);

    // Calcular Totais do Dia
    const totaisDia = useMemo(() => {
        let trab = 0;
        let folg = 0;
        MOCK_COLABORADORES.forEach(c => {
            const val = (dynamicGrid[c.id] || [])[selectedDayIndex] || '';
            if (val === 'F' || val === 'D') folg++;
            else trab++;
        });
        return { trabalhando: trab, folgando: folg };
    }, [selectedDayIndex, dynamicGrid]);

    // Função para verificar alertas por colaborador (ex: > 6 dias seguidos sem folga na grade)
    const checkAlerts = (colabId) => {
        const row = dynamicGrid[colabId] || [];
        let seq = 0;
        let hasAlert = false;

        for (let i = 0; i < row.length; i++) {
            const val = row[i];
            if (val === 'F' || val === 'D') {
                seq = 0;
            } else {
                seq++;
                if (seq > 6) {
                    hasAlert = true;
                    break;
                }
            }
        }
        return hasAlert;
    };

    const getCellStyles = (val) => {
        if (val === 'F') return { bg: 'var(--assai-orange)', color: 'white', size: '11px', label: 'F' };
        if (val === 'D') return { bg: '#2196F3', color: 'white', size: '11px', label: 'D' };
        if (val === 'A' || val === 'J') return { bg: '#E53935', color: 'white', size: '11px', label: val }; // Ausência/Justificativa

        // Se for vazio, usar horário do colab ou "TRABALHO"
        if (val && val.includes(':')) {
            // Exibir turno formatado (ex: 10:30-22:50) se houver espaço, ou só a entrada
            return { bg: '#E8F5E9', color: '#2E7D32', size: '10px', label: val, border: '1px solid #C8E6C9' };
        }

        return { bg: 'transparent', color: 'var(--text-tertiary)', size: '11px', label: '-' };
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Header / Info Pane E Dashboard Resumo & Filtros - Visíveis APENAS para Gestores */}
            {!colaboradorId && (
                <>
                    {/* Header / Info Pane */}
                    <Card style={{ padding: '20px', background: 'linear-gradient(to right, #0060B1, #0082ED)', color: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                            <div>
                                <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: '800' }}>ESCALA 6X1 - VISAO GESTOR</h2>
                                <div style={{ display: 'flex', gap: '20px', fontSize: '13px', opacity: 0.9, flexWrap: 'wrap' }}>
                                    <span><strong>SETOR:</strong> {LOJA_INFO.setor}</span>
                                    <span><strong>LOJA:</strong> {LOJA_INFO.loja}</span>
                                    <span><strong>CR:</strong> {LOJA_INFO.cr}</span>
                                    <span><strong>UNIDADE:</strong> {LOJA_INFO.unidade}</span>
                                    <span><strong>GESTOR:</strong> {LOJA_INFO.gestor}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Button variant="ghost" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }} onClick={() => window.print()}>
                                    <Printer size={16} /> Imprimir
                                </Button>
                                <Button variant="ghost" style={{ background: 'white', color: '#0060B1', border: 'none' }} onClick={onExport}>
                                    <Download size={16} /> Exportar PDF
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Dashboard Resumo & Filtros */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                        <Card style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Calendar size={16} /> RESUMO DO DIA: {DIAS_IMAGEM[selectedDayIndex]?.dia}/{String(currentMonth).padStart(2, '0')}
                            </h3>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1, background: '#E8F5E9', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#2E7D32' }}>{totaisDia.trabalhando}</div>
                                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#2E7D32' }}>TRABALHANDO</div>
                                </div>
                                <div style={{ flex: 1, background: '#FFF3E0', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#E65100' }}>{totaisDia.folgando}</div>
                                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#E65100' }}>FOLGAS</div>
                                </div>
                            </div>
                        </Card>

                        <Card style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Filter size={16} /> FILTROS
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Buscar nome ou matrícula..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ padding: '8px 12px', border: '1px solid #CCC', borderRadius: '4px', fontSize: '13px', gridColumn: '1 / -1' }}
                                />
                                <select
                                    value={shiftFilter}
                                    onChange={(e) => setShiftFilter(e.target.value)}
                                    style={{ padding: '8px', border: '1px solid #CCC', borderRadius: '4px', fontSize: '13px' }}
                                >
                                    <option value="ALL">Todos os Turnos</option>
                                    <option value="07:30">Manhã (07:30)</option>
                                    <option value="14:30">Tarde (14:30)</option>
                                </select>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    style={{ padding: '8px', border: '1px solid #CCC', borderRadius: '4px', fontSize: '13px' }}
                                >
                                    <option value="ALL">Todos os Status</option>
                                    <option value="TRABALHAM">Trabalhando Hoje</option>
                                    <option value="FOLGAM">Folgando Hoje</option>
                                    <option value="AUSENTES">Ausentes</option>
                                </select>
                            </div>
                        </Card>
                    </div>
                </>
            )}

            {/* Tabela de Escala com dica de Scroll no Celular */}
            <Card style={{ padding: '0', overflowX: 'auto', border: '1px solid #E0E0E0', position: 'relative', WebkitOverflowScrolling: 'touch' }}>
                <div style={{ padding: '8px', background: '#FFF8E1', color: '#F57F17', fontSize: '11px', textAlign: 'center', borderBottom: '1px solid #FFE082', display: window.innerWidth <= 768 ? 'block' : 'none' }}>
                    ⟷ Deslize para o lado para ver todos os dias da escala
                </div>
                <div style={{ minWidth: '800px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                            <tr>
                                <th style={{
                                    padding: '12px', textAlign: 'left', borderBottom: '2px solid #EEE',
                                    background: '#F8F9FA', position: 'sticky', left: 0, zIndex: 10,
                                    borderRight: '2px solid #E0E0E0', minWidth: '180px', maxWidth: '250px'
                                }}>
                                    COLABORADOR (NOME / MATRÍCULA / TURNO)
                                </th>
                                {DIAS_IMAGEM.map((d, index) => {
                                    const isDom = d.sem === 'dom';
                                    const isSelected = selectedDayIndex === index;
                                    return (
                                        <th
                                            key={index}
                                            onClick={() => setSelectedDayIndex(index)}
                                            style={{
                                                padding: '8px 4px',
                                                borderBottom: '2px solid #EEE',
                                                background: isSelected ? '#E3F2FD' : (isDom ? '#FFE0D0' : '#F8F9FA'),
                                                textAlign: 'center',
                                                minWidth: '40px',
                                                cursor: 'pointer',
                                                borderRight: '1px solid #F5F5F5',
                                                transition: 'all 0.2s ease'
                                            }}
                                            title="Clique para ver o resumo deste dia"
                                        >
                                            <span style={{ fontWeight: isSelected ? '800' : '600', color: isSelected ? '#1565C0' : 'inherit' }}>{d.dia}</span>
                                            <br />
                                            <span style={{ fontSize: '9px', opacity: 0.7, textTransform: 'uppercase' }}>{d.sem}</span>
                                        </th>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredColabs?.length === 0 ? (
                                <tr>
                                    <td colSpan={DIAS_IMAGEM.length + 1} style={{ padding: '30px', textAlign: 'center', color: '#888' }}>
                                        Nenhum colaborador encontrado com os filtros atuais.
                                    </td>
                                </tr>
                            ) : (() => {
                                // Separar por turno para renderização agrupada
                                const turno1 = filteredColabs.filter(c => c.horario === '07:30');
                                const turno2 = filteredColabs.filter(c => c.horario === '14:30');

                                const renderRow = (colab, i, total) => {
                                    if (!colab) return null;
                                    const gridRow = dynamicGrid[colab.id] || [];
                                    const hasAlert = checkAlerts(colab.id);
                                    return (
                                        <tr key={colab.id || i} style={{ borderBottom: '1px solid #EEE', background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                                            <td style={{ padding: '8px 12px', borderRight: '2px solid #E0E0E0', background: i % 2 === 0 ? 'white' : '#FAFAFA', position: 'sticky', left: 0, zIndex: 5, whiteSpace: 'nowrap' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div onClick={() => setColabDetails(colab)} style={{ cursor: 'pointer' }}>
                                                        <div style={{ fontWeight: '700', color: '#0060B1', textDecoration: 'underline' }}>{colab.nome}</div>
                                                        <div style={{ fontSize: '10px', color: '#777', marginTop: '2px' }}>
                                                            {colab.matricula} • {colab.horario}
                                                        </div>
                                                    </div>
                                                    {hasAlert && (
                                                        <div title="Alerta: Mais de 6 dias consecutivos sem folga detectados!" style={{ color: '#E53935' }}>
                                                            <AlertTriangle size={16} />
                                                        </div>
                                                    )}
                                                    <div
                                                        title="Adicionar Observação / Justificativa"
                                                        style={{ color: '#0060B1', cursor: 'pointer', marginLeft: '5px' }}
                                                        onClick={() => { setObsModalColab(colab); setObsText(colab.observacao || ''); }}
                                                    >
                                                        <MessageSquare size={16} />
                                                    </div>
                                                </div>
                                            </td>
                                            {DIAS_IMAGEM?.map((d, index) => {
                                                const val = gridRow[index] || '';
                                                let displayVal = val === 'T' ? colab.horario : val;
                                                const { bg, color, size, label, border } = getCellStyles(displayVal);
                                                const isDom = d?.sem === 'dom';
                                                const isSelected = selectedDayIndex === index;
                                                let cellText = label;
                                                if (label === '-') cellText = '';
                                                return (
                                                    <td key={index}
                                                        style={{ padding: '4px', textAlign: 'center', borderRight: '1px solid #F5F5F5', background: isSelected ? 'rgba(33,150,243,0.05)' : (isDom ? 'rgba(255,69,0,0.03)' : 'transparent') }}
                                                        title={colab.horario === '14:30' ? 'Turno: 14:30 — 22:50' : 'Turno: 07:30 — 14:30'}
                                                    >
                                                        {cellText && (
                                                            <div style={{ width: '100%', minHeight: '26px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', background: bg, color: color, border: border || 'none', fontWeight: '700', fontSize: size, boxShadow: (val === 'F' || val === 'D') ? '0 1px 2px rgba(0,0,0,0.1)' : 'none' }}>
                                                                {cellText}
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                };

                                const renderTurnoHeader = (label, cor, bgCor) => (
                                    <tr key={label}>
                                        <td colSpan={DIAS_IMAGEM.length + 1} style={{ background: bgCor, borderLeft: `4px solid ${cor}`, padding: '6px 12px', fontWeight: '800', fontSize: '11px', color: cor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            {label}
                                        </td>
                                    </tr>
                                );

                                return (
                                    <>
                                        {turno1.length > 0 && (
                                            <>
                                                {renderTurnoHeader('1º Turno — 07:30 às 14:30', '#2E7D32', '#E8F5E9')}
                                                {turno1.map((colab, i) => renderRow(colab, i, turno1.length))}
                                            </>
                                        )}
                                        {turno2.length > 0 && (
                                            <>
                                                {renderTurnoHeader('2º Turno — 14:30 às 22:50', '#6A1B9A', '#F3E5F5')}
                                                {turno2.map((colab, i) => renderRow(colab, i, turno2.length))}
                                            </>
                                        )}
                                    </>
                                );
                            })()}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Modal: Detalhes do Colaborador (Acesso Imediato) */}
            <Modal isOpen={!!colabDetails} onClose={() => setColabDetails(null)} title="Dados do Colaborador">
                {colabDetails && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ padding: '15px', background: '#F8F9FA', borderRadius: '10px', border: '1px solid #E0E0E0' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div><p style={{ margin: 0, fontSize: '11px', color: '#888' }}>NOME</p><p style={{ margin: 0, fontWeight: '700' }}>{colabDetails.nome}</p></div>
                                <div><p style={{ margin: 0, fontSize: '11px', color: '#888' }}>MATRÍCULA</p><p style={{ margin: 0, fontWeight: '700' }}>{colabDetails.matricula}</p></div>
                                <div><p style={{ margin: 0, fontSize: '11px', color: '#888' }}>FUNÇÃO</p><p style={{ margin: 0, fontWeight: '700' }}>{colabDetails.funcao}</p></div>
                                <div><p style={{ margin: 0, fontSize: '11px', color: '#888' }}>TURNO</p><p style={{ margin: 0, fontWeight: '700' }}>{colabDetails.horario}</p></div>
                                <div><p style={{ margin: 0, fontSize: '11px', color: '#888' }}>FOLGA FIXA</p><p style={{ margin: 0, fontWeight: '700' }}>{['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][colabDetails.folgaFixa]}</p></div>
                                <div><p style={{ margin: 0, fontSize: '11px', color: '#888' }}>SITUAÇÃO</p><p style={{ margin: 0, fontWeight: '700', color: 'var(--status-success)' }}>ATIVO</p></div>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <MessageSquare size={16} /> Histórico de Interações
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {/* Pendentes */}
                                {justificativas.filter(j => j.nome === colabDetails.nome).map(j => (
                                    <div key={`p-${j.id}`} style={{ padding: '10px', background: '#FFF8E1', borderRadius: '8px', border: '1px solid #FFE082' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                            <span style={{ fontWeight: '700' }}>{j.motivo}</span>
                                            <span style={{ color: '#E65100', fontWeight: '700' }}>PENDENTE</span>
                                        </div>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#555' }}>{j.obs}</p>
                                    </div>
                                ))}
                                {/* Histórico Aprovado/Rejeitado */}
                                {historico.filter(h => h.nome === colabDetails.nome).map(h => (
                                    <div key={`h-${h.id}`} style={{ padding: '10px', background: h.status === 'aprovado' ? '#E8F5E9' : '#FFEBEE', borderRadius: '8px', border: h.status === 'aprovado' ? '1px solid #C8E6C9' : '1px solid #FFCDD2' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                            <span style={{ fontWeight: '700' }}>{h.motivo} (em {h.data})</span>
                                            <span style={{ color: h.status === 'aprovado' ? '#2E7D32' : '#C62828', fontWeight: '700' }}>{h.status.toUpperCase()}</span>
                                        </div>
                                        <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#555' }}>{h.obs}</p>
                                    </div>
                                ))}

                                {justificativas.filter(j => j.nome === colabDetails.nome).length === 0 &&
                                    historico.filter(h => h.nome === colabDetails.nome).length === 0 && (
                                        <p style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>Sem registros recentes de atestados ou trocas.</p>
                                    )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Button variant="primary" style={{ flex: 1 }} onClick={() => setColabDetails(null)}>Fechar Verificação</Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Legenda */}
            <Card style={{ padding: '15px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', background: '#F8F9FA' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', color: '#555' }}>
                    <Info size={16} /> LEGENDAS:
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px' }}>
                    <div style={{ width: '16px', height: '16px', background: 'var(--assai-orange)', borderRadius: '3px' }}></div>
                    F - FOLGA NORMAL
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px' }}>
                    <div style={{ width: '16px', height: '16px', background: '#2196F3', borderRadius: '3px' }}></div>
                    D - DESCANSO DOMINICAL
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px' }}>
                    <div style={{ width: '16px', height: '16px', background: '#E53935', borderRadius: '3px' }}></div>
                    A/J - AUSÊNCIA / JUSTIFICADA
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px' }}>
                    <div style={{ width: '16px', height: '16px', background: '#E8F5E9', border: '1px solid #C8E6C9', borderRadius: '3px' }}></div>
                    TURNO (HORÁRIOS REAL)
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '12px', color: '#E53935' }}>
                    <AlertTriangle size={16} />
                    ALERTA: {'>'}6 DIAS S/ FOLGA
                </div>
            </Card>

            {/* Modal de Justificativa / Observação */}
            <Modal isOpen={!!obsModalColab} onClose={() => setObsModalColab(null)} title={`Observações - ${obsModalColab?.nome}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ fontSize: '13px', color: '#555' }}>
                        Adicione observações sobre folgas trocadas, banco de horas ou justificativas de faltas (A/J).
                    </div>
                    <textarea
                        rows={4}
                        value={obsText}
                        onChange={(e) => setObsText(e.target.value)}
                        placeholder="Ex: Faltou e trouxe atestado dia 12..."
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CCC', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <Button variant="ghost" onClick={() => setObsModalColab(null)}>Cancelar</Button>
                        <Button onClick={() => {
                            // Simulando gravação
                            alert('Observação salva temporariamente para o mock.');
                            setObsModalColab(null);
                        }}>Salvar Gestão</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ScaleManager;
