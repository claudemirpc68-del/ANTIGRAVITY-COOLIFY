import { motion } from 'framer-motion';
import { ArrowLeft, Tag, Percent, Zap, TrendingDown } from 'lucide-react';
import { promotions, products } from '../services/mockData';

const Promotions = ({ onBack, onConsultProduct }) => {
  return (
    <div className="totem-container" style={{ paddingBottom: '100px' }}>
      <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button className="btn-primary" onClick={onBack} style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>
          <ArrowLeft size={20} /> Início
        </button>
        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900' }}>Ofertas Imbatíveis</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '30px' }}>
        {promotions.map((promo, index) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card"
            style={{ 
              padding: '30px', 
              borderTop: '8px solid var(--accent)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1 }}>
              <Zap size={150} color="var(--accent)" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent)', marginBottom: '15px' }}>
                <Tag size={24} />
                <span style={{ fontWeight: '800', letterSpacing: '1px' }}>{promo.discount}</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '15px' }}>{promo.title}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.5' }}>{promo.description}</p>
            </div>

            <div style={{ marginTop: '30px' }}>
               <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '20px' }}
                onClick={() => {
                  const firstProduct = products.find(p => p.category === promo.targetCategory);
                  if (firstProduct) onConsultProduct(firstProduct.barcode);
                }}
              >
                Ver Produtos Participantes
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Seção de Baixa de Preço */}
      <div style={{ marginTop: '60px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', fontSize: '1.8rem' }}>
          <TrendingDown color="var(--accent-green)" /> Baixou de Preço
        </h3>
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
          {products.slice(0, 4).map(product => (
            <motion.div
              key={product.id}
              whileHover={{ y: -10 }}
              className="glass-card"
              style={{ minWidth: '250px', padding: '20px', textAlign: 'center' }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '10px' }}>📦</div>
              <h4 style={{ margin: '10px 0' }}>{product.name}</h4>
              <p style={{ textDecoration: 'line-through', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                R$ {(product.price * 1.2).toFixed(2).replace('.', ',')}
              </p>
              <p style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-green)', margin: '5px 0' }}>
                R$ {product.price.toFixed(2).replace('.', ',')}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Promotions;
