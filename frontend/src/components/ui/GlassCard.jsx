import React from 'react';

const GlassCard = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`glass-panel rounded-2xl p-6 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default GlassCard;
