```javascript
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
    <div className="totem-container">
      <div style={{ marginBottom: '60px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'white', marginBottom: '10px' }}>
          Bem-vindo ao <span style={{ color: 'var(--accent)' }}>ASSAÍ</span>
        </h1>
        <p style={{ fontSize: '1.5rem', opacity: 0.8 }}>Como podemos ajudar você hoje?</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '40px',
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
              padding: '60px 40px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '25px',
              textAlign: 'center',
              borderBottom: `8px solid ${item.color}`,
              transition: 'all 0.3s'
            }}
          >
            <div style={{ color: item.color }}>
              {item.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.3rem' }}>{item.description}</p> {/* Fonte maior */}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ 
          marginTop: '80px', 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        <div className="glass-card" style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: '600' }}>Escaneie e leve as informações</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>no seu celular</p>
          </div>
          <div style={{ background: 'white', padding: '10px', borderRadius: '12px', width: '80px', height: '80px' }}>
            {/* Placeholder for QR Code */}
            <div style={{ width: '100%', height: '100%', background: '#eee' }}></div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;
