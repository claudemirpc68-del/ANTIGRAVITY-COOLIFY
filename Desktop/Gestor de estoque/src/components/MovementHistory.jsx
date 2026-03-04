export default function MovementHistory({ movements, allProducts }) {
    const getProductName = (productId) => {
        const p = allProducts.find(prod => prod.id === productId);
        return p ? p.name : `ID ${productId}`;
    };

    const formatDate = (timestamp) => {
        const d = new Date(timestamp);
        return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    if (movements.length === 0) {
        return (
            <div className="card">
                <div className="card-header">
                    <div className="card-title">📜 Histórico de Movimentações</div>
                </div>
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <div className="empty-title">Nenhuma movimentação</div>
                    <div className="empty-desc">As entradas e saídas de estoque aparecerão aqui.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header">
                <div className="card-title">📜 Histórico de Movimentações</div>
                <span className="badge info">{movements.length} registros</span>
            </div>
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Data/Hora</th>
                            <th>Produto</th>
                            <th>Tipo</th>
                            <th>Quantidade</th>
                            <th>Observação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movements.map((m) => (
                            <tr key={m.id}>
                                <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {formatDate(m.timestamp)}
                                </td>
                                <td style={{ fontWeight: 600 }}>{getProductName(m.productId)}</td>
                                <td>
                                    <span className={`badge ${m.type === 'entrada' ? 'ok' : 'danger'}`}>
                                        {m.type === 'entrada' ? '📥 Entrada' : '📤 Saída'}
                                    </span>
                                </td>
                                <td style={{ fontWeight: 700 }}>{m.quantity}</td>
                                <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{m.note || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
