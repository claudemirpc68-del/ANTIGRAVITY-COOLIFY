import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import Modal from './Modal';
import { MessageSquare, Share2, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { DIAS_IMAGEM } from '../../logic/mockData';

const CommunicationCenter = ({ user }) => {
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null); // { success, message }

  // Estados do Modal de Preview
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewMessage, setPreviewMessage] = useState('');
  const [pendingRecipient, setPendingRecipient] = useState(null); // Para quem a mensagem vai

  const colaboradores = user.role === 'gestor' ? (window.MOCK_COLABORADORES || []) : [];
  const gestor = window.MOCK_GESTOR || { nome: 'EDERSON CUBAS', telefone: '5511974154868' };

  const generateScaleSummary = (colab) => {
    const dynamicScale = window.dynamicScale || [];
    const grade = {};
    dynamicScale.forEach(entry => {
      if (entry.colaborador_id === colab.id) {
        if (!grade[colab.id]) grade[colab.id] = [];
        grade[colab.id].push(entry.tipo);
      }
    });
    const colabGrade = grade[colab.id] || [];
    const folgas = [];
    const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    const mesNome = MESES[new Date().getMonth()];

    DIAS_IMAGEM.forEach((d, idx) => {
      if (colabGrade[idx] === 'F' || colabGrade[idx] === 'D') folgas.push(d.dia);
    });

    return `🗓️ *SUA ESCALA - ${mesNome.toUpperCase()}*\n\nOlá ${colab.nome}, segue o resumo das suas folgas para este mês:\n\n*Folgas:* ${folgas.length ? folgas.join(', ') : 'Nenhuma folga registrada'}\n*Turno:* ${colab.horario}\n\n_Favor conferir no Painel Zen Assaí._`;
  };

  const handleAction = (type) => {
    if (user.role === 'gestor') {
      const colab = colaboradores.find(c => c.id === selectedRecipient);
      if (!colab) { alert('Selecione um colaborador primeiro.'); return; }
      const msg = type === 'escala'
        ? generateScaleSummary(colab)
        : `Olá ${colab.nome}, aqui é o gestor ${user.nome} do Assaí Suzano. Preciso falar sobre sua escala.`;
        
      setPendingRecipient({ telefone: colab.telefone, nome: colab.nome });
      setPreviewMessage(msg);
      setPreviewModalOpen(true);
    } else {
      const msg = `Olá ${gestor.nome}, aqui é ${user.nome}. Gostaria de tratar um assunto sobre minha escala.`;
      setPendingRecipient({ telefone: gestor.telefone, nome: gestor.nome });
      setPreviewMessage(msg);
      setPreviewModalOpen(true);
    }
  };

  const confirmSendWhatsApp = async () => {
    if (!pendingRecipient) return;
    
    setPreviewModalOpen(false);
    setSending(true);
    setResult(null);
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: pendingRecipient.telefone, message: previewMessage })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setResult({ success: true, message: `✅ Mensagem enviada com sucesso! (SID: ${data.sid})` });
      } else {
        setResult({ success: false, message: `❌ Erro: ${data.error || 'Falha ao enviar.'}` });
      }
    } catch (err) {
      setResult({ success: false, message: `❌ Erro de conexão: ${err.message}` });
    } finally {
      setSending(false);
      setPendingRecipient(null);
    }
  };

  return (
    <div className="animate-fade-in" style={{ marginTop: '20px' }}>
      <Card title="WhatsApp Assaí — Central de Contatos">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px' }}>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            {user.role === 'gestor'
              ? 'Selecione um colaborador e edite a mensagem antes de enviá-la pelo sistema.'
              : 'Edite e envie uma mensagem ao seu gestor via WhatsApp.'}
          </p>

          {user.role === 'gestor' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <select
                value={selectedRecipient}
                onChange={(e) => { setSelectedRecipient(e.target.value); setResult(null); }}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: 'white' }}
              >
                <option value="">Selecione o colaborador...</option>
                {colaboradores.map(c => (
                  <option key={c.id} value={c.id}>{c.nome} — {c.horario}</option>
                ))}
              </select>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Button
                  onClick={() => handleAction('general')}
                  disabled={sending || !selectedRecipient}
                  style={{ padding: '15px', background: sending ? '#ccc' : '#25D366', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                >
                  {sending ? <Loader size={18} className="animate-spin" /> : <MessageSquare size={20} />}
                  Iniciar Conversa
                </Button>
                <Button
                  onClick={() => handleAction('escala')}
                  disabled={sending || !selectedRecipient}
                  style={{ padding: '15px', background: sending ? '#ccc' : '#00B894', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                >
                  {sending ? <Loader size={18} /> : <Share2 size={20} />}
                  Revisar Escala
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '20px', background: 'rgba(37,211,102,0.05)', borderRadius: '12px', border: '1px solid rgba(37,211,102,0.2)', textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#128C7E' }}>Gestor: {gestor.nome}</h4>
              <p style={{ margin: '0 0 15px', fontSize: '13px', color: '#666' }}>A mensagem será enviada diretamente via API Twilio</p>
              <Button
                onClick={() => handleAction('general')}
                disabled={sending}
                style={{ width: '100%', padding: '15px', background: sending ? '#ccc' : '#25D366', color: 'white', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
              >
                {sending ? <Loader size={20} /> : <MessageSquare size={24} />}
                {sending ? 'Enviando...' : 'Falar com o Gestor'}
              </Button>
            </div>
          )}

          {/* Feedback de envio */}
          {result && (
            <div style={{
              padding: '14px', borderRadius: '8px',
              background: result.success ? '#d4edda' : '#f8d7da',
              border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
              display: 'flex', alignItems: 'center', gap: '10px'
            }}>
              {result.success
                ? <CheckCircle size={18} color="#155724" />
                : <AlertCircle size={18} color="#721c24" />}
              <span style={{ fontSize: '13px', color: result.success ? '#155724' : '#721c24' }}>
                {result.message}
              </span>
            </div>
          )}

          <div style={{ padding: '12px', borderRadius: '8px', background: '#f8f9fa', fontSize: '12px', color: '#666' }}>
            <strong>🤖 Powered by Twilio API:</strong> As mensagens são enviadas diretamente pelo servidor, sem precisar abrir o WhatsApp.
          </div>
        </div>
      </Card>

      {/* Modal de Confirmação e Edição */}
      <Modal 
        isOpen={previewModalOpen} 
        onClose={() => setPreviewModalOpen(false)} 
        title={`Revisar e Enviar para ${pendingRecipient?.nome || ''}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Edite a mensagem abaixo como desejar antes de enviá-la através do Twilio API:
            </p>
            
            <textarea 
                value={previewMessage} 
                onChange={(e) => setPreviewMessage(e.target.value)}
                placeholder="Escreva sua mensagem aqui..."
                style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: '10px', 
                    border: '1px solid #ddd', 
                    fontSize: '14px', 
                    minHeight: '150px', 
                    resize: 'none',
                    fontFamily: 'inherit',
                    lineHeight: '1.5'
                }}
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <Button variant="outline" style={{ flex: 1 }} onClick={() => setPreviewModalOpen(false)}>
                    Cancelar
                </Button>
                <Button 
                    variant="primary" 
                    style={{ flex: 1, backgroundColor: '#25D366', borderColor: '#25D366' }} 
                    onClick={confirmSendWhatsApp}
                >
                    <MessageSquare size={18} style={{ marginRight: '8px' }} />
                    Confirmar Envio
                </Button>
            </div>
            
            <p style={{ fontSize: '11px', color: '#777', textAlign: 'center', marginTop: '5px' }}>
                O envio será feito automaticamente pelo nosso servidor. Certifique-se do número.
            </p>
        </div>
      </Modal>

    </div>
  );
};

export default CommunicationCenter;
