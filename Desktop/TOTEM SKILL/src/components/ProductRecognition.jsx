import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Upload, Scan, Loader2, CheckCircle2, MapPin, Search } from 'lucide-react';
import { recognize_product_from_image } from '../services/api';

const ProductRecognition = ({ onBack, onShowLocation, onConsultProduct }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState('idle'); // idle, scanning, result

  const simulateScan = (productIndex) => {
    setIsScanning(true);
    setStep('scanning');
    setResult(null);

    // Simulando processamento de visão computacional
    setTimeout(() => {
      const product = recognize_product_from_image(productIndex);
      setResult(product);
      setIsScanning(false);
      setStep('result');
    }, 2000);
  };

  const sampleImages = [
    { id: 0, label: 'Imagem 1 (Sucos Maguary)', icon: '🧃' },
    { id: 1, label: 'Imagem 2 (Sucos Variados)', icon: '🍹' },
    { id: 2, label: 'Imagem 3 (Biscoitos Panco)', icon: '🍪' },
    { id: 4, label: 'Imagem 5 (Óleo Soya)', icon: '🌻' },
  ];

  return (
    <div className="totem-container">
      <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button className="btn-primary" onClick={onBack} style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>
          <ArrowLeft size={20} /> Sair do Scanner
        </button>
        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900' }}>Reconhecimento de Produto</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        {/* Lado Esquerdo: Área da Câmera */}
        <div className="glass-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ 
            flex: 1, 
            background: '#000', 
            borderRadius: '16px', 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--glass-border)'
          }}>
            {step === 'idle' && (
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                <Camera size={80} style={{ marginBottom: '20px' }} />
                <p>Selecione uma imagem para simular a câmera</p>
              </div>
            )}

            {step === 'scanning' && (
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <motion.div 
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  style={{ 
                    position: 'absolute', 
                    left: 0, 
                    right: 0, 
                    height: '4px', 
                    background: 'var(--accent)', 
                    boxShadow: '0 0 20px var(--accent)',
                    zIndex: 10
                  }}
                />
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader2 className="floating" size={60} color="var(--accent)" />
                </div>
              </div>
            )}

            {step === 'result' && result && (
               <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)' }}
               >
                 <div style={{ textAlign: 'center' }}>
                    <CheckCircle2 size={80} color="var(--accent-green)" />
                    <h3 style={{ marginTop: '20px' }}>Produto Identificado!</h3>
                 </div>
               </motion.div>
            )}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button className="btn-primary" style={{ flex: 1, opacity: 0.5 }} disabled>
              <Camera size={20} /> Abrir Câmera
            </button>
            <button className="btn-primary" style={{ flex: 1, opacity: 0.5 }} disabled>
              <Upload size={20} /> Carregar Foto
            </button>
          </div>
        </div>

        {/* Lado Direito: Controles e Resultados */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {step === 'idle' && (
            <div className="glass-card" style={{ padding: '30px' }}>
              <h3 style={{ marginBottom: '20px' }}>Simular Reconhecimento</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                Como estamos no simulador, escolha um dos cenários abaixo para ver a visão computacional em ação:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {sampleImages.map(img => (
                  <button 
                    key={img.id}
                    className="btn-primary" 
                    style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        border: '1px solid var(--glass-border)',
                        padding: '25px 15px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        fontSize: '1rem'
                    }}
                    onClick={() => simulateScan(img.id)}
                  >
                    <span style={{ fontSize: '2rem' }}>{img.icon}</span>
                    {img.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'scanning' && (
             <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                <h2 className="floating">Processando Imagem...</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '20px' }}>
                  Analisando padrões de embalagem e OCR de preços do Assaí.
                </p>
             </div>
          )}

          {step === 'result' && result && (
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="glass-card" 
              style={{ padding: '30px', borderLeft: '10px solid var(--accent-green)' }}
            >
              <div style={{ marginBottom: '25px' }}>
                <span style={{ background: 'var(--accent-green)', padding: '5px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  CONFIANÇA 98%
                </span>
                <h2 style={{ fontSize: '2.2rem', fontWeight: '900', marginTop: '15px' }}>{result.name}</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Categoria: {result.category}</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', marginBottom: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.2rem' }}>Preço de Etiqueta:</span>
                    <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent-green)' }}>
                        R$ {result.price.toFixed(2).replace('.', ',')}
                    </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                 <button 
                    className="btn-primary" 
                    style={{ background: 'var(--accent-orange)' }}
                    onClick={() => onShowLocation(result.id)}
                 >
                    <MapPin size={22} /> Localizar
                 </button>
                 <button 
                    className="btn-primary"
                    onClick={() => onConsultProduct(result.barcode)}
                 >
                    <Search size={22} /> Detalhes
                 </button>
              </div>

              <button 
                className="btn-primary" 
                style={{ width: '100%', marginTop: '15px', background: 'transparent', border: '1px solid var(--glass-border)' }}
                onClick={() => setStep('idle')}
              >
                Escanear Outro
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductRecognition;
