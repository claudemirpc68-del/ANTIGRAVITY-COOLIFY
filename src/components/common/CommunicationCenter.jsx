import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { MessageSquare, Share2, ExternalLink } from 'lucide-react';
import WhatsAppModal from './WhatsAppModal';
import { DIAS_IMAGEM } from '../../logic/mockData';

const CommunicationCenter = ({ user }) => {
  // WhatsApp State
  const [waModalOpen, setWaModalOpen] = useState(false);
  const [waRecipient, setWaRecipient] = useState(null);
  const [waTemplate, setWaTemplate] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');

  const colaboradores = user.role === 'gestor' ? (window.MOCK_COLABORADORES || []) : [];
  const gestor = window.MOCK_GESTOR || { nome: 'Gestor', telefone: '5511974154868' };

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
    const currentMonth = new Date().getMonth() + 1;
    const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const mesNome = MESES[currentMonth - 1];

    DIAS_IMAGEM.forEach((d, idx) => {
        if (colabGrade[idx] === 'F' || colabGrade[idx] === 'D') {
            folgas.push(d.dia);
        }
    });

    return `🗓️ *SUA ESCALA - ${mesNome.toUpperCase()}*\n\nOlá ${colab.nome}, segue o resumo das suas folgas para este mês:\n\n*Folgas:* ${folgas.join(', ')}\n*Turno:* ${colab.horario}\n\n_Favor conferir no Painel Zen._`;
  };

  const handleWhatsAppAction = (type) => {
    let recipient = null;
    let template = '';

    if (user.role === 'gestor') {
        recipient = colaboradores.find(c => c.id === selectedRecipient);
        if (!recipient) {
            alert('Selecione um colaborador primeiro.');
            return;
        }
        
        if (type === 'escala') {
            template = generateScaleSummary(recipient);
        } else {
            template = `Olá ${recipient.nome}, aqui é o gestor ${user.nome} do Assaí Suzano. Gostaria de falar sobre sua escala.`;
        }
    } else {
        recipient = gestor;
        template = `Olá ${gestor.nome}, aqui é o colaborador ${user.nome}. Gostaria de tratar de um assunto sobre minha escala.`;
    }

    setWaRecipient(recipient);
    setWaTemplate(template);
    setWaModalOpen(true);
  };

  return (
    <div className="animate-fade-in" style={{ marginTop: '20px' }}>
      <WhatsAppModal 
        isOpen={waModalOpen} 
        onClose={() => setWaModalOpen(false)} 
        recipient={waRecipient} 
        templateMessage={waTemplate} 
      />

      <Card title="WhatsApp Assaí — Central de Contatos">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                {user.role === 'gestor' 
                    ? "Selecione um colaborador abaixo para iniciar um contato direto ou enviar o resumo da escala via WhatsApp."
                    : "Utilize o botão abaixo para entrar em contato diretamente com o gestor via WhatsApp."}
            </p>

            {user.role === 'gestor' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <select 
                            value={selectedRecipient} 
                            onChange={(e) => setSelectedRecipient(e.target.value)}
                            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: 'white' }}
                        >
                            <option value="">Selecione o colaborador...</option>
                            {colaboradores.map(c => (
                            <option key={c.id} value={c.id}>{c.nome} ({c.funcao})</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <Button 
                            onClick={() => handleWhatsAppAction('general')}
                            style={{ padding: '15px', background: '#25D366', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        >
                            <MessageSquare size={20} /> Iniciar Conversa
                        </Button>
                        <Button 
                            onClick={() => handleWhatsAppAction('escala')}
                            style={{ padding: '15px', background: '#00B894', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        >
                            <Share2 size={20} /> Enviar Escala
                        </Button>
                    </div>
                </div>
            ) : (
                <div style={{ padding: '20px', background: 'rgba(37,211,102,0.05)', borderRadius: '12px', border: '1px solid rgba(37,211,102,0.2)', textAlign: 'center' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <h4 style={{ margin: '0 0 5px 0', color: '#128C7E' }}>Gestor: {gestor.nome}</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Clique no botão abaixo para abrir o WhatsApp</p>
                    </div>
                    <Button 
                        onClick={() => handleWhatsAppAction('general')}
                        style={{ width: '100%', padding: '15px', background: '#25D366', color: 'white', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                    >
                        <MessageSquare size={24} /> Falar com o Gestor
                        <ExternalLink size={16} />
                    </Button>
                </div>
            )}

            <div style={{ marginTop: '10px', padding: '12px', borderRadius: '8px', background: '#f8f9fa', fontSize: '12px', color: '#666' }}>
                <strong>⚠️ Nota:</strong> Todas as comunicações externas são realizadas via WhatsApp para garantir a agilidade e o registro fora do ambiente do painel.
            </div>
        </div>
      </Card>
    </div>
  );
};

export default CommunicationCenter;
