export const products = [
  {
    id: '1',
    name: 'Suco Maguary Uva 1L',
    barcode: '7891234567890',
    price: 7.99,
    stock: 154,
    location: { corridor: '5', shelf: '2' },
    category: 'Sucos e Bebidas',
    image: 'maguary_uva.jpg',
    related: ['2', '6']
  },
  {
    id: '2',
    name: 'Suco Maguary Laranja 1L',
    barcode: '7891234567891',
    price: 7.99,
    stock: 89,
    location: { corridor: '5', shelf: '2' },
    category: 'Sucos e Bebidas',
    image: 'maguary_laranja.jpg',
    related: ['1']
  },
  {
    id: '3',
    name: 'Óleo de Soja Soya 900ml',
    barcode: '7891234567892',
    price: 6.45,
    stock: 500,
    location: { corridor: '2', shelf: '1' },
    category: 'Mercearia',
    image: 'oleo_soya.jpg',
    related: ['4']
  },
  {
    id: '4',
    name: 'Arroz Tipo 1 Assaí 5kg',
    barcode: '7891234567893',
    price: 28.90,
    stock: 200,
    location: { corridor: '1', shelf: '3' },
    category: 'Mercearia',
    image: 'arroz_assai.jpg',
    related: ['3']
  },
  {
    id: '5',
    name: 'Biscoito Panco Rosquinha Coco',
    barcode: '7891234567894',
    price: 4.85,
    stock: 120,
    location: { corridor: '8', shelf: '4' },
    category: 'Biscoitos',
    image: 'panco_coco.jpg',
    related: ['7']
  },
  {
    id: '6',
    name: 'Suco Del Valle Uva 1L',
    barcode: '7891234567895',
    price: 8.50,
    stock: 95,
    location: { corridor: '5', shelf: '3' },
    category: 'Sucos e Bebidas',
    image: 'del_valle_uva.jpg',
    related: ['1']
  },
  {
    id: '7',
    name: 'Pão de Mel Panco 200g',
    barcode: '7891234567896',
    price: 6.90,
    stock: 60,
    location: { corridor: '8', shelf: '5' },
    category: 'Biscoitos',
    image: 'panco_pao_mel.jpg',
    related: ['5']
  },
  {
    id: '8',
    name: 'Cereal Matinal Corn Flakes 500g',
    barcode: '7891234567897',
    price: 14.50,
    stock: 45,
    location: { corridor: '11', shelf: '1' },
    category: 'Cereais',
    image: 'cereal_corn.jpg',
    related: ['9']
  },
  {
    id: '9',
    name: 'Aveia em Flocos 400g',
    barcode: '7891234567898',
    price: 5.20,
    stock: 80,
    location: { corridor: '11', shelf: '2' },
    category: 'Cereais',
    image: 'aveia.jpg',
    related: ['8']
  },
  {
    id: '10',
    name: 'Água Tônica FYS Laranja Siciliano 350ml',
    barcode: '7896052607228',
    price: 3.49,
    stock: 240,
    location: { corridor: '6', shelf: '2' },
    category: 'Sucos e Bebidas',
    image: 'fys_laranja.jpg',
    related: ['1', '6']
  },
  {
    id: '11',
    name: 'Granola Tradicional 1kg',
    barcode: '7891234567899',
    price: 18.90,
    stock: 55,
    location: { corridor: '11', shelf: '3' },
    category: 'Cereais',
    image: 'granola.jpg',
    related: ['8', '9']
  },
  {
    id: '12',
    name: 'Seara Big Tekitos 900g',
    barcode: '7894904283361',
    price: 24.90,
    stock: 85,
    location: { corridor: '14', shelf: '1' }, // Corredor de Congelados
    category: 'Congelados',
    image: 'big_tekitos.jpg',
    related: ['13']
  },
  {
    id: '13',
    name: 'H2OH! Limoneto 350ml',
    barcode: '7892840823986',
    price: 3.25,
    stock: 310,
    location: { corridor: '6', shelf: '1' }, // Corredor de Bebidas
    category: 'Sucos e Bebidas',
    image: 'h2oh_limoneto.jpg',
    related: ['10', '1']
  }
];

export const promotions = [
  {
    id: 'p1',
    title: 'Festival de Bebidas',
    description: 'Leve 3 Sucos Maguary e pague apenas R$ 19,90',
    targetCategory: 'Sucos e Bebidas',
    discount: 'Leve 3 Pague 2'
  },
  {
    id: 'p2',
    title: 'OFERTA MERCEARIA',
    description: 'Óleo Soya com preço exclusivo no App Assaí',
    targetCategory: 'Mercearia',
    discount: 'R$ 5,99 no App'
  },
  {
    id: 'p3',
    title: 'LANCHE DA TARDE',
    description: 'Biscoitos Panco com 15% de desconto na segunda unidade',
    targetCategory: 'Biscoitos',
    discount: '15% OFF'
  }
];
