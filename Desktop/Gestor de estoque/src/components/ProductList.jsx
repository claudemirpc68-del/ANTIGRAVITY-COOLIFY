import { useState } from 'react';

export default function ProductList({ products, categories, searchTerm, onSearchChange, categoryFilter, onCategoryChange, onDelete, onEdit }) {

    const getStockBadge = (p) => {
        if (p.quantity === 0) return <span className="badge danger">🚫 Esgotado</span>;
        if (p.quantity <= p.minStock) return <span className="badge warning">⚠️ Baixo</span>;
        return <span className="badge ok">✅ Normal</span>;
    };

    return (
        <div className="card">
            <div className="card-header" style={{ flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                <div className="card-title">📋 Lista de Produtos</div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
                    <div className="search-bar">
                        <span className="search-icon">🔍</span>
                        <input
                            className="input"
                            type="text"
                            placeholder="Buscar por nome ou código..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    <select
                        className="input"
                        value={categoryFilter}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        style={{ minWidth: 140 }}
                    >
                        <option value="">Todas categorias</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div className="table-wrapper">
                {products.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <div className="empty-title">Nenhum produto encontrado</div>
                        <div className="empty-desc">Adicione produtos ou ajuste seus filtros de busca.</div>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Código de Barras</th>
                                <th>Categoria</th>
                                <th>Qtd</th>
                                <th>Preço</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id}>
                                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                                    <td><code style={{ color: 'var(--accent-blue)', fontSize: '0.8rem' }}>{p.barcode}</code></td>
                                    <td><span className="badge info">{p.category || 'Sem cat.'}</span></td>
                                    <td style={{ fontWeight: 700, color: p.quantity <= p.minStock ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                                        {p.quantity} {p.unit || 'un'}
                                    </td>
                                    <td>R$ {(p.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                    <td>{getStockBadge(p)}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            <button className="btn btn-sm btn-icon" title="Editar" onClick={() => onEdit(p)}>✏️</button>
                                            <button className="btn btn-sm btn-icon btn-danger" title="Excluir" onClick={() => onDelete(p.id)}>🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
