import React from 'react';
import { Bell, User } from 'lucide-react';

const Topbar = () => {
    return (
        <header className="h-20 w-full flex items-center justify-between px-8 z-40 sticky top-0">
            <div className="flex-1"></div>

            <div className="flex items-center gap-4">
                {/* Blockchain Status Widget */}
                <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 border border-white/60 shadow-sm backdrop-blur-xl bg-white/40">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></div>
                    <span className="text-sm font-medium text-slate-700">Mainnet Connected</span>
                </div>

                {/* Notif */}
                <button className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-white/80 transition-all shadow-sm">
                    <Bell className="w-5 h-5" />
                </button>

                {/* User Card */}
                <div className="glass-panel pl-2 pr-4 py-1.5 rounded-full flex items-center gap-3 border border-white/60 shadow-sm bg-white/40 ml-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 flex items-center justify-center text-white shadow-inner">
                        <User className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800 leading-tight">Gov Admin</span>
                        <span className="text-[10px] font-mono text-slate-500 leading-tight">0x71C...3E4V</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
