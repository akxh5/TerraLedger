import React from 'react';

const GlassButton = ({ children, className = '', variant = 'primary', ...props }) => {
    const baseStyle = "glass-button px-6 py-2 rounded-xl font-medium flex items-center justify-center gap-2";

    // Example variant tweaks, though mostly handled by glass-button class
    const variantStyles = {
        primary: "text-blue-600 border-blue-200/50 hover:bg-blue-50/50",
        secondary: "text-slate-600 border-slate-200/50 hover:bg-slate-50/50",
        danger: "text-red-500 border-red-200/50 hover:bg-red-50/50"
    };

    return (
        <button
            className={`${baseStyle} ${variantStyles[variant] || variantStyles.primary} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default GlassButton;
