import React from 'react';
import { UploadCloud, Settings, Table, Sparkles, Trash2 } from 'lucide-react';

export default function Navbar({ onOpenUpload, onOpenSettings, onOpenPreview, onClearData, loading, hasData }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className="brand-icon">
          <Sparkles size={22} />
        </div>
        <div>
          <div className="brand-title">Decisões Inteligentes</div>
        </div>
        <span className="brand-badge">Estratégia & BI</span>
      </div>

      <div className="nav-actions">
        {hasData && (
          <button 
            className="btn btn-secondary" 
            onClick={onClearData}
            title="Limpar o dashboard e preparar a tela para novas planilhas"
            style={{ color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)' }}
          >
            <Trash2 size={15} />
            <span>Limpar Tela</span>
          </button>
        )}

        {hasData && (
          <button className="btn btn-secondary" onClick={onOpenPreview}>
            <Table size={15} />
            <span>Explorar Tabelas</span>
          </button>
        )}

        <button className="btn btn-primary" onClick={onOpenUpload}>
          <UploadCloud size={16} />
          <span>Upload Planilhas</span>
        </button>

        <button className="btn btn-secondary" onClick={onOpenSettings} title="Configurações de IA">
          <Settings size={16} />
        </button>
      </div>
    </nav>
  );
}
