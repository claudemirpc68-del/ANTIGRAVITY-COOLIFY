import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { generateScale } from '../../logic/scaleEngine';
import { MOCK_COLABORADORES } from '../../logic/mockData';
import { SCALE_TYPES } from '../../logic/constants';
import { AlertTriangle, Download, Zap } from 'lucide-react';

const ScaleManager = () => {
    const [mes, setMes] = useState(3); // Março
    const [ano, setAno] = useState(2026);
    const [escala, setEscala] = useState([]);

    const handleGenerate = () => {
        const novaEscala = generateScale(MOCK_COLABORADORES, ano, mes);
        setEscala(novaEscala);
    };

    const getTipoColor = (tipo) => {
        switch (tipo) {
            case SCALE_TYPES.FOLGA: return 'var(--assai-orange)';
            case SCALE_TYPES.FERIADO: return 'var(--assai-yellow)';
            case SCALE_TYPES.BANCO_HORAS: return 'var(--assai-red)';
            default: return 'transparent';
        }
    };

    const diasNoMes = new Date(ano, mes, 0).getDate();
    const diasArray = Array.from({ length: diasNoMes }, (_, i) => i + 1);

    return (
        <Card style={{ overflowX: 'auto', padding: '0' }}>
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #EEE' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Grade de Escala - Mercearia</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="outline" size="sm" onClick={handleGenerate}>
                        <Zap size={16} /> Sugerir Escala
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Download size={16} /> Exportar PDF
                    </Button>
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                    <tr style={{ background: '#F8F9FA' }}>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #EEE', sticky: 'left', background: '#F8F9FA', zIndex: 1 }}>COLABORADOR</th>
                        {diasArray.map(dia => {
                            const data = new Date(ano, mes - 1, dia);
                            const isDom = data.getDay() === 0;
                            return (
                                <th key={dia} style={{ padding: '8px', borderBottom: '2px solid #EEE', background: isDom ? '#FFE0D0' : '#F8F9FA' }}>
                                    {dia}<br /><span style={{ fontSize: '9px', opacity: 0.6 }}>{data.toLocaleDateString('pt-BR', { weekday: 'short' }).charAt(0).toUpperCase()}</span>
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {MOCK_COLABORADORES.map(colab => (
                        <tr key={colab.id} style={{ borderBottom: '1px solid #EEE' }}>
                            <td style={{ padding: '12px', fontWeight: '600', borderRight: '1px solid #EEE', sticky: 'left', background: 'white' }}>
                                {colab.nome}
                            </td>
                            {diasArray.map(dia => {
                                const entry = escala.find(e => e.colaborador_id === colab.id && new Date(e.data).getDate() === dia);
                                return (
                                    <td key={dia} style={{ padding: '4px', textAlign: 'center', borderRight: '1px solid #F5F5F5' }}>
                                        <div style={{
                                            width: '24px',
                                            height: '24px',
                                            margin: '0 auto',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '4px',
                                            background: entry ? getTipoColor(entry.tipo) : '#F0F0F0',
                                            color: entry?.tipo === SCALE_TYPES.TRABALHO ? 'black' : 'white',
                                            fontWeight: '700',
                                            fontSize: '10px'
                                        }}>
                                            {entry ? entry.tipo : '-'}
                                        </div>
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            {escala.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    <AlertTriangle size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                    <p>Nenhuma escala gerada para este período.</p>
                    <Button onClick={handleGenerate} variant="ghost" style={{ marginTop: '10px' }}>Gerar Rascunho Inicial</Button>
                </div>
            )}
        </Card>
    );
};

export default ScaleManager;
