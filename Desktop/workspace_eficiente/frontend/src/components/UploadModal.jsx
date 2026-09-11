import React, { useState } from 'react';
import { X, UploadCloud, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';

export default function UploadModal({ isOpen, onClose, onUploadFiles, loading }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return;
    try {
      await onUploadFiles(selectedFiles);
      setMessage({ type: 'success', text: `${selectedFiles.length} planilha(s) carregada(s) com sucesso!` });
      setTimeout(() => {
        onClose();
        setMessage(null);
        setSelectedFiles([]);
      }, 1200);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Erro ao enviar planilhas.' });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UploadCloud size={22} color="#6366f1" />
            <span>Carregar Planilhas de Dados</span>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Área de Drag and Drop */}
        <div 
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.15)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            background: dragActive ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255, 255, 255, 0.02)',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
          onClick={() => document.getElementById('file-input-field').click()}
        >
          <input 
            type="file" 
            id="file-input-field" 
            multiple 
            accept=".xlsx, .xls, .csv" 
            style={{ display: 'none' }} 
            onChange={handleFileInput} 
          />
          <FileSpreadsheet size={36} color="#64748b" style={{ margin: '0 auto 0.75rem auto' }} />
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
            Arraste suas planilhas Excel (.xlsx) ou CSV aqui
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            ou clique para selecionar arquivos do seu computador
          </div>
        </div>

        {/* Lista de selecionados */}
        {selectedFiles.length > 0 && (
          <div style={{ fontSize: '0.82rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '0.4rem' }}>
              {selectedFiles.length} arquivo(s) selecionado(s):
            </div>
            <ul style={{ paddingLeft: '1.2rem', color: '#94a3b8' }}>
              {selectedFiles.map((f, i) => (
                <li key={i} style={{ color: f.size === 0 ? '#f43f5e' : '#94a3b8' }}>
                  {f.name} ({(f.size / 1024).toFixed(1)} KB)
                  {f.size === 0 && (
                    <span style={{ color: '#f87171', marginLeft: '6px', fontWeight: 600 }}>
                      ⚠️ Arquivo de 0 KB! Se estiver aberto no Excel, salve e feche o Excel primeiro.
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mensagem de Feedback */}
        {message && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            color: message.type === 'success' ? '#10b981' : '#f43f5e'
          }}>
            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{message.text}</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit} 
            disabled={loading || selectedFiles.length === 0}
          >
            {loading ? "Processando..." : "Processar Arquivos"}
          </button>
        </div>
      </div>
    </div>
  );
}
