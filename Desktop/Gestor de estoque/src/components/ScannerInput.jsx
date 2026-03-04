import { useState, useRef, useEffect } from 'react';

export default function ScannerInput({ onScan }) {
    const [value, setValue] = useState('');
    const [active, setActive] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && value.trim()) {
            onScan(value.trim());
            setValue('');
        }
    };

    return (
        <div className={`scanner-bar ${active ? 'active' : ''}`}>
            <div className="scanner-indicator" />
            <span style={{ fontSize: '1.1rem' }}>📡</span>
            <input
                ref={inputRef}
                className="scanner-input"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setActive(true)}
                onBlur={() => setActive(false)}
                placeholder="Leia o código de barras ou digite aqui..."
                autoComplete="off"
            />
            {value && (
                <button className="btn btn-sm btn-primary" onClick={() => { onScan(value.trim()); setValue(''); }}>
                    Buscar
                </button>
            )}
        </div>
    );
}
