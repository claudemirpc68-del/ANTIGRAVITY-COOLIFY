import React from 'react';

export default function BarChartVisual({ title, items = [], labelKey = "label", valueKey = "value", formatValue = (v) => v, color = "#6366f1", icon: Icon }) {
  const maxVal = Math.max(...items.map(i => i[valueKey] || 0), 1);

  return (
    <div className="chart-card">
      <div className="chart-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {Icon && <Icon size={18} style={{ color }} />}
          <span>{title}</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
          {items.length} categorias
        </span>
      </div>

      <div className="bar-list">
        {items.map((item, idx) => {
          const val = item[valueKey] || 0;
          const label = item[labelKey] || "Item";
          const pct = Math.round((val / maxVal) * 100);

          return (
            <div key={idx} className="bar-item">
              <div className="bar-label-row">
                <span style={{ fontWeight: 500, color: '#f1f5f9' }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#cbd5e1' }}>
                  {formatValue(val, item)}
                </span>
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill" 
                  style={{ 
                    width: `${pct}%`, 
                    background: `linear-gradient(90deg, ${color}, ${color}cc)` 
                  }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
