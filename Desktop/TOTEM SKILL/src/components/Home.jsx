import { motion } from 'framer-motion';
import { Search, MapPin, Tag } from 'lucide-react';

const Home = ({ onNavigate }) => {
  const menuItems = [
    { 
      id: 'consultar', 
      label: 'Consultar Preço', 
      icon: Search, 
      color: 'var(--accent-green)', 
      description: 'Veja preços e estoque' 
    },
    { 
      id: 'localizar', 
      label: 'Localizar Produto', 
      icon: MapPin, 
      color: 'var(--accent-orange)', 
      description: 'Encontre no mapa da loja' 
    },
    { 
      id: 'promocoes', 
      label: 'Ver Promoções', 
      icon: Tag, 
      color: 'var(--accent-purple)', 
      description: 'Ofertas exclusivas de hoje' 
    }
  ];

  return (
    <div className="totem-container">
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '10px' }}
        >
          CONSULTA <span style={{ color: 'var(--primary)' }}>FÁCIL</span>
        </motion.h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
          Preços • Produtos • Promoções
        </p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '40px', // Aumentado
        padding: '20px'
      }}>
        {menuItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-card"
            style={{ 
              padding: '60px 40px', // Aumentado padding vertical
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '25px', // Aumentado
              borderBottom: `8px solid ${item.color}` // Borda mais grossa
            }}
            onClick={() => onNavigate(item.id)}
          >
            <div style={{ 
              background: item.color, 
              padding: '24px', // Aumentado
              borderRadius: '24px', // Aumentado
              boxShadow: `0 0 20px ${item.color}44`
            }}>
              <item.icon size={64} color="white" /> {/* Ícone maior */}
            </div>
            <div>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>{item.label}</h2> {/* Fonte maior */}
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
