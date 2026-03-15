export const products = [
  {
    id: '1',
    name: 'Café Orgânico Torrado',
    barcode: '7891234567890',
    price: 34.90,
    stock: 24,
    location: { corridor: '12', shelf: '3' },
    category: 'Café',
    related: ['2', '5']
  },
  {
    id: '2',
    name: 'Filtro de Papel N102',
    barcode: '7891234567891',
    price: 8.50,
    stock: 50,
    location: { corridor: '12', shelf: '4' },
    category: 'Acessórios Café',
    related: ['1']
  },
  {
    id: '3',
    name: 'Detergente Neutro 500ml',
    barcode: '7891234567892',
    price: 2.99,
    stock: 100,
    location: { corridor: '4', shelf: '1' },
    category: 'Limpeza',
    related: ['4']
  },
  {
    id: '4',
    name: 'Esponja Multiuso 3un',
    barcode: '7891234567893',
    price: 4.20,
    stock: 80,
    location: { corridor: '4', shelf: '2' },
    category: 'Limpeza',
    related: ['3']
  },
  {
    id: '5',
    name: 'Açúcar Demerara 1kg',
    barcode: '7891234567894',
    price: 12.90,
    stock: 45,
    location: { corridor: '8', shelf: '2' },
    category: 'Mercearia',
    related: ['1']
  }
];

export const promotions = [
  {
    id: 'p1',
    title: 'Leve 3, Pague 2',
    description: 'Em todos os detergentes da marca Prático',
    targetCategory: 'Limpeza'
  },
  {
    id: 'p2',
    title: '15% de Desconto',
    description: 'No segundo pacote de café orgânico',
    targetCategory: 'Café'
  }
];
