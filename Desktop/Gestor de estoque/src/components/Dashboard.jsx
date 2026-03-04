export default function Dashboard({ stats, lowStockProducts }) {
    const cards = [
        { icon: '📦', label: 'Total Produtos', value: stats.totalProducts, color: 'blue' },
        { icon: '🏷️', label: 'Itens em Estoque', value: stats.totalItems.toLocaleString('pt-BR'), color: 'purple' },
        { icon: '💰', label: 'Valor Total', value: `R$ ${stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, color: 'green' },
        { icon: '⚠️', label: 'Estoque Baixo', value: stats.lowStock, color: 'amber' },
        { icon: '🚫', label: 'Sem Estoque', value: stats.outOfStock, color: 'red' },
    ];

    return (
        <>
            <div className="stats-grid">
                {cards.map((card) => (
                    <div key={card.label} className={`stat-card ${card.color}`}>
                        <div className="stat-icon">{card.icon}</div>
                        <div className="stat-value">{card.value}</div>
                        <div className="stat-label">{card.label}</div>
                    </div>
                ))}
            </div>

            {lowStockProducts.length > 0 && (
                <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                    <div className="card-header">
                        <div className="card-title">🔔 Alertas de Estoque Baixo</div>
                        <span className="badge danger">{lowStockProducts.length} alertas</span>
                    </div>
                    <div className="card-body">
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Produto</th>
                                        <th>Código</th>
                                        <th>Atual</th>
                                        <th>Mínimo</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowStockProducts.map((p) => (
                                        <tr key={p.id}>
                                            <td style={{ fontWeight: 600 }}>{p.name}</td>
                                            <td><code style={{ color: 'var(--accent-blue)', fontSize: '0.8rem' }}>{p.barcode}</code></td>
                                            <td style={{ fontWeight: 700 }}>{p.quantity}</td>
                                            <td>{p.minStock}</td>
                                            <td>
                                                <span className={`badge ${p.quantity === 0 ? 'danger' : 'warning'}`}>
                                                    {p.quantity === 0 ? '🚫 Esgotado' : '⚠️ Baixo'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
