import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FilePlus, Search, ArrowRightLeft, History } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Register Land', path: '/register', icon: FilePlus },
        { name: 'Transfer Ownership', path: '/transfer', icon: ArrowRightLeft },
        { name: 'Search Record', path: '/search', icon: Search },
        { name: 'Ownership History', path: '/history', icon: History },
    ];

    return (
        <aside className="w-72 fixed inset-y-0 left-0 z-50 p-6">
            <div className="glass-panel w-full h-full rounded-3xl flex flex-col pt-8 pb-8 px-4 border-r-0 border shadow-2xl shadow-blue-900/5">
                <div className="flex items-center gap-3 px-4 mb-12">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-400 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold text-xl">
                        T
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                        TerraLedger
                    </span>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${isActive
                                    ? 'bg-white/60 text-blue-600 shadow-sm border border-white/80'
                                    : 'text-slate-600 hover:bg-white/40 hover:text-slate-900'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5 opacity-80" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto px-4">
                    <div className="glass-panel p-4 rounded-xl bg-gradient-to-b from-white/40 to-white/10 border-white/60 text-sm shadow-sm backdrop-blur-xl">
                        <p className="font-semibold text-slate-800 mb-1">Government Portal</p>
                        <p className="text-slate-500 text-xs">Connected to Mainnet</p>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></span>
                            <span className="text-xs font-mono text-slate-600">Sync: 100%</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
