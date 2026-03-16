import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import { MessageSquare } from 'lucide-react';

const WhatsAppModal = ({ isOpen, onClose, recipient, templateMessage = '' }) => {
    const [message, setMessage] = useState(templateMessage);

    useEffect(() => {
        setMessage(templateMessage);
    }, [templateMessage]);

    const handleSend = () => {
        if (!recipient?.telefone) {
            alert('Telefone não cadastrado.');
            return;
        }
        const encodedMsg = encodeURIComponent(message);
        const url = `https://wa.me/${recipient.telefone}?text=${encodedMsg}`;
        window.open(url, '_blank');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Enviar para ${recipient?.nome || 'WhatsApp'}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Revise e edite a mensagem abaixo antes de enviar:
                </p>
                
                <textarea 
                    value={message} 
                    onChange={e => setMessage(e.target.value)}
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
                    <Button variant="outline" style={{ flex: 1 }} onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="primary" 
                        style={{ flex: 1, backgroundColor: '#25D366', borderColor: '#25D366' }} 
                        onClick={handleSend}
                    >
                        <MessageSquare size={18} style={{ marginRight: '8px' }} />
                        Enviar WhatsApp
                    </Button>
                </div>
                
                <p style={{ fontSize: '11px', color: '#777', textAlign: 'center' }}>
                    Você será redirecionado para o chat oficial do WhatsApp.
                </p>
            </div>
        </Modal>
    );
};

export default WhatsAppModal;
