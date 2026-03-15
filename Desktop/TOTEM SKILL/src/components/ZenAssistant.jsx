import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Search, MapPin, Tag, ShoppingCart, User, Bot, ArrowRight, MicOff } from 'lucide-react';
import { analyzeIntent, speak } from '../services/llm';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';

const ZenAssistant = ({ onShowLocation, onBack }) => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Olá! Sou seu assistente Assaí. Como posso te ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  
  const { isListening, transcript, startListening } = useVoiceRecognition();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
      handleSend(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text = input) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate LLM processing
    setTimeout(() => {
      const response = analyzeIntent(text);
      const botMsg = { 
        role: 'bot', 
        text: response.text, 
        data: response.data,
        type: response.type 
      };
      setMessages(prev => [...prev, botMsg]);
      speak(response.text);
    }, 600);
  };

  const toggleMic = () => {
    startListening();
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-zen)' }}>
      {/* Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px' }}>
            <Bot color="white" size={24} />
          </div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}>ASSISTENTE ASSAÍ</h1>
        </div>
        <button 
          onClick={onBack}
          style={{ 
            background: 'transparent', 
            border: '2px solid var(--accent-orange)', 
            color: 'var(--accent-orange)',
            padding: '8px 16px',
            borderRadius: '12px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Voltar
        </button>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                display: 'flex',
                gap: '12px',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
              }}
            >
              <div style={{ 
                background: msg.role === 'user' ? 'var(--primary)' : 'white',
                color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                padding: '16px 20px',
                borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                fontSize: '1.1rem',
                lineHeight: '1.5'
              }}>
                {msg.text}

                {msg.data && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(0,0,0,0.05)' }}
                  >
                    {msg.data.image && (
                      <img 
                        src={msg.data.image} 
                        alt={msg.data.name} 
                        style={{ width: '100%', borderRadius: '12px', marginBottom: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} 
                      />
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--primary)' }}>
                        R$ {msg.data.price.toFixed(2).replace('.', ',')}
                      </span>
                      <button 
                        onClick={() => onShowLocation(msg.data.id)}
                        style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
                      >
                        <MapPin size={18} /> Ver Localização
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      {/* Interaction Area - REDESIGNED for Ergonomics */}
      <div style={{ padding: '20px 30px', background: 'white', borderTop: '1px solid var(--glass-border)' }}>
        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder={isListening ? "Ouvindo você..." : "Pergunte sobre um produto..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              style={{
                width: '100%',
                padding: '18px 60px 18px 25px',
                fontSize: '1.2rem',
                borderRadius: '20px',
                border: `2px solid ${isListening ? 'var(--primary)' : '#eee'}`,
                outline: 'none',
                background: '#fcfcfc',
                transition: 'all 0.3s'
              }}
            />
            <button 
              onClick={() => handleSend()}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                padding: '8px',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              <ArrowRight size={24} />
            </button>
          </div>

          <motion.div
            animate={{ 
              scale: isListening ? [1, 1.1, 1] : 1,
              backgroundColor: isListening ? 'var(--primary)' : 'white'
            }}
            transition={{ repeat: isListening ? Infinity : 0, duration: 1.5 }}
            onClick={toggleMic}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              border: '3px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}
          >
            {isListening ? <Mic size={32} color="white" /> : <Mic size={32} color="var(--primary)" />}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ZenAssistant;
