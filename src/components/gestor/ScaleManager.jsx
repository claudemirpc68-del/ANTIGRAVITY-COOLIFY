import React, { useState, useMemo } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { MOCK_COLABORADORES, DIAS_IMAGEM, IMAGE_GRID, MOCK_GESTOR } from '../../logic/mockData';
import { Download, Printer, Search, AlertTriangle, CheckCircle, Info, Calendar, MessageSquare, X } from 'lucide-react';

// Constantes da loja
const LOJA_INFO = {
    setor: 'MERCEARIA',
    loja: 'AMERICANA',
    cr: '741',
    unidade: '109',
    gestor: MOCK_GESTOR?.nome || 'CLAUDEMIR'
};

const ScaleManager = ({ colaboradorId, onExport }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [shiftFilter, setShiftFilter] = useState('ALL');

    // Selecionar dia para resumo de "Trabalhando" e "Folgas"
    // Padrão: dia 16 (índice 0) ou algo dinâmico. Vamos usar o índice 0 como hoje fixo pro mock.
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);

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
                const gridRow = IMAGE_GRID[c.id] || [];
                const stateToday = gridRow[selectedDayIndex] || '';

                if (statusFilter === 'TRABALHAM') {
                    return stateToday === '' || stateToday.includes(':');
                }
                if (statusFilter === 'FOLGAM') {
                    return stateToday === 'F' || stateToday === 'D';
                }
                if (statusFilter === 'AUSENTES') {
                    return stateToday === 'A' || stateToday === 'J';
                }
                return true;
            });
        }

        return list;
    }, [colaboradorId, searchTerm, shiftFilter, statusFilter, selectedDayIndex]);

    // Calcular Totais do Dia
    const totaisDia = useMemo(() => {
        let trab = 0;
        let folg = 0;
        MOCK_COLABORADORES.forEach(c => {
            const val = (IMAGE_GRID[c.id] || [])[selectedDayIndex] || '';
            if (val === 'F' || val === 'D') folg++;
            else trab++;
        });
        return { trabalhando: trab, folgando: folg };
    }, [selectedDayIndex]);

    // Função para verificar alertas por colaborador (ex: > 6 dias seguidos sem folga na grade)
    const checkAlerts = (colabId) => {
        const row = IMAGE_GRID[colabId] || [];
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
                        <Calendar size={16} /> RESUMO DO DIA: {DIAS_IMAGEM[selectedDayIndex]?.dia}/{selectedDayIndex < 14 ? '02' : '03'}
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

            {/* Tabela de Escala */}
            <Card style={{ padding: '0', overflowX: 'auto', border: '1px solid #E0E0E0', position: 'relative' }}>
                <div style={{ minWidth: '800px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                            <tr>
                                <th style={{
                                    padding: '12px', textAlign: 'left', borderBottom: '2px solid #EEE',
                                    background: '#F8F9FA', position: 'sticky', left: 0, zIndex: 10,
                                    borderRight: '2px solid #E0E0E0', width: '250px'
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
                            ) : filteredColabs?.map((colab, i) => {
                                if (!colab) return null;
                                const gridRow = IMAGE_GRID[colab.id] || [];
                                const hasAlert = checkAlerts(colab.id);

                                return (
                                    <tr key={colab.id || i} style={{ borderBottom: '1px solid #EEE', background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                                        <td style={{
                                            padding: '8px 12px', borderRight: '2px solid #E0E0E0',
                                            background: i % 2 === 0 ? 'white' : '#FAFAFA',
                                            position: 'sticky', left: 0, zIndex: 5, whiteSpace: 'nowrap'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <div style={{ fontWeight: '700', color: '#333' }}>{colab.nome}</div>
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
                                            let displayVal = val;

                                            // Se for trabalhar em horário padrão e o valor for vazio ou não preenchido com turno
                                            if (!val && d.sem !== 'dom') {
                                                // mock logic assumir q trabalharia no turno padrao se nao tem F nem D
                                                displayVal = colab.horario;
                                            } else if (!val && d.sem === 'dom') {
                                                // domingos vazios no mock = trabalho (pra constar na contagem se nao tiver F/D)
                                                displayVal = colab.horario;
                                            }

                                            const { bg, color, size, label, border } = getCellStyles(displayVal);
                                            const isDom = d?.sem === 'dom';
                                            const isSelected = selectedDayIndex === index;

                                            // Formatar horario real se for turno
                                            let cellText = label;
                                            if (label && label.includes(':')) {
                                                // Ex transformar "10:30" em "10:30-22:50" (simplificado pra caber, talvez so 10:30)
                                                // Adicionando um subtexto no tooltip
                                            } else if (label === '-') {
                                                cellText = ''; // empty
                                            }

                                            return (
                                                <td key={index}
                                                    style={{
                                                        padding: '4px',
                                                        textAlign: 'center',
                                                        borderRight: '1px solid #F5F5F5',
                                                        background: isSelected ? 'rgba(33, 150, 243, 0.05)' : (isDom ? 'rgba(255, 69, 0, 0.03)' : 'transparent'),
                                                    }}
                                                    title={label.includes(':') ? `Turno: ${label} - ${label === '14:30' ? '22:50' : '15:50'}` : ''}
                                                >
                                                    {cellText && (
                                                        <div style={{
                                                            width: '100%',
                                                            minHeight: '26px',
                                                            margin: '0 auto',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            borderRadius: '4px',
                                                            background: bg,
                                                            color: color,
                                                            border: border || 'none',
                                                            fontWeight: '700',
                                                            fontSize: size,
                                                            boxShadow: (val === 'F' || val === 'D') ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                                                        }}>
                                                            {cellText}
                                                        </div>
                                                    )}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

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
