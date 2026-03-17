import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { analyzeScaleIntent } from '../../services/llmScale';

const DIAS_SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

const ZenAssistant = ({ user, colaboradores }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: `Olá ${user.nome}! 👋 Sou o Assistente Assaí. Posso consultar a escala de qualquer colaborador pelo registro. Como posso te ajudar?` }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    // Estado da conversa: null | 'aguardando_matricula'
    const [conversationState, setConversationState] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const addBotMessage = (text) => {
        setMessages(prev => [...prev, { role: 'bot', text }]);
    };

    const handleMatricula = (rawInput) => {
        const matricula = rawInput.trim();
        const colab = colaboradores.find(c =>
            c.matricula === matricula ||
            c.matricula.includes(matricula) ||
            matricula.includes(c.matricula)
        );

        setConversationState(null);

        if (!colab) {
            return `Não encontrei nenhum colaborador com o registro **${matricula}**. Verifique o número e tente novamente, ou me diga o nome para eu buscar de outra forma.`;
        }

        const folgaFixaNome = DIAS_SEMANA[colab.folgaFixa] || 'não definida';
        const turno = colab.horario === '14:30' ? '2º Turno (14:30 — 22:50)' : '1º Turno (07:30 — 14:30)';

        return `📋 **${colab.nome}** — Matrícula ${colab.matricula}

🗓️ **Folga fixa:** ${folgaFixaNome}
⏰ **Turno:** ${turno}
🏷️ **Função:** ${colab.funcao}
🔄 **Ciclo atual:** 16/03 a 15/04 (6x1)

Clique na aba de escala para ver o calendário completo deste colaborador!`;
    };

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        const sentInput = input;
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        setTimeout(() => {
            let responseText;

            // Se está aguardando uma matrícula
            if (conversationState === 'aguardando_matricula') {
                responseText = handleMatricula(sentInput);
            } else {
                const response = analyzeScaleIntent(sentInput, colaboradores, user);

                // Se é intenção de folga/escala, pedir matrícula
                if (response.type === 'scale_info' && response.needsMatricula) {
                    setConversationState('aguardando_matricula');
                    responseText = response.text;
                } else {
                    responseText = response.text;
                }
            }

            setMessages(prev => [...prev, { role: 'bot', text: responseText }]);
            setIsThinking(false);
        }, 900);
    };

    return (
        <>
            {/* Botão Flutuante */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--assai-orange), #FF8C00)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(255, 102, 0, 0.3)',
                    cursor: 'pointer',
                    zIndex: 1000,
                    border: '2px solid white'
                }}
            >
                <Bot color="white" size={30} />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)' }}
                />
            </motion.div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        style={{
                            position: 'fixed',
                            bottom: '90px',
                            right: '20px',
                            width: '350px',
                            height: '520px',
                            background: 'rgba(255, 255, 255, 0.97)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '24px',
                            boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            zIndex: 1000,
                            overflow: 'hidden',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '16px 20px', background: 'var(--assai-orange)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '12px' }}>
                                    <Sparkles size={18} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '800' }}>Assistente Assaí</div>
                                    <div style={{ fontSize: '10px', opacity: 0.8 }}>
                                        {conversationState === 'aguardando_matricula' ? '⌨️ Aguardando matrícula...' : '🟢 Online para te ajudar'}
                                    </div>
                                </div>
                            </div>
                            <X size={20} onClick={() => { setIsOpen(false); setConversationState(null); }} style={{ cursor: 'pointer' }} />
                        </div>

                        {/* Messages Area */}
                        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {messages.map((msg, i) => (
                                <div key={i} style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    padding: '10px 14px',
                                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                    background: msg.role === 'user' ? 'var(--assai-orange)' : '#f0f0f0',
                                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                                    fontSize: '13px',
                                    maxWidth: '88%',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    lineHeight: '1.5',
                                    whiteSpace: 'pre-line'
                                }}>
                                    {msg.text}
                                </div>
                            ))}
                            {isThinking && (
                                <div style={{ alignSelf: 'flex-start', padding: '12px 16px', borderRadius: '18px 18px 18px 4px', background: '#f0f0f0', display: 'flex', gap: '4px' }}>
                                    {[0, 1, 2].map(d => (
                                        <motion.div
                                            key={d}
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ repeat: Infinity, duration: 0.6, delay: d * 0.1 }}
                                            style={{ width: '5px', height: '5px', background: '#999', borderRadius: '50%' }}
                                        />
                                    ))}
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} style={{ padding: '14px 16px', background: 'white', borderTop: '1px solid #eee', display: 'flex', gap: '8px' }}>
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder={conversationState === 'aguardando_matricula' ? 'Digite a matrícula...' : 'Pergunte sobre sua escala...'}
                                style={{ flex: 1, border: `1.5px solid ${conversationState === 'aguardando_matricula' ? 'var(--assai-orange)' : '#ddd'}`, borderRadius: '12px', padding: '10px 14px', fontSize: '13px', outline: 'none', transition: 'border 0.2s' }}
                                autoFocus={conversationState === 'aguardando_matricula'}
                            />
                            <button
                                type="submit"
                                style={{ background: 'var(--assai-orange)', border: 'none', width: '40px', height: '40px', borderRadius: '10px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ZenAssistant;
