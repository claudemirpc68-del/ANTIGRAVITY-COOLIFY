import { useState, useEffect } from 'react';

const emptyProduct = {
    name: '', barcode: '', category: '', quantity: 0, minStock: 5, price: 0, unit: 'un'
};

const CATEGORIES = [
    'Alimentos', 'Bebidas', 'Limpeza', 'Higiene', 'Laticínios', 'Carnes',
    'Hortifruti', 'Padaria', 'Congelados', 'Grãos', 'Outros'
];

export default function ProductModal({ product, onSave, onClose }) {
    const [form, setForm] = useState(emptyProduct);
    const isEdit = !!product?.id;

    useEffect(() => {
        if (product) setForm({ ...emptyProduct, ...product });
    }, [product]);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.barcode.trim()) return;
        onSave({
            ...form,
            quantity: Number(form.quantity) || 0,
            minStock: Number(form.minStock) || 5,
            price: Number(form.price) || 0
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">{isEdit ? '✏️ Editar Produto' : '➕ Novo Produto'}</div>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-grid">
                            <div className="input-group full-width">
                                <label>Nome do Produto *</label>
                                <input className="input" value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Ex: Arroz Integral 1kg" required />
                            </div>
                            <div className="input-group">
                                <label>Código de Barras *</label>
                                <input className="input" value={form.barcode} onChange={(e) => handleChange('barcode', e.target.value)} placeholder="Ex: 7891234567890" required />
                            </div>
                            <div className="input-group">
                                <label>Categoria</label>
                                <select className="input" value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
                                    <option value="">Selecione...</option>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Quantidade</label>
                                <input className="input" type="number" min="0" value={form.quantity} onChange={(e) => handleChange('quantity', e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Estoque Mínimo</label>
                                <input className="input" type="number" min="0" value={form.minStock} onChange={(e) => handleChange('minStock', e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Preço (R$)</label>
                                <input className="input" type="number" min="0" step="0.01" value={form.price} onChange={(e) => handleChange('price', e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Unidade</label>
                                <select className="input" value={form.unit} onChange={(e) => handleChange('unit', e.target.value)}>
                                    <option value="un">Unidade</option>
                                    <option value="kg">Quilograma</option>
                                    <option value="g">Grama</option>
                                    <option value="L">Litro</option>
                                    <option value="ml">Mililitro</option>
                                    <option value="cx">Caixa</option>
                                    <option value="pct">Pacote</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary">{isEdit ? 'Salvar Alterações' : 'Adicionar Produto'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
