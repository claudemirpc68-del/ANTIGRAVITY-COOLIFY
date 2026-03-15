import { useState } from 'react';
import Home from './components/Home';
import ZenAssistant from './components/ZenAssistant';
import ProductConsultation from './components/ProductConsultation';
import ProductLocation from './components/ProductLocation';
import TotemSimulator from './components/TotemSimulator';

function App() {
  const [view, setView] = useState('home'); // home, assistant, consultation, location
  const [selectedProductId, setSelectedProductId] = useState(null);

  const showLocation = (productId) => {
    setSelectedProductId(productId);
    setView('location');
  };

  const handleNavigate = (target) => {
    if (target === 'consultar') setView('consultation');
    else if (target === 'localizar') setView('assistant');
    else if (target === 'promocoes') setView('assistant'); // Por enquanto leva ao assistente
  };

  return (
    <TotemSimulator>
      <div style={{ height: '100%', width: '100%' }}>
        {view === 'home' && (
          <Home onNavigate={handleNavigate} />
        )}

        {view === 'assistant' && (
          <ZenAssistant 
            onShowLocation={showLocation} 
            onBack={() => setView('home')} 
          />
        )}

        {view === 'consultation' && (
          <ProductConsultation 
            onShowLocation={showLocation} 
            onBack={() => setView('home')} 
          />
        )}

        {view === 'location' && (
          <ProductLocation 
            productId={selectedProductId} 
            onBack={() => setView('assistant')} 
          />
        )}
      </div>
    </TotemSimulator>
  );
}

export default App;
