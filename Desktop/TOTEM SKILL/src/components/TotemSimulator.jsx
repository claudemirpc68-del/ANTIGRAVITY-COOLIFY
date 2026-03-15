import { motion } from 'framer-motion';
import { Smartphone, ScanLine, Printer, Home } from 'lucide-react';

const TotemSimulator = ({ children, onHome }) => {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1a1a1a',
      padding: '20px',
      overflow: 'hidden'
    }}>
      {/* Physical Totem Body */}
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        maxHeight: '95vh',
        background: '#333',
        borderRadius: '20px',
        padding: '10px',
        boxShadow: '0 50px 100px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.1)',
        border: '4px solid #444',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transform: 'scale(0.9)', // Slight scale down to ensure visibility
      }}>
        {/* Top Header Label */}
        <div style={{
          background: '#007A33', // Verde Assaí
          padding: '15px 20px',
          textAlign: 'center',
          borderRadius: '10px 10px 0 0',
          borderBottom: '4px solid #FF8200', // Brighter Orange Separator
          marginBottom: '5px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}>
          <button 
            onClick={onHome}
            style={{ 
              background: '#FF8200', 
              border: 'none', 
              color: 'white', 
              padding: '12px 24px', 
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '1.1rem',
              fontWeight: '900',
              boxShadow: '0 4px 0 #b35b00'
            }}
          >
            <Home size={24} /> INÍCIO
          </button>
          <h2 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '900', letterSpacing: '1px', margin: 0, flex: 1, textAlign: 'center' }}>
            ASSAÍ <span style={{ color: '#FF8200' }}>ATACADISTA</span>
          </h2>
          <div style={{ width: '120px' }}></div> 
        </div>

        {/* Integrated Discreet Simulator Controls */}
        <div style={{
          background: '#222',
          padding: '5px 20px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          borderBottom: '1px solid #444',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '0.6rem', color: '#555', fontWeight: 'bold' }}>SCAN:</span>
          {['Leite', 'Café', 'Soya'].map(item => (
            <button key={item}
              onClick={() => window.dispatchEvent(new CustomEvent('simulate-scan', { detail: item }))}
              style={{ background: '#333', border: '1px solid #444', color: '#888', fontSize: '0.6rem', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}
            >
              {item}
            </button>
          ))}
        </div>

        {/* The Screen (UI App) */}
        <div style={{
          background: '#f8fafc',
          width: '100%',
          flex: 1, // Let it fill space
          minHeight: '400px',
          aspectRatio: '4/3', 
          borderRadius: '4px',
          overflow: 'hidden',
          border: '10px solid #111',
          position: 'relative'
        }}>
          {children}
        </div>

        {/* Hardware Components Section - COMPACTED */}
        <div style={{
          padding: '15px 20px',
          display: 'grid',
          gridTemplateColumns: 'minmax(80px, 1fr) 2fr minmax(80px, 1fr) 100px', // Added QR space
          gap: '15px',
          alignItems: 'center',
          background: '#222',
          borderRadius: '0 0 10px 10px',
          marginTop: '5px'
        }}>
          {/* Printer Slot */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: '6px', 
              background: '#000', 
              margin: '0 auto 5px', 
              borderRadius: '3px',
              border: '1px solid #444'
            }} />
            <Printer size={20} color="#555" />
          </div>

          {/* Compact Scanner Window */}
          <div style={{ 
            background: '#111', 
            height: '40px', // Reduced from 100px
            borderRadius: '8px', 
            border: '2px solid #444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <motion.div 
              animate={{ opacity: [0.2, 0.8, 0.2], top: ['0%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{ width: '100%', height: '2px', background: 'red', boxShadow: '0 0 10px red', position: 'absolute' }}
            />
            <span style={{ fontSize: '0.6rem', color: '#444', fontWeight: 'bold' }}>SCANNER AREA</span>
          </div>

          {/* Compact Card Reader */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '30px', 
              background: '#111', 
              margin: '0 auto', 
              borderRadius: '4px',
              border: '2px solid #444' 
            }} />
            <p style={{ fontSize: '0.4rem', color: '#555', marginTop: '2px' }}>CARD</p>
          </div>

          {/* Compact QR Sticker */}
          <div style={{ 
            background: 'white', 
            padding: '4px', 
            borderRadius: '4px', 
            width: '60px', 
            height: '60px',
            margin: '0 auto'
          }}>
            <div style={{ width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.4rem', textAlign: 'center', color: '#666' }}>
              FIXED<br/>QR
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
      </div>
    </div>
  );
};

export default TotemSimulator;
