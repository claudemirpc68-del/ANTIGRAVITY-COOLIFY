import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, Loader2, CheckCircle2, AlertCircle, ShoppingCart, MapPin } from 'lucide-react';
import { get_product_info, upsell_engine } from '../services/api';

const ProductConsultation = ({ onBack, onShowLocation, initialBarcode }) => {
  const [query, setQuery] = useState(initialBarcode || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [upsell, setUpsell] = useState(null);

  useEffect(() => {
    if (initialBarcode) {
      handleSearch();
    }
  }, [initialBarcode]);

  const handleSearch = (e) => {
    e?.preventDefault();
    const searchTerm = e ? query : initialBarcode;
    if (!searchTerm) return;
    
    setLoading(true);
    setResult(null);
    setUpsell(null);
    
    // Simulate network delay
    setTimeout(() => {
      const product = get_product_info(searchTerm);
      setResult(product || 'not_found');
      if (product) {
        setUpsell(upsell_engine(product.id));
      }
      setLoading(false);
    }, 800);
  };
  useEffect(() => {
    const handleSimulatedScan = (e) => {
      setQuery(e.detail);
      // We need a small delay for the state update or use the detail directly
      setLoading(true);
      setResult(null);
      setUpsell(null);
      setTimeout(() => {
        const product = get_product_info(e.detail);
        setResult(product || 'not_found');
        if (product) {
          setUpsell(upsell_engine(product.id));
        }
        setLoading(false);
      }, 500);
    };

    window.addEventListener('simulate-scan', handleSimulatedScan);
    return () => window.removeEventListener('simulate-scan', handleSimulatedScan);
  }, []);

  return (
    <div className="totem-container">
      <div style={{ marginBottom: '40px' }}>
        <button className="btn-primary" onClick={onBack} style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>
          <ArrowLeft size={20} /> Voltar para o Início
        </button>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '60px' }}>
          <Search style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={32} />
          <input
            type="text"
            placeholder="Digite o nome ou código do produto..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ 
              width: '100%',
              padding: '24px 24px 24px 72px',
              fontSize: '1.5rem',
              borderRadius: '24px',
              border: '1px solid var(--glass-border)',
              background: 'var(--glass-bg)',
              color: 'white',
              outline: 'none',
              transition: 'all 0.3s'
            }}
          />
          <button type="submit" className="btn-primary" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
            Buscar
          </button>
        </form>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '40px' }}
            >
              <Loader2 className="floating" size={64} color="var(--primary)" />
              <p style={{ marginTop: '20px', fontSize: '1.2rem' }}>Consultando estoque...</p>
            </motion.div>
          )}

          {result && result !== 'not_found' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card"
              style={{ padding: '40px', borderLeft: '8px solid var(--accent-green)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-green)', marginBottom: '10px' }}>
                    <CheckCircle2 size={24} />
                    <span style={{ fontWeight: '600' }}>Produto em Estoque ({result.stock} unidades)</span>
                  </div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>{result.name}</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>Cód: {result.barcode}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Preço</p>
                  <h3 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--accent-green)' }}>
                    R$ {result.price.toFixed(2).replace('.', ',')}
                  </h3>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <button 
                  className="btn-primary" 
                  onClick={() => onShowLocation(result.id)}
                  style={{ background: 'var(--accent-orange)', fontSize: '1.2rem', padding: '24px' }}
                >
                  <MapPin size={28} /> Onde encontrar?
                </button>
                <button className="btn-primary" style={{ fontSize: '1.2rem', padding: '24px' }}>
                  <ShoppingCart size={28} /> Adicionar à lista
                </button>
              </div>

              {upsell && upsell.items.length > 0 && (
                <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid var(--glass-border)' }}>
                  <p style={{ fontWeight: '600', marginBottom: '20px', color: 'var(--text-secondary)' }}>
                    PRODUTOS COMPLEMENTARES
                  </p>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {upsell.items.map(item => (
                      <motion.div 
                        key={item.id} 
                        whileHover={{ y: -5 }}
                        style={{ 
                          flex: 1, 
                          background: 'rgba(255,255,255,0.05)', 
                          padding: '20px', 
                          borderRadius: '16px',
                          border: '1px solid var(--glass-border)'
                        }}
                      >
                        <p style={{ fontWeight: '600' }}>{item.name}</p>
                        <p style={{ color: 'var(--accent-green)', fontWeight: 'bold', marginTop: '5px' }}>
                          R$ {item.price.toFixed(2).replace('.', ',')}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {upsell && upsell.promotions.length > 0 && (
                <div style={{ 
                  marginTop: '20px', 
                  background: 'linear-gradient(90deg, var(--accent-purple), #6d28d9)', 
                  padding: '15px 25px', 
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  <Tag size={24} />
                  <div>
                    <h4 style={{ fontWeight: '800' }}>{upsell.promotions[0].title}</h4>
                    <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>{upsell.promotions[0].description}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {result === 'not_found' && (
            <motion.div 
              key="not_found"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass-card"
              style={{ padding: '40px', textAlign: 'center', borderLeft: '8px solid #ef4444' }}
            >
              <AlertCircle size={64} color="#ef4444" style={{ marginBottom: '20px' }} />
              <h3>Produto não encontrado</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>
                Verifique o nome ou tente escanear o código de barras novamente.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductConsultation;
