import React, { forwardRef } from 'react';

interface LiquidGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

const LiquidGlassCard = forwardRef<HTMLDivElement, LiquidGlassCardProps>(({ children, className = '', delay = 0, ...props }, ref) => {
    // Add staggered animation delay class if specified
    const delayClass = delay > 0 ? `animate-stagger-${delay}` : '';

    return (
        <div
            ref={ref}
            className={`liquid-glass-card rounded-2xl p-6 relative overflow-hidden animate-slide-up opacity-0 ${delayClass} ${className}`}
            {...props}
        >
            {/* Subtle inner top highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            
            {/* Soft inner glow gradient at the top right to simulate light reflection */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
});

LiquidGlassCard.displayName = 'LiquidGlassCard';

export default LiquidGlassCard;
