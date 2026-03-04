import { useState, useEffect, useCallback } from 'react';
import { db, getAllProducts, addProduct, updateProductQuantity, deleteProduct, getStats, getLowStockProducts, getMovements } from '../db/db';

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({ totalProducts: 0, totalItems: 0, lowStock: 0, outOfStock: 0, totalValue: 0, categories: {} });
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const [allProducts, allStats, lowStock, recentMovements] = await Promise.all([
                getAllProducts(),
                getStats(),
                getLowStockProducts(),
                getMovements()
            ]);
            setProducts(allProducts);
            setStats(allStats);
            setLowStockProducts(lowStock);
            setMovements(recentMovements);
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { refresh(); }, [refresh]);

    const handleAddProduct = useCallback(async (product) => {
        await addProduct(product);
        await refresh();
    }, [refresh]);

    const handleUpdateQuantity = useCallback(async (barcode, qty, type, note) => {
        const result = await updateProductQuantity(barcode, qty, type, note);
        await refresh();
        return result;
    }, [refresh]);

    const handleDeleteProduct = useCallback(async (id) => {
        await deleteProduct(id);
        await refresh();
    }, [refresh]);

    const filteredProducts = products.filter(p => {
        const matchesSearch = !searchTerm ||
            p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.barcode?.includes(searchTerm);
        const matchesCategory = !categoryFilter || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

    return {
        products: filteredProducts,
        allProducts: products,
        stats,
        lowStockProducts,
        movements,
        loading,
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        categories,
        addProduct: handleAddProduct,
        updateQuantity: handleUpdateQuantity,
        deleteProduct: handleDeleteProduct,
        refresh
    };
}
