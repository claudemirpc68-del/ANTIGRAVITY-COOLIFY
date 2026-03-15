import { useState } from 'react';
import ZenAssistant from './components/ZenAssistant';
import ProductLocation from './components/ProductLocation';
import TotemSimulator from './components/TotemSimulator';

function App() {
  const [view, setView] = useState('assistant'); // assistant, location
  const [selectedProductId, setSelectedProductId] = useState(null);

  const showLocation = (productId) => {
    setSelectedProductId(productId);
    setView('location');
  };

  return (
    <TotemSimulator>
      <div style={{ height: '100%', width: '100%' }}>
        {view === 'assistant' && (
          <ZenAssistant onShowLocation={showLocation} />
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
