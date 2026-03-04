import { useState } from 'react';
import { useProducts } from './hooks/useProducts';
import { db } from './db/db';
import ScannerInput from './components/ScannerInput';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import ProductModal from './components/ProductModal';
import MovementHistory from './components/MovementHistory';
import { useToast, ToastContainer } from './components/Toast';
import './index.css';

const VIEWS = {
  DASHBOARD: 'dashboard',
  PRODUCTS: 'products',
  MOVEMENTS: 'movements',
};

export default function App() {
  const {
    products, allProducts, stats, lowStockProducts, movements, loading,
    searchTerm, setSearchTerm, categoryFilter, setCategoryFilter,
    categories, addProduct, updateQuantity, deleteProduct, refresh
  } = useProducts();

  const { toasts, addToast } = useToast();
  const [view, setView] = useState(VIEWS.DASHBOARD);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleScan = async (barcode) => {
    try {
      const product = await db.products.where('barcode').equals(barcode).first();
      if (product) {
        await updateQuantity(barcode, 1, 'entrada', 'Leitura do coletor');
        addToast(`✅ +1 ${product.name} (Total: ${product.quantity + 1})`, 'success');
      } else {
        setEditProduct({ barcode });
        setShowModal(true);
        addToast(`Código ${barcode} não encontrado. Cadastre o produto.`, 'info');
      }
    } catch (err) {
      addToast(`Erro: ${err.message}`, 'error');
    }
  };

  const handleSaveProduct = async (product) => {
    try {
      if (product.id) {
        await db.products.update(product.id, product);
        addToast(`Produto "${product.name}" atualizado!`, 'success');
      } else {
        await addProduct(product);
        addToast(`Produto "${product.name}" adicionado!`, 'success');
      }
      setShowModal(false);
      setEditProduct(null);
    } catch (err) {
      if (err.message?.includes('barcode')) {
        addToast('Código de barras já cadastrado!', 'error');
      } else {
        addToast(`Erro: ${err.message}`, 'error');
      }
    }
  };

  const handleDelete = async (id) => {
    const product = allProducts.find(p => p.id === id);
    if (window.confirm(`Excluir "${product?.name}"? Esta ação não pode ser desfeita.`)) {
      await deleteProduct(id);
      addToast(`Produto "${product?.name}" excluído.`, 'success');
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const navItems = [
    { id: VIEWS.DASHBOARD, icon: '📊', label: 'Dashboard' },
    { id: VIEWS.PRODUCTS, icon: '📦', label: 'Produtos', badge: stats.totalProducts || null },
    { id: VIEWS.MOVEMENTS, icon: '📜', label: 'Movimentações' },
  ];

  return (
    <div className="app-layout">
      <ToastContainer toasts={toasts} />

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">GE</div>
          <div>
            <div className="sidebar-title">Gestor de Estoque</div>
            <div className="sidebar-subtitle">Controle Inteligente</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${view === item.id ? 'active' : ''}`}
              onClick={() => { setView(item.id); setSidebarOpen(false); }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}

          <div style={{ flex: 1 }} />

          {stats.lowStock > 0 && (
            <div style={{
              padding: 'var(--space-md)',
              background: 'var(--accent-amber-glow)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              color: 'var(--accent-amber)'
            }}>
              ⚠️ {stats.lowStock} produto(s) com estoque baixo
            </div>
          )}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              {view === VIEWS.DASHBOARD && '📊 Dashboard'}
              {view === VIEWS.PRODUCTS && '📦 Produtos'}
              {view === VIEWS.MOVEMENTS && '📜 Movimentações'}
            </h1>
            <p className="page-subtitle">
              {view === VIEWS.DASHBOARD && 'Visão geral do seu estoque'}
              {view === VIEWS.PRODUCTS && `${stats.totalProducts} produtos cadastrados`}
              {view === VIEWS.MOVEMENTS && 'Histórico de entradas e saídas'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button className="btn btn-primary" onClick={() => { setEditProduct(null); setShowModal(true); }}>
              ➕ Novo Produto
            </button>
          </div>
        </div>

        <ScannerInput onScan={handleScan} />

        {loading ? (
          <div className="stats-grid">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton" style={{ height: 120 }} />)}
          </div>
        ) : (
          <>
            {view === VIEWS.DASHBOARD && (
              <Dashboard stats={stats} lowStockProducts={lowStockProducts} />
            )}

            {view === VIEWS.PRODUCTS && (
              <ProductList
                products={products}
                categories={categories}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            )}

            {view === VIEWS.MOVEMENTS && (
              <MovementHistory movements={movements} allProducts={allProducts} />
            )}
          </>
        )}
      </main>

      {/* MOBILE MENU */}
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* MODAL */}
      {showModal && (
        <ProductModal
          product={editProduct}
          onSave={handleSaveProduct}
          onClose={() => { setShowModal(false); setEditProduct(null); }}
        />
      )}
    </div>
  );
}
