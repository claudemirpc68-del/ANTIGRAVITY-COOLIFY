import React from 'react';
import Card from './Card';

const MiniCalendar = ({ colabId, grid, year, month }) => {
    const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    // Calcular dias do mês
    const numDias = new Date(year, month, 0).getDate();
    const primeiroDiaSemana = new Date(year, month - 1, 1).getDay();
    
    const hoje = new Date();
    const diaAtual = hoje.getFullYear() === year && hoje.getMonth() + 1 === month ? hoje.getDate() : -1;

    // Gerar células
    const cells = [];
    // Espaços vazios no início
    for (let i = 0; i < primeiroDiaSemana; i++) {
        cells.push({ tipo: 'vazio', dia: null });
    }
    // Dias do mês
    for (let i = 1; i <= numDias; i++) {
        const val = grid && grid[i-1] ? grid[i-1] : '';
        cells.push({ tipo: val, dia: i });
    }

    const getDayStyle = (tipo, dia) => {
        const base = {
            width: '100%',
            aspectRatio: '1',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: '800',
            position: 'relative',
            cursor: 'default',
            transition: 'all 0.2s'
        };

        if (tipo === 'vazio') return { ...base, opacity: 0 };
        
        const hoje = new Date();
        const isHoje = dia === diaAtual;
        const border = isHoje ? '2px solid #000' : '1px solid rgba(0,0,0,0.05)';

        // Escala de Cores baseada na imagem enviada
        if (tipo === 'F' || tipo === 'D') {
            return { ...base, backgroundColor: '#4CAF50', color: 'white', border }; // Verde (FG/FD)
        }
        
        // Mapeamento de Turnos
        if (tipo === 'T' || (typeof tipo === 'string' && tipo.includes(':'))) {
            const time = typeof tipo === 'string' ? tipo : '';
            
            // T1: Manhã (06h - 08h) -> Laranja
            if (time.startsWith('06') || time.startsWith('07') || time.startsWith('08')) {
                return { ...base, backgroundColor: '#FF9800', color: 'white', border };
            }
            // T2: Tarde (14:30) -> Azul
            if (time.startsWith('14')) {
                return { ...base, backgroundColor: '#2196F3', color: 'white', border };
            }
            // T3: Noite (22:00) -> Roxo
            if (time.startsWith('22')) {
                return { ...base, backgroundColor: '#9C27B0', color: 'white', border };
            }

            // Padrão (T1)
            return { ...base, backgroundColor: '#FF9800', color: 'white', border };
        }

        return { ...base, backgroundColor: '#f5f5f5', color: '#999', border };
    };

    return (
        <Card style={{ padding: '15px', border: '1px solid #E0E0E0' }}>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>🗓️</span> {['','JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO'][month]} {year}
                </h4>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {DIAS_SEMANA.map(d => (
                    <div key={d} style={{ textAlign: 'center', fontSize: '10px', fontWeight: '800', color: 'var(--text-tertiary)', paddingBottom: '4px' }}>
                        {d}
                    </div>
                ))}
                
                {cells.map((c, i) => (
                    <div key={i} style={getDayStyle(c.tipo, c.dia)} title={c.dia ? `Dia ${c.dia}: ${c.tipo}` : ''}>
                        {c.dia}
                        {c.dia === diaAtual && (
                            <div style={{ position: 'absolute', top: '2px', right: '2px', width: '5px', height: '5px', background: 'white', borderRadius: '50%', boxShadow: '0 0 2px rgba(0,0,0,0.5)' }}></div>
                        )}
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: '600' }}>
                    <div style={{ width: '12px', height: '12px', background: '#FF9800', borderRadius: '3px' }}></div> 1º Turno (06h-08h)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: '600' }}>
                    <div style={{ width: '12px', height: '12px', background: '#2196F3', borderRadius: '3px' }}></div> 2º Turno (14h)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: '600' }}>
                    <div style={{ width: '12px', height: '12px', background: '#9C27B0', borderRadius: '3px' }}></div> 3º Turno (22h)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: '600' }}>
                    <div style={{ width: '12px', height: '12px', background: '#4CAF50', borderRadius: '3px' }}></div> Folga (DSR)
                </div>
            </div>
        </Card>
    );
};


export default MiniCalendar;
