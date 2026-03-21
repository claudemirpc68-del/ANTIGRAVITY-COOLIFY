import { motion } from 'framer-motion';
import { MapPin, Tag, Scan, MessageSquare } from 'lucide-react';

const Home = ({ onNavigate, onConsultProduct }) => {
  const menuItems = [
    { 
      id: 'recognition', 
      title: 'CONSULTAR PREÇO', 
      subtitle: 'Use o scanner ou câmera',
      icon: <Scan size={64} />,
      color: 'var(--accent)',
      action: () => onNavigate('recognition')
    },
    { 
      id: 'promotions', 
      title: 'VER PROMOÇÕES', 
      subtitle: 'Ofertas exclusivas Assaí',
      icon: <Tag size={64} />,
      color: 'var(--accent-green)',
      action: () => onNavigate('promotions')
    },
    { 
      id: 'location', 
      title: 'LOCALIZAR PRODUTO', 
      subtitle: 'Mapa completo da loja',
      icon: <MapPin size={64} />,
      color: 'var(--accent-orange)',
      action: () => onNavigate('location')
    },
    { 
      id: 'assistant', 
      title: 'ASSISTENTE VIRTUAL', 
      subtitle: 'Dúvidas e informações',
      icon: <MessageSquare size={64} />,
      color: 'var(--accent-purple)',
      action: () => onNavigate('assistant')
    }
  ];

  return (
    <div className="totem-container" style={{ padding: '20px 40px' }}>
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'white', marginBottom: '5px' }}>
          Bem-vindo ao <span style={{ color: 'var(--accent)' }}>ASSAÍ</span>
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Como podemos ajudar você hoje?</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={item.action}
            className="glass-card"
            style={{ 
              padding: '35px 30px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '15px',
              textAlign: 'center',
              borderBottom: `8px solid ${item.color}`,
              transition: 'all 0.3s'
            }}
          >
            <div style={{ color: item.color }}>
              {item.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0 }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{item.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ 
          marginTop: '40px', 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        <div className="glass-card" style={{ padding: '15px 30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: '600', margin: 0 }}>Escaneie e leve as informações</p>
            <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: 0 }}>Acesse: assai.com.br</p>
          </div>
          <div style={{ width: '60px', height: '60px', background: 'white', padding: '8px', borderRadius: '10px' }}>
             <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ASSAI" alt="QR Code" style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;
