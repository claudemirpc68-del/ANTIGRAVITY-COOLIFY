import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
    const baseStyles = {
        padding: '12px 24px',
        borderRadius: 'var(--border-radius-md)',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
    };

    const variants = {
        primary: { background: 'var(--assai-orange)', color: 'white', border: 'none', boxShadow: '0 4px 12px rgba(255, 102, 0, 0.2)' },
        secondary: { background: 'var(--text-primary)', color: 'white', border: 'none' },
        outline: { background: 'transparent', color: 'var(--assai-orange)', border: '2px solid var(--assai-orange)' },
        ghost: { background: 'transparent', color: 'var(--text-secondary)', border: 'none' }
    };

    return (
        <button
            onClick={onClick}
            className={`${className}`}
            style={{
                ...baseStyles,
                ...variants[variant],
                ...(props.style || {})
            }}
            {...Object.keys(props).reduce((acc, key) => {
                if (key !== 'style') acc[key] = props[key];
                return acc;
            }, {})}
        >
            {children}
        </button>
    );
};

export default Button;
