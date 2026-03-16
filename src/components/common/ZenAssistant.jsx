import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Mic, MessageCircle, Sparkles } from 'lucide-react';
import { analyzeScaleIntent, speak } from '../../services/llmScale';

const ZenAssistant = ({ user, colaboradores }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: `Olá ${user.nome}! Sou seu Assistente Assaí. Como posso ajudar com sua escala hoje?` }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        // Simular inteligência
        setTimeout(() => {
            const response = analyzeScaleIntent(input, colaboradores, user);
            setMessages(prev => [...prev, { role: 'bot', text: response.text }]);
            setIsThinking(false);
            speak(response.text);
        }, 1000);
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
                            height: '500px',
                            background: 'rgba(255, 255, 255, 0.95)',
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
                        <div style={{ padding: '20px', background: 'var(--assai-orange)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '12px' }}>
                                    <Sparkles size={18} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '800' }}>Assistente Assaí</div>
                                    <div style={{ fontSize: '10px', opacity: 0.8 }}>Online para te ajudar</div>
                                </div>
                            </div>
                            <X size={20} onClick={() => setIsOpen(false)} style={{ cursor: 'pointer' }} />
                        </div>

                        {/* Messages Area */}
                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {messages.map((msg, i) => (
                                <div key={i} style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    padding: '12px 16px',
                                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                    background: msg.role === 'user' ? 'var(--assai-orange)' : '#f0f0f0',
                                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                                    fontSize: '13px',
                                    maxWidth: '85%',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    lineHeight: '1.4'
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
                                            style={{ width: '4px', height: '4px', background: '#999', borderRadius: '50%' }}
                                        />
                                    ))}
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} style={{ padding: '20px', background: 'white', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
                            <input 
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Pergunte sobre sua escala..."
                                style={{ flex: 1, border: '1px solid #ddd', borderRadius: '12px', padding: '10px 15px', fontSize: '13px', outline: 'none' }}
                            />
                            <button 
                                type="submit"
                                style={{ background: 'var(--assai-orange)', border: 'none', width: '40px', height: '40px', borderRadius: '10px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
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
