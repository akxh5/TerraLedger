import React, { forwardRef } from 'react';

interface LiquidGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'nav';
}

const LiquidGlassButton = forwardRef<HTMLButtonElement, LiquidGlassButtonProps>(({ 
    children, 
    variant = 'primary', 
    className = '', 
    ...props 
}, ref) => {
    const baseStyles = "relative px-6 py-3 font-semibold rounded-full overflow-hidden transition-all duration-[400ms] hover:scale-[1.02] active:scale-[0.98] outline-none flex items-center justify-center gap-2 group";
    
    const variants = {
        primary: "bg-[#00E69A]/10 text-[#00E69A] border border-[#00E69A]/30 hover:bg-[#00E69A]/20 hover:border-[#00E69A]/50 hover:shadow-[0_0_20px_rgba(0,230,154,0.3)] backdrop-blur-md",
        secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-md",
        nav: "bg-transparent text-white/80 border border-transparent hover:text-white hover:bg-white/5 hover:border-white/10 transition-colors duration-300 px-4 py-2"
    };

    return (
        <button
            ref={ref}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
            <span className="relative z-10">{children}</span>
        </button>
    );
});

LiquidGlassButton.displayName = 'LiquidGlassButton';

export default LiquidGlassButton;
