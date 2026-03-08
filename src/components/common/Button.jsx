import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
    const baseStyles = 'padding: 12px 24px; border-radius: var(--border-radius-md); font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; justify-content: center; gap: 8px;';

    const variants = {
        primary: 'background: var(--assai-orange); color: white; border: none; box-shadow: 0 4px 12px rgba(255, 102, 0, 0.2);',
        secondary: 'background: var(--text-primary); color: white; border: none;',
        outline: 'background: transparent; color: var(--assai-orange); border: 2px solid var(--assai-orange);',
        ghost: 'background: transparent; color: var(--text-secondary); border: none;'
    };

    return (
        <button
            onClick={onClick}
            className={`${className}`}
            style={{
                ...Object.fromEntries(baseStyles.split(';').filter(s => s.trim()).map(s => s.split(':').map(x => x.trim()))),
                ...Object.fromEntries(variants[variant].split(';').filter(s => s.trim()).map(s => s.split(':').map(x => x.trim()))),
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
