import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, HelpCircle } from 'lucide-react';
import DynamicChartCard from './DynamicChartCard';

export default function ChatPanel({ messages, onSendMessage, loading, suggestions = [] }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const defaultSuggestions = [
    "Quais os principais insights desta planilha?",
    "Quais os maiores valores e destaques?",
    "Qual a distribuição das categorias?",
    "Qual a média geral dos dados?"
  ];

  const strategicSuggestion = "🎯 Plano Estratégico de Reversão de Gargalos";
  const chips = [
    strategicSuggestion,
    ...(suggestions && suggestions.length > 0 ? suggestions : defaultSuggestions)
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input);
    setInput("");
  };

  const handleChipClick = (suggestion) => {
    onSendMessage(suggestion);
  };

  const formatMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, i) => {
      let trimmed = line.trim();
      if (trimmed.startsWith('### ')) {
        return <h3 key={i} style={{ marginTop: '0.4rem', color: '#818cf8' }}>{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const itemContent = trimmed.substring(2);
        return (
          <li key={i} style={{ marginLeft: '1rem', marginBottom: '0.25rem' }}>
            {renderBoldText(itemContent)}
          </li>
        );
      }
      if (trimmed.match(/^\d+\.\s/)) {
        return (
          <div key={i} style={{ marginBottom: '0.4rem' }}>
            {renderBoldText(trimmed)}
          </div>
        );
      }
      if (!trimmed) return <div key={i} style={{ height: '0.4rem' }} />;
      return <p key={i} style={{ marginBottom: '0.35rem' }}>{renderBoldText(trimmed)}</p>;
    });
  };

  const renderBoldText = (str) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} style={{ color: '#fff', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Bot size={20} color="#818cf8" />
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Decisões Inteligentes • AI</span>
        </div>
        <div className="chat-status">
          <div className="status-dot"></div>
          <span>Pronto</span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message-bubble ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem', opacity: 0.7, fontSize: '0.75rem' }}>
              {msg.role === 'user' ? <User size={13} /> : <Sparkles size={13} color="#818cf8" />}
              <span>{msg.role === 'user' ? 'Você' : 'Decisões Inteligentes'}</span>
            </div>

            <div>{formatMarkdown(msg.content)}</div>

            {/* Renderizar Gráfico Interativo se a IA retornar */}
            {msg.chart && (
              <div style={{ marginTop: '0.75rem' }}>
                <DynamicChartCard 
                  title={msg.chart.title || "Visualização de Dados"}
                  items={msg.chart.data || msg.chart.items || []}
                  defaultType={
                    msg.chart.type === 'pie' || msg.chart.type === 'donut' 
                      ? 'donut' 
                      : msg.chart.type === 'line' 
                        ? 'line' 
                        : 'column'
                  }
                />
              </div>
            )}

            {/* Renderizar Tabela embutida se existir */}
            {msg.table && msg.table.length > 0 && (
              <div style={{ marginTop: '0.75rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.08)', textAlign: 'left' }}>
                      {Object.keys(msg.table[0]).slice(0, 4).map((k) => (
                        <th key={k} style={{ padding: '4px 8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {msg.table.slice(0, 5).map((row, rIdx) => (
                      <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        {Object.keys(row).slice(0, 4).map((k) => (
                          <td key={k} style={{ padding: '4px 8px' }}>
                            {typeof row[k] === 'number' ? row[k].toLocaleString('pt-BR') : String(row[k])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="message-bubble message-assistant" style={{ fontStyle: 'italic', opacity: 0.8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="status-dot spin"></div>
              <span>Processando dados da planilha e analisando variáveis...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-suggestions">
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: '#64748b', marginBottom: '0.2rem' }}>
          <HelpCircle size={12} />
          <span>Perguntas sugeridas para esta planilha:</span>
        </div>
        {chips.map((sug, i) => (
          <button key={i} className="suggestion-chip" onClick={() => handleChipClick(sug)}>
            {sug}
          </button>
        ))}
      </div>

      <form onSubmit={handleSend} className="chat-input-row">
        <input 
          type="text" 
          className="chat-input"
          placeholder="Faça uma pergunta sobre qualquer coluna desta planilha..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
