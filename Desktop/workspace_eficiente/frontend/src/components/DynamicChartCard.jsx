import React, { useState } from 'react';
import { BarChart3, LineChart, PieChart, AlignLeft } from 'lucide-react';

const PALETTE = [
  '#6366f1', '#10b981', '#f59e0b', '#06b6d4', 
  '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6'
];

export default function DynamicChartCard({ 
  title, 
  items = [], 
  color = "#6366f1", 
  defaultType = "column" 
}) {
  const [chartType, setChartType] = useState(defaultType);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!items || items.length === 0) return null;

  const maxVal = Math.max(...items.map(i => i.value || 0), 1);
  const totalVal = items.reduce((acc, i) => acc + (i.value || 0), 0);

  // 1. Renderizador de Colunas Verticais (Column Chart)
  const renderColumnChart = () => {
    const width = 380;
    const height = 190;
    const paddingBottom = 40;
    const paddingTop = 25;
    const plotHeight = height - paddingBottom - paddingTop;
    const colWidth = Math.min(32, (width - 40) / items.length - 8);
    const gap = (width - 40) / items.length;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
        <defs>
          <linearGradient id={`grad_col_${title}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Linhas de grade suaves */}
        <line x1="20" y1={paddingTop} x2={width - 20} y2={paddingTop} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
        <line x1="20" y1={paddingTop + plotHeight / 2} x2={width - 20} y2={paddingTop + plotHeight / 2} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
        <line x1="20" y1={height - paddingBottom} x2={width - 20} y2={height - paddingBottom} stroke="rgba(255,255,255,0.12)" />

        {items.map((item, idx) => {
          const barH = Math.max(4, (item.value / maxVal) * plotHeight);
          const x = 20 + idx * gap + (gap - colWidth) / 2;
          const y = height - paddingBottom - barH;
          const isHovered = hoveredIndex === idx;

          return (
            <g 
              key={idx} 
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <rect
                x={x}
                y={y}
                width={colWidth}
                height={barH}
                rx={4}
                fill={isHovered ? '#fff' : `url(#grad_col_${title})`}
                opacity={isHovered ? 1 : 0.9}
                filter={isHovered ? `drop-shadow(0 0 8px ${color})` : 'none'}
              />

              {/* Rótulo valor no topo se hover ou poucos itens */}
              {(isHovered || items.length <= 5) && (
                <text
                  x={x + colWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fill={isHovered ? '#fff' : '#cbd5e1'}
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="var(--font-mono)"
                >
                  {item.value >= 1000 ? `${(item.value / 1000).toFixed(1)}k` : item.value}
                </text>
              )}

              {/* Rótulo do Eixo X */}
              <text
                x={x + colWidth / 2}
                y={height - paddingBottom + 16}
                textAnchor="middle"
                fill={isHovered ? '#fff' : '#94a3b8'}
                fontSize="10"
                fontFamily="var(--font-body)"
              >
                {item.label.length > 8 ? `${item.label.slice(0, 7)}…` : item.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // 2. Renderizador de Linha / Área Suave (Line & Area Chart)
  const renderLineChart = () => {
    const width = 380;
    const height = 190;
    const paddingX = 30;
    const paddingY = 25;
    const plotW = width - 2 * paddingX;
    const plotH = height - 2 * paddingY - 15;

    const points = items.map((item, idx) => {
      const x = paddingX + (idx / Math.max(1, items.length - 1)) * plotW;
      const y = height - paddingY - 15 - ((item.value / maxVal) * plotH);
      return { x, y, item, idx };
    });

    // Curva Suave (Bezier)
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      pathD += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY - 15} L ${points[0].x} ${height - paddingY - 15} Z`;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
        <defs>
          <linearGradient id={`grad_line_${title}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <line x1={paddingX} y1={height - paddingY - 15} x2={width - paddingX} y2={height - paddingY - 15} stroke="rgba(255,255,255,0.12)" />

        {/* Preenchimento de Área */}
        <path d={areaD} fill={`url(#grad_line_${title})`} />

        {/* Linha Principal */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />

        {/* Pontos Interativos */}
        {points.map((p) => {
          const isHovered = hoveredIndex === p.idx;
          return (
            <g 
              key={p.idx}
              onMouseEnter={() => setHoveredIndex(p.idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 6 : 4}
                fill="#0f172a"
                stroke={isHovered ? '#fff' : color}
                strokeWidth={isHovered ? 3 : 2}
                filter={isHovered ? `drop-shadow(0 0 8px ${color})` : 'none'}
              />

              {(isHovered || items.length <= 6) && (
                <text
                  x={p.x}
                  y={p.y - 10}
                  textAnchor="middle"
                  fill={isHovered ? '#fff' : '#cbd5e1'}
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="var(--font-mono)"
                >
                  {p.item.value >= 1000 ? `${(p.item.value / 1000).toFixed(1)}k` : p.item.value}
                </text>
              )}

              <text
                x={p.x}
                y={height - paddingY + 2}
                textAnchor="middle"
                fill={isHovered ? '#fff' : '#94a3b8'}
                fontSize="9"
                fontFamily="var(--font-body)"
              >
                {p.item.label.length > 7 ? `${p.item.label.slice(0, 6)}…` : p.item.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // 3. Renderizador de Rosca / Pizza (Donut Chart com Legenda)
  const renderDonutChart = () => {
    const size = 180;
    const center = size / 2;
    const radius = 65;
    const strokeWidth = 24;

    let accumulatedAngle = 0;
    const circumference = 2 * Math.PI * radius;

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', alignItems: 'center', gap: '1rem' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '160px', margin: '0 auto' }}>
          <svg viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
            {items.map((item, idx) => {
              const fraction = totalVal > 0 ? (item.value / totalVal) : 0;
              const strokeDasharray = `${fraction * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedAngle * circumference;
              accumulatedAngle += fraction;
              const sliceColor = PALETTE[idx % PALETTE.length];
              const isHovered = hoveredIndex === idx;

              return (
                <circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={sliceColor}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ 
                    cursor: 'pointer', 
                    transition: 'all 0.2s', 
                    filter: isHovered ? `drop-shadow(0 0 8px ${sliceColor})` : 'none' 
                  }}
                />
              );
            })}
          </svg>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {items.length} itens
            </span>
          </div>
        </div>

        {/* Legenda Lateral com Percentual */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '170px', overflowY: 'auto' }}>
          {items.map((item, idx) => {
            const pct = totalVal > 0 ? ((item.value / totalVal) * 100).toFixed(1) : 0;
            const sliceColor = PALETTE[idx % PALETTE.length];
            const isHovered = hoveredIndex === idx;

            return (
              <div 
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.4rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: isHovered ? 'rgba(255,255,255,0.06)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '0.78rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: sliceColor, flexShrink: 0 }} />
                  <span style={{ color: isHovered ? '#fff' : '#cbd5e1', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {item.label}
                  </span>
                </div>
                <span style={{ fontWeight: 600, color: sliceColor, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 4. Renderizador de Ranking Horizontal (Horizontal Bar)
  const renderRankingBar = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {items.map((item, idx) => {
          const pct = Math.round((item.value / maxVal) * 100);
          const isHovered = hoveredIndex === idx;

          return (
            <div 
              key={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: isHovered ? '#fff' : '#e2e8f0', fontWeight: isHovered ? 600 : 500 }}>
                  {item.label}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#cbd5e1', fontWeight: 500 }}>
                  {item.formatted || item.value.toLocaleString('pt-BR')}
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: isHovered ? '#fff' : `linear-gradient(90deg, ${color}, ${color}bb)`,
                    borderRadius: '4px',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="chart-card">
      <div className="chart-title">
        <span style={{ fontSize: '0.98rem' }}>{title}</span>

        {/* Seletor de Tipo de Gráfico */}
        <div style={{ 
          display: 'flex', 
          background: 'rgba(255,255,255,0.05)', 
          padding: '2px', 
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button 
            onClick={() => setChartType('column')}
            title="Gráfico de Colunas"
            style={{
              background: chartType === 'column' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
              color: chartType === 'column' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <BarChart3 size={14} />
          </button>

          <button 
            onClick={() => setChartType('line')}
            title="Gráfico de Linha / Tendência"
            style={{
              background: chartType === 'line' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
              color: chartType === 'line' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <LineChart size={14} />
          </button>

          <button 
            onClick={() => setChartType('donut')}
            title="Gráfico de Rosca / Composição"
            style={{
              background: chartType === 'donut' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
              color: chartType === 'donut' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <PieChart size={14} />
          </button>

          <button 
            onClick={() => setChartType('bar')}
            title="Ranking de Barras Horizontais"
            style={{
              background: chartType === 'bar' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
              color: chartType === 'bar' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <AlignLeft size={14} />
          </button>
        </div>
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        {chartType === 'column' && renderColumnChart()}
        {chartType === 'line' && renderLineChart()}
        {chartType === 'donut' && renderDonutChart()}
        {chartType === 'bar' && renderRankingBar()}
      </div>
    </div>
  );
}
