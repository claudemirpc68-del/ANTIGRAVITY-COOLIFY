import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { MOCK_COLABORADORES, DIAS_IMAGEM, IMAGE_GRID } from '../../logic/mockData';
import { Download, Printer } from 'lucide-react';

const ScaleManager = ({ colaboradorId, onExport }) => {

    // Se colaboradorId (usuario específico) não vier, ou vier vazio, é o Gestor vendo a tela cheia.
    const displayColabs = colaboradorId
        ? MOCK_COLABORADORES.filter(c => c.id === colaboradorId)
        : MOCK_COLABORADORES;

    const getCellStyles = (val) => {
        if (val === 'F') return { bg: 'var(--assai-orange)', color: 'white', size: '10px' };
        if (val === 'D') return { bg: '#2196F3', color: 'white', size: '10px' };
        if (val === '10:30') return { bg: '#1565C0', color: 'white', size: '8px' };
        if (val === '22:00') return { bg: '#4527A0', color: 'white', size: '8px' };
        return { bg: 'transparent', color: 'var(--text-tertiary)', size: '10px' };
    };

    return (
        <Card style={{ overflowX: 'auto', padding: '0' }}>
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EEE' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>ESCALA DE TRABALHO - 16/02/2026 a 15/03/2026</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="ghost" size="sm" onClick={() => window.print()}>
                        <Printer size={16} /> Imprimir
                    </Button>
                    <Button variant="outline" size="sm" onClick={onExport}>
                        <Download size={16} /> Exportar PDF
                    </Button>
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                    <tr style={{ background: '#F8F9FA' }}>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #EEE', sticky: 'left', background: '#F8F9FA', zIndex: 1 }}>COLABORADOR</th>
                        {DIAS_IMAGEM.map((d, index) => {
                            const isDom = d.sem === 'dom';
                            return (
                                <th key={index} style={{ padding: '8px', borderBottom: '2px solid #EEE', background: isDom ? '#FFE0D0' : '#F8F9FA', textAlign: 'center', minWidth: '35px' }}>
                                    {d.dia}<br /><span style={{ fontSize: '9px', opacity: 0.6, textTransform: 'uppercase' }}>{d.sem.charAt(0)}</span>
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {displayColabs?.map((colab, i) => {
                        if (!colab) return null;
                        const gridRow = IMAGE_GRID[colab.id] || [];
                        return (
                            <tr key={colab.id || i} style={{ borderBottom: '1px solid #EEE', background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                                <td style={{ padding: '12px', fontWeight: '600', borderRight: '1px solid #EEE', sticky: 'left', background: i % 2 === 0 ? 'white' : '#FAFAFA', whiteSpace: 'nowrap' }}>
                                    {colab.nome}
                                </td>
                                {DIAS_IMAGEM?.map((d, index) => {
                                    const val = gridRow[index] || '';
                                    const { bg, color, size } = getCellStyles(val);
                                    const isDom = d?.sem === 'dom';

                                    return (
                                        <td key={index} style={{ padding: '4px', textAlign: 'center', borderRight: '1px solid #F5F5F5', background: isDom ? 'rgba(255, 69, 0, 0.03)' : 'transparent' }}>
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
                                                fontWeight: val ? '700' : '400',
                                                fontSize: size
                                            }}>
                                                {val || '-'}
                                            </div>
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </Card>
    );
};

export default ScaleManager;
