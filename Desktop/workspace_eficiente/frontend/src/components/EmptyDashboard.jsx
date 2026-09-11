import React from 'react';
import { UploadCloud, FileSpreadsheet, FolderCheck, Sparkles, Database } from 'lucide-react';

export default function EmptyDashboard({ onOpenUpload }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      background: 'var(--bg-card)',
      backdropFilter: 'blur(20px)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-card)',
      textAlign: 'center',
      minHeight: '450px'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.2))',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#818cf8',
        marginBottom: '1.5rem',
        boxShadow: '0 0 25px rgba(99, 102, 241, 0.25)'
      }}>
        <FileSpreadsheet size={32} />
      </div>

      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '1.8rem',
        fontWeight: 700,
        marginBottom: '0.6rem',
        background: 'linear-gradient(to right, #ffffff, #cbd5e1)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Decisões Inteligentes
      </h2>
      <p style={{ color: '#818cf8', fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem' }}>
        Dashboard Limpo & Aguardando Planilhas
      </p>

      <p style={{
        color: 'var(--text-muted)',
        maxWidth: '540px',
        fontSize: '0.95rem',
        lineHeight: 1.6,
        marginBottom: '2rem'
      }}>
        Envie qualquer planilha de dados bruta (Vendas, Finanças, RH, Imóveis, etc.). 
        O sistema mapeará as variáveis automaticamente, gerando os KPIs, gráficos e o suporte analítico com IA.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button 
          className="btn btn-primary" 
          onClick={onOpenUpload}
          style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
        >
          <UploadCloud size={20} />
          <span>Carregar Planilhas (.xlsx, .csv)</span>
        </button>
      </div>
    </div>
  );
}
