import { products, promotions } from './mockData';

export const analyzeIntent = (input) => {
  const normalized = input.toLowerCase();
  
  // 1. Check for specific product names or categories
  const target = products.find(p => 
    normalized.includes(p.name.toLowerCase()) || 
    normalized.includes(p.category.toLowerCase())
  );

  // 2. Simple NLP for "leite sem lactose" or specific features
  if (normalized.includes('leite') && normalized.includes('lactose')) {
    // Return a specific lactose-free milk if we had one, or a generic milk
    const milk = products.find(p => p.name.includes('Leite')) || products[0];
    return {
      type: 'product_info',
      text: `Entendido! Você busca leite sem lactose. Temos o ${milk.name} no Corredor ${milk.location.corridor}, prateleira ${milk.location.shelf}. O preço é R$ ${milk.price.toFixed(2).replace('.', ',')}.`,
      data: milk,
      promotion: promotions.find(p => p.targetCategory === milk.category)
    };
  }

  if (target) {
    const promo = promotions.find(p => p.targetCategory === target.category);
    const promoText = promo ? ` Aproveite: ${promo.description}!` : '';
    
    return {
      type: 'product_info',
      text: `O ${target.name} custa R$ ${target.price.toFixed(2).replace('.', ',')} e está no Corredor ${target.location.corridor}, prateleira ${target.location.shelf}.${promoText}`,
      data: target,
      promotion: promo
    };
  }

  // 3. Fallback
  return {
    type: 'fallback',
    text: "Desculpe, não consegui encontrar exatamente o que você descreveu. Tente dizer o nome de um produto ou categoria!",
    data: null
  };
};

export const speak = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
};
