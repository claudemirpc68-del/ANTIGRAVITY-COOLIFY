import React from 'react';

const Card = ({ children, className = '', padding = '20px', ...props }) => {
    return (
        <div
            className={`glass-card ${className}`}
            style={{ padding }}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
