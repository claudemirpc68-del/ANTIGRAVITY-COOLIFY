import { useState, useEffect } from 'react';
import Home from './components/Home';
import ZenAssistant from './components/ZenAssistant';
import ProductConsultation from './components/ProductConsultation';
import ProductLocation from './components/ProductLocation';
import Promotions from './components/Promotions';
import ProductRecognition from './components/ProductRecognition';
import TotemSimulator from './components/TotemSimulator';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [initialBarcode, setInitialBarcode] = useState(null);

  useEffect(() => {
    const handleNavigation = (e) => {
      const { view, productId, barcode } = e.detail;
      if (view) setCurrentView(view);
      if (productId) setSelectedProductId(productId);
      if (barcode) setInitialBarcode(barcode);
    };

    window.addEventListener('totem-navigate', handleNavigation);
    return () => window.removeEventListener('totem-navigate', handleNavigation);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home 
          onNavigate={(view) => setCurrentView(view)} 
          onConsultProduct={(barcode) => {
            setInitialBarcode(barcode);
            setCurrentView('consultation');
          }}
        />;
      case 'assistant':
        return <ZenAssistant onBack={() => setCurrentView('home')} />;
      case 'consultation':
        return <ProductConsultation 
          onBack={() => setCurrentView('home')} 
          onShowLocation={(id) => {
            setSelectedProductId(id);
            setCurrentView('location');
          }}
          initialBarcode={initialBarcode}
        />;
      case 'location':
        return <ProductLocation 
          productId={selectedProductId} 
          onBack={() => setCurrentView('recognition')} 
        />;
      case 'promotions':
        return <Promotions 
          onBack={() => setCurrentView('home')} 
          onConsultProduct={(barcode) => {
            setInitialBarcode(barcode);
            setCurrentView('consultation');
          }}
        />;
      case 'recognition':
        return <ProductRecognition 
          onBack={() => setCurrentView('home')}
          onShowLocation={(id) => {
            setSelectedProductId(id);
            setCurrentView('location');
          }}
          onConsultProduct={(barcode) => {
            setInitialBarcode(barcode);
            setCurrentView('consultation');
          }}
        />;
      default:
        return <Home onNavigate={(view) => setCurrentView(view)} />;
    }
  };

  return (
    <div className="app-container">
      <TotemSimulator>
        {renderView()}
      </TotemSimulator>
    </div>
  );
}

export default App;
