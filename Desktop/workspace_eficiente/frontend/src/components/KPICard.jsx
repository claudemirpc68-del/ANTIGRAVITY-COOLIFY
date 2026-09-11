import React from 'react';

export default function KPICard({ title, value, icon: Icon, color = "#6366f1", subtitle, badge }) {
  return (
    <div className="kpi-card" style={{ '--accent-color': color }}>
      <div className="kpi-header">
        <span>{title}</span>
        {Icon && <Icon size={18} style={{ color }} />}
      </div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-footer">
        {badge && (
          <span style={{ 
            background: `${color}18`, 
            color: color, 
            padding: '2px 8px', 
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '0.72rem'
          }}>
            {badge}
          </span>
        )}
        <span>{subtitle}</span>
      </div>
    </div>
  );
}
