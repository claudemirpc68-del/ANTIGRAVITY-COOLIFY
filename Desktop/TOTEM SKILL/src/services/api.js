import { products, promotions } from './mockData';

export const get_product_info = (input) => {
  const product = products.find(p => 
    p.name.toLowerCase().includes(input.toLowerCase()) || 
    p.barcode === input
  );
  
  if (product) {
    log_analytics('product_lookup', { productId: product.id, query: input });
  }
  
  return product;
};

export const get_location = (productId) => {
  const product = products.find(p => p.id === productId);
  if (product) {
    log_analytics('location_lookup', { productId });
    return product.location;
  }
  return null;
};

export const upsell_engine = (productId) => {
  const product = products.find(p => p.id === productId);
  if (!product) return [];

  const suggested = product.related.map(id => products.find(p => p.id === id));
  
  // Check for category promotions
  const relevantPromotions = promotions.filter(p => p.targetCategory === product.category);
  
  return {
    items: suggested,
    promotions: relevantPromotions
  };
};

export const recognize_product_from_image = (index) => {
  // Simulate AI processing - returning product based on the "scanned" scenario
  const scenarioProductMap = {
    0: '1', // Maguary Uva
    1: '6', // Del Valle Uva
    2: '5', // Panco Rosquinha
    4: '3'  // Óleo Soya
  };
  
  const productId = scenarioProductMap[index] || '1';
  const product = products.find(p => p.id === productId);
  
  if (product) {
    log_analytics('image_recognition', { productId: product.id, scenarioIndex: index });
  }
  
  return product;
};

export const log_analytics = (type, data) => {
  const log = {
    timestamp: new Date().toISOString(),
    event: type,
    details: data
  };
  
  // Simulated analytics log
  const existingLogs = JSON.parse(localStorage.getItem('totem_logs') || '[]');
  existingLogs.push(log);
  localStorage.setItem('totem_logs', JSON.stringify(existingLogs));
  
  console.log('[Analytics]', log);
};
