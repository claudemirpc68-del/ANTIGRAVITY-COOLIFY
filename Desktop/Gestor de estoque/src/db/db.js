import Dexie from 'dexie';

export const db = new Dexie('GestorEstoqueDB');

db.version(1).stores({
  products: '++id, name, &barcode, category, quantity, minStock, price, unit, createdAt',
  movements: '++id, productId, type, quantity, timestamp, note'
});

// Helpers
export async function addProduct(product) {
  return db.products.add({
    ...product,
    quantity: product.quantity || 0,
    minStock: product.minStock || 5,
    createdAt: new Date().toISOString()
  });
}

export async function updateProductQuantity(barcode, quantityChange, type = 'entrada', note = '') {
  return db.transaction('rw', db.products, db.movements, async () => {
    const product = await db.products.where('barcode').equals(barcode).first();
    if (!product) throw new Error(`Produto com código ${barcode} não encontrado.`);

    const newQuantity = type === 'entrada'
      ? product.quantity + quantityChange
      : product.quantity - quantityChange;

    await db.products.update(product.id, { quantity: Math.max(0, newQuantity) });

    await db.movements.add({
      productId: product.id,
      type,
      quantity: quantityChange,
      timestamp: new Date().toISOString(),
      note
    });

    return { ...product, quantity: Math.max(0, newQuantity) };
  });
}

export async function getAllProducts() {
  return db.products.toArray();
}

export async function getProductByBarcode(barcode) {
  return db.products.where('barcode').equals(barcode).first();
}

export async function deleteProduct(id) {
  return db.transaction('rw', db.products, db.movements, async () => {
    await db.movements.where('productId').equals(id).delete();
    await db.products.delete(id);
  });
}

export async function getMovements(productId = null, limit = 50) {
  let collection = db.movements.orderBy('timestamp').reverse();
  if (productId) {
    collection = db.movements.where('productId').equals(productId).reverse();
  }
  return collection.limit(limit).toArray();
}

export async function getLowStockProducts() {
  return db.products.filter(p => p.quantity <= p.minStock).toArray();
}

export async function getStats() {
  const products = await db.products.toArray();
  const totalProducts = products.length;
  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStock = products.filter(p => p.quantity <= p.minStock).length;
  const outOfStock = products.filter(p => p.quantity === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0) * p.quantity, 0);

  const categories = {};
  products.forEach(p => {
    const cat = p.category || 'Sem categoria';
    if (!categories[cat]) categories[cat] = 0;
    categories[cat]++;
  });

  return { totalProducts, totalItems, lowStock, outOfStock, totalValue, categories };
}
