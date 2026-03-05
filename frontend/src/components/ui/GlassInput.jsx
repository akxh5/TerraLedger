import React, { forwardRef } from 'react';

const GlassInput = forwardRef(({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-slate-700 ml-1">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                ref={ref}
                className={`glass-input px-4 py-2.5 rounded-xl text-slate-800 placeholder:text-slate-400 w-full ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-200' : ''}`}
                {...props}
            />
            {error && (
                <span className="text-xs text-red-500 ml-1">{error}</span>
            )}
        </div>
    );
});

GlassInput.displayName = 'GlassInput';

export default GlassInput;
