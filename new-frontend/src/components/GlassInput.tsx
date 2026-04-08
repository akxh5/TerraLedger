import React, { forwardRef } from 'react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-white/80 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                <input
                    id={inputId}
                    ref={ref}
                    className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 transition-all duration-300 outline-none
                    focus:bg-white/10 focus:border-[#00E69A]/50 focus:shadow-[0_0_15px_rgba(0,230,154,0.1)] 
                    hover:border-white/20 hover:bg-white/10
                    ${error ? 'border-red-500/50 focus:border-red-500/80 focus:shadow-[0_0_15px_rgba(239,68,68,0.1)]' : ''}`}
                    {...props}
                />
            </div>
            {error && (
                <span className="text-xs text-red-400 ml-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                    <span className="w-1 h-1 rounded-full bg-red-400"></span>
                    {error}
                </span>
            )}
        </div>
    );
});

GlassInput.displayName = 'GlassInput';

export default GlassInput;
