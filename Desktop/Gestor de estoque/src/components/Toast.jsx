import { useState, useEffect, useCallback } from 'react';

export function useToast() {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    return { toasts, addToast };
}

export function ToastContainer({ toasts }) {
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };

    return (
        <div className="toast-container">
            {toasts.map((t) => (
                <div key={t.id} className={`toast ${t.type}`}>
                    <span className="toast-icon">{icons[t.type] || 'ℹ️'}</span>
                    <span className="toast-message">{t.message}</span>
                </div>
            ))}
        </div>
    );
}
