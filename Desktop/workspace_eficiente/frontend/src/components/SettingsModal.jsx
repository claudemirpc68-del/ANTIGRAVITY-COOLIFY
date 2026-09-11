import React, { useState } from 'react';
import { X, Key, Check, Shield } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, settings, onSaveSettings }) {
  const [provider, setProvider] = useState(settings.provider || "auto");
  const [apiKey, setApiKey] = useState(settings.apiKey || "");
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings({ provider, apiKey });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={20} color="#6366f1" />
            <span>Configurações do Agente de IA</span>
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}>
              Motor de Resposta
            </label>
            <select 
              value={provider} 
              onChange={(e) => setProvider(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem 0.85rem',
                color: 'white',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem'
              }}
            >
              <option value="auto">Modo Analítico Determinístico (Local / Sem Custo de API)</option>
              <option value="gemini">Google Gemini (Gemini 1.5 Flash)</option>
              <option value="groq">Groq (Llama 3.3 70B Ultra Rápido)</option>
              <option value="openrouter">OpenRouter (Multi-Modelos)</option>
            </select>
          </div>

          {provider !== "auto" && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#cbd5e1' }}>
                Chave de API ({provider.toUpperCase()})
              </label>
              <input 
                type="password"
                placeholder="Insira sua chave de API..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem 0.85rem',
                  color: 'white',
                  outline: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: '#94a3b8'
          }}>
            <Shield size={16} color="#10b981" />
            <span>
              Sua chave fica armazenada apenas no seu navegador e nunca é salva em bancos externos.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            {saved ? <Check size={16} /> : "Salvar Configurações"}
          </button>
        </div>
      </div>
    </div>
  );
}
