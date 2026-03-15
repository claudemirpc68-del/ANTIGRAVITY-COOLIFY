import { motion } from 'framer-motion';
import { ArrowLeft, Map as MapIcon, Info, Navigation2 } from 'lucide-react';
import { products } from '../services/mockData';
import { QRCodeSVG } from 'qrcode.react';

const ProductLocation = ({ productId, onBack }) => {
  const product = products.find(p => p.id === productId);

  if (!product) return null;

  return (
    <div style={{ height: '100%', background: 'var(--bg-zen)', display: 'flex', flexDirection: 'column' }}>
      {/* Header com botão voltar */}
      <div style={{ padding: '20px', background: 'white', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button 
          onClick={onBack} 
          style={{ 
            background: 'transparent', 
            color: 'var(--primary)', 
            border: '2px solid var(--primary)', 
            padding: '10px 20px',
            borderRadius: '12px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} /> Voltar ao Assistente
        </button>
        <div style={{ color: 'var(--primary)', fontWeight: 'bold' }}>MAPA ASSAÍ</div>
      </div>

      <div style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
        {/* Card de Localização Principal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: 'white', padding: '30px', borderRadius: '24px', borderLeft: '10px solid var(--accent)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
        >
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>Você encontrará o produto em:</div>
          <h2 style={{ color: 'var(--primary)', fontSize: '2.5rem', fontWeight: '900', margin: '0 0 10px 0' }}>CORREDOR {product.location.corridor}</h2>
          <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>Prateleira {product.location.shelf} • {product.name}</p>
        </motion.div>

        {/* Representação do Mapa */}
        <div style={{ 
          flex: 1, 
          background: 'white', 
          borderRadius: '24px', 
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--primary)', fontWeight: 'bold' }}>
            <MapIcon size={20} /> MAPA DA LOJA
          </div>
          
          <div style={{ 
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            padding: '10px'
          }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ 
                background: (i + 1).toString() === product.location.corridor ? 'var(--accent)' : '#f1f5f9',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: '800',
                color: (i + 1).toString() === product.location.corridor ? 'white' : '#94a3b8',
                boxShadow: (i + 1).toString() === product.location.corridor ? '0 0 15px rgba(255, 130, 0, 0.4)' : 'none'
              }}>
                {i + 1}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <div style={{ width: '15px', height: '15px', background: 'var(--accent)', borderRadius: '4px' }}></div>
            Corredor do Produto
          </div>
        </div>

        {/* QR Code Section */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           style={{ background: 'white', padding: '30px', borderRadius: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
        >
          <div style={{ color: 'var(--text-secondary)' }}>
            <p>Leve o mapa com você!</p>
            <p style={{ fontSize: '0.8rem' }}>Escaneie para abrir no celular</p>
          </div>
          <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '16px' }}>
            <QRCodeSVG value={`https://assai.com.br/mapa?corredor=${product.location.corridor}`} size={140} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductLocation;
