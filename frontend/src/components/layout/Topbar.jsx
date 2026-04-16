import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, LogOut } from 'lucide-react';
import { authApi } from '../../api/land';
import toast from 'react-hot-toast';

const Topbar = () => {
    const navigate = useNavigate();
    const [user] = useState(() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });

    const handleLogout = () => {
        authApi.logout();
        toast.success('Logged out securely');
        navigate('/login');
    };

    const displayName = user?.email
        ? user.email.split('@')[0]
        : user?.walletAddress
            ? `${user.walletAddress.substring(0, 6)}...${user.walletAddress.slice(-4)}`
            : 'User';

    return (
        <header className="h-20 w-full flex items-center justify-between px-8 z-40 sticky top-0 backdrop-blur-md bg-slate-900/10 border-b border-white/5">
            <div className="flex-1"></div>

            <div className="flex items-center gap-5">
                {/* Notification */}
                <button className="w-10 h-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <Bell className="w-4 h-4" />
                </button>

                {/* User Card */}
                {user && (
                    <div className="flex items-center gap-3">
                        <div className="glass-panel pl-2 pr-5 py-1.5 rounded-full flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600/40 to-indigo-500/40 border border-blue-400/30 flex items-center justify-center text-blue-200 shadow-inner">
                                <User className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-100 leading-tight tracking-wide">{displayName}</span>
                                <span className={`text-[10px] uppercase font-mono tracking-wider leading-tight ${
                                    user.role === 'REGISTRAR' ? 'text-blue-400' : 'text-indigo-400'
                                }`}>{user.role}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                            title="Disconnect Session"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Topbar;
