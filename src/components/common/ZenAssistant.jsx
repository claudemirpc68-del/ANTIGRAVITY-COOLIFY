import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, WifiOff, Wifi } from 'lucide-react';
import { analyzeScaleIntent } from '../../services/llmScale';
import { FOLGAS_MANUAIS } from '../../logic/mockData';
import { STORE_CONFIG } from '../../logic/constants';

const ZenAssistant = ({ user, colaboradores }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [networkStatus, setNetworkStatus] = useState('idle'); // 'idle' | 'checking' | 'allowed' | 'blocked'
    const [messages, setMessages] = useState([
        { role: 'bot', text: `Olá! Sou o Assistente de Escala da Unidade Suzano 068.\n\nPosso te ajudar com:\n• Quem trabalha/folga hoje?\n• Escala e folgas pelo nº de registro\n• Horários de domingo\n• Legenda D e F\n\nO que deseja saber?` }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [conversationState, setConversationState] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // ── Verificação de rede ───────────────────────────────────────────────
    const verificarRede = async () => {
        setNetworkStatus('checking');
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const { ip } = await res.json();
            if (ip === STORE_CONFIG.OFFICIAL_IP) {
                setNetworkStatus('allowed');
            } else {
                setNetworkStatus('blocked');
            }
        } catch {
            // Se não conseguir verificar, bloqueia por segurança
            setNetworkStatus('blocked');
        }
    };

    const handleOpenChat = () => {
        setIsOpen(true);
        verificarRede();
    };

    // ── Lookups ───────────────────────────────────────────────────────────
    const handleMatricula = (rawInput) => {
        const matricula = rawInput.trim();
        const colab = colaboradores.find(c =>
            c.matricula === matricula ||
            c.matricula.includes(matricula) ||
            matricula.includes(c.matricula)
        );

        setConversationState(null);

        if (!colab) {
            return `Não encontrei nenhum colaborador com o registro **${matricula}**. Verifique o número e tente novamente.`;
        }

        // RESTRIÇÃO: Colaborador só vê a própria matrícula
        if (user.role === 'colaborador') {
            const myData = colaboradores.find(c => c.id === user.id);
            if (!myData || myData.matricula !== colab.matricula) {
                return `🔒 **Acesso Restrito:** Você só tem permissão para consultar informações do seu próprio registro (**${myData?.matricula || 'N/A'}**).`;
            }
        }

        const hoje = new Date().toISOString().split('T')[0];
        const folgasColab = (FOLGAS_MANUAIS[colab.id] || [])
            .filter(d => d >= hoje)
            .sort()
            .map(d => {
                const [y, m, day] = d.split('-');
                return `${day}/${m}/${y}`;
            });

        const folgasTexto = folgasColab.length > 0
            ? folgasColab.join(', ')
            : 'Ainda não definida pela gerência para o período';

        const turno = colab.horario === '14:30' ? '2º Turno (14:30 — 22:50)'
            : colab.horario === '22:00' ? 'Turno Noturno (22:00 — 06:00)'
            : '1º Turno (07:30 — 14:30)';

        return `📋 **${colab.nome}** — Mat. ${colab.matricula}\n\n⏰ **Turno:** ${turno}\n🏷️ **Função:** ${colab.funcao}\n🔄 **Regime:** 6x1 (folga definida pela gerência)\n🗓️ **Próximas folgas:** ${folgasTexto}\n\nConsulte a grade completa na aba de Escala!`;
    };

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || networkStatus !== 'allowed') return;

        const userMsg = { role: 'user', text: input };
        const sentInput = input;
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        setTimeout(() => {
            let responseText;
            if (conversationState === 'aguardando_matricula') {
                responseText = handleMatricula(sentInput);
            } else {
                const response = analyzeScaleIntent(sentInput, colaboradores, user);
                if (response.type === 'scale_info' && response.needsMatricula) {
                    setConversationState('aguardando_matricula');
                }
                responseText = response.text;
            }
            setMessages(prev => [...prev, { role: 'bot', text: responseText }]);
            setIsThinking(false);
        }, 900);
    };

    // ── Tela de Bloqueio de Rede ──────────────────────────────────────────
    const NetworkBlockScreen = () => (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 24px', gap: '16px', textAlign: 'center' }}>
            <div style={{ background: '#FFF3E0', padding: '20px', borderRadius: '50%' }}>
                <WifiOff size={40} color="#E65100" />
            </div>
            <div>
                <p style={{ fontWeight: '800', fontSize: '16px', color: '#333', marginBottom: '8px' }}>
                    Acesso Restrito
                </p>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
                    O Assistente de Escala está disponível <strong>apenas na rede Wi-Fi da Mercearia Suzano 068</strong>.
                </p>
                <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                    Conecte-se à rede da loja e tente novamente.
                </p>
            </div>
            <button
                onClick={verificarRede}
                style={{ marginTop: '8px', padding: '10px 20px', background: 'var(--assai-orange)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
            >
                Tentar novamente
            </button>
        </div>
    );

    const CheckingScreen = () => (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '30px' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}>
                <Wifi size={36} color="var(--assai-orange)" />
            </motion.div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#555' }}>Verificando conexão de rede...</p>
            <p style={{ fontSize: '12px', color: '#999' }}>Apenas a rede Wi-Fi da Mercearia Suzano 068 é autorizada.</p>
        </div>
    );

    return (
        <>
            {/* Botão Flutuante */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                onClick={handleOpenChat}
                style={{
                    position: 'fixed', bottom: '20px', right: '20px',
                    width: '60px', height: '60px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--assai-orange), #FF8C00)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(255, 102, 0, 0.3)',
                    cursor: 'pointer', zIndex: 1000, border: '2px solid white'
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
                            position: 'fixed', bottom: '90px', right: '20px',
                            width: '350px', height: '520px',
                            background: 'rgba(255, 255, 255, 0.97)',
                            backdropFilter: 'blur(10px)', borderRadius: '24px',
                            boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
                            display: 'flex', flexDirection: 'column',
                            zIndex: 1000, overflow: 'hidden',
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
                                    <div style={{ fontSize: '10px', opacity: 0.85 }}>
                                        {networkStatus === 'checking' ? '🔄 Verificando rede...'
                                            : networkStatus === 'blocked' ? '🔴 Rede não autorizada'
                                            : networkStatus === 'allowed' ? '🟢 Rede Suzano 068'
                                            : '🟡 Aguardando verificação'}
                                    </div>
                                </div>
                            </div>
                            <X size={20} onClick={() => { setIsOpen(false); setConversationState(null); }} style={{ cursor: 'pointer' }} />
                        </div>

                        {/* Conteúdo condicional */}
                        {networkStatus === 'checking' && <CheckingScreen />}
                        {networkStatus === 'blocked' && <NetworkBlockScreen />}

                        {(networkStatus === 'allowed' || networkStatus === 'idle') && (
                            <>
                                {/* Messages Area */}
                                <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {messages.map((msg, i) => (
                                        <div key={i} style={{
                                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                            padding: '10px 14px',
                                            borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                            background: msg.role === 'user' ? 'var(--assai-orange)' : '#f0f0f0',
                                            color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                                            fontSize: '13px', maxWidth: '88%',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                            lineHeight: '1.5', whiteSpace: 'pre-line'
                                        }}>
                                            {msg.text}
                                        </div>
                                    ))}
                                    {isThinking && (
                                        <div style={{ alignSelf: 'flex-start', padding: '12px 16px', borderRadius: '18px 18px 18px 4px', background: '#f0f0f0', display: 'flex', gap: '4px' }}>
                                            {[0, 1, 2].map(d => (
                                                <motion.div key={d}
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
                                        placeholder={networkStatus === 'idle' ? 'Verificando rede...' : conversationState === 'aguardando_matricula' ? 'Digite a matrícula...' : 'Pergunte sobre a escala...'}
                                        disabled={networkStatus === 'idle'}
                                        style={{
                                            flex: 1,
                                            border: `1.5px solid ${conversationState === 'aguardando_matricula' ? 'var(--assai-orange)' : '#ddd'}`,
                                            borderRadius: '12px', padding: '10px 14px',
                                            fontSize: '13px', outline: 'none',
                                            opacity: networkStatus === 'idle' ? 0.5 : 1
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={networkStatus === 'idle'}
                                        style={{ background: 'var(--assai-orange)', border: 'none', width: '40px', height: '40px', borderRadius: '10px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: networkStatus === 'idle' ? 'not-allowed' : 'pointer', flexShrink: 0, opacity: networkStatus === 'idle' ? 0.5 : 1 }}
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ZenAssistant;
