import React, { useState } from 'react';
import { X, Table, Database } from 'lucide-react';

export default function DataPreviewModal({ isOpen, onClose, previewData }) {
  const [activeTab, setActiveTab] = useState("Vendas");

  if (!isOpen) return null;

  const tabs = Object.keys(previewData || {});
  const currentData = previewData?.[activeTab] || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Table size={20} color="#6366f1" />
            <span>Explorador de Dados Brutos (Amostra)</span>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Abas */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                border: activeTab === tab ? '1px solid var(--primary)' : '1px solid transparent',
                color: activeTab === tab ? '#fff' : 'var(--text-muted)',
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tabela de Amostra */}
        <div className="data-table-container" style={{ maxHeight: '380px' }}>
          {currentData.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  {Object.keys(currentData[0]).map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((val, cIdx) => (
                      <td key={cIdx}>{String(val)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Nenhum registro para exibir nesta tabela.
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
