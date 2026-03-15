import { motion } from 'framer-motion';
import { ArrowLeft, Tag, Percent, Zap, TrendingDown } from 'lucide-react';
import { promotions, products } from '../services/mockData';

const Promotions = ({ onBack, onConsultProduct }) => {
  return (
    <div className="totem-container" style={{ paddingBottom: '120px' }}>
      <div style={{ marginBottom: '50px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: '900', color: 'var(--primary)' }}>OFERTAS <span style={{ color: 'var(--accent)' }}>DO DIA</span></h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ background: 'var(--accent)', color: 'white', padding: '10px 20px', borderRadius: '40px', fontWeight: '900', fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(255,130,0,0.3)' }}>
            🔥 EXCLUSIVO APP
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '40px',
        marginBottom: '60px' 
      }}>
        {promotions.map((promo, index) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card"
            style={{ 
              padding: '40px', 
              borderLeft: '12px solid var(--accent)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(255,130,0,0.1)', color: 'var(--accent)', padding: '8px 16px', borderRadius: '10px', fontWeight: '800', fontSize: '1.1rem' }}>
                {promo.discount} OFF
              </div>
              <Tag size={32} color="var(--accent)" opacity={0.3} />
            </div>

            <div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '10px', lineHeight: '1.1' }}>
                {promo.title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.3rem', fontWeight: '500' }}>
                {promo.description}
              </p>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '25px', fontSize: '1.4rem', marginTop: 'auto' }}
              onClick={() => {
                const firstProduct = products.find(p => p.category === promo.targetCategory);
                if (firstProduct) onConsultProduct(firstProduct.barcode);
              }}
            >
              Ver Ofertas <ArrowRight size={24} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Seção de Baixa de Preço */}
      <div style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
          <TrendingDown size={40} color="var(--accent-green)" />
          <h3 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>BAIXOU <span style={{ color: 'var(--accent-green)' }}>DE PREÇO</span></h3>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {products.slice(0, 4).map(product => (
            <motion.div
              key={product.id}
              whileHover={{ y: -10 }}
              className="glass-card"
              style={{ padding: '25px', textAlign: 'center', borderBottom: '6px solid var(--accent-green)' }}
            >
              <div style={{ fontSize: '5rem', marginBottom: '15px', background: 'white', borderRadius: '50%', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                {product.category === 'Cereais' ? '🥣' : product.category === 'Congelados' ? '❄️' : '🥤'}
              </div>
              <h4 style={{ margin: '10px 0', fontSize: '1.4rem', fontWeight: '800', height: '3.4rem', overflow: 'hidden' }}>{product.name}</h4>
              <p style={{ textDecoration: 'line-through', color: 'rgba(0,0,0,0.3)', margin: 0, fontSize: '1.1rem' }}>
                R$ {(product.price * 1.2).toFixed(2).replace('.', ',')}
              </p>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--accent-green)', margin: '10px 0' }}>
                R$ {product.price.toFixed(2).replace('.', ',')}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Promotions;
