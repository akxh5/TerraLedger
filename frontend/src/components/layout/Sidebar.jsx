import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FilePlus, Search, ArrowRightLeft, History, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import Logo from '../ui/Logo';

const allNavItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['REGISTRAR', 'OWNER'] },
    { name: 'Register Land', path: '/register', icon: FilePlus, roles: ['REGISTRAR'] },
    { name: 'Submit Request', path: '/submit-land', icon: FilePlus, roles: ['OWNER'] },
    { name: 'Transfer Ownership', path: '/transfer', icon: ArrowRightLeft, roles: ['REGISTRAR', 'OWNER'] },
    { name: 'Search Record', path: '/search', icon: Search, roles: ['REGISTRAR', 'OWNER'] },
    { name: 'Ownership History', path: '/history', icon: History, roles: ['REGISTRAR', 'OWNER'] },
];

const Sidebar = () => {
    const [backendStatus, setBackendStatus] = useState('checking');

    // Get current user role
    let userRole = 'OWNER';
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.role) userRole = user.role;
    } catch {}

    const navItems = allNavItems.filter(item => item.roles.includes(userRole));

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const res = await axios.get('http://localhost:8080/health');
                setBackendStatus(res.data?.status === 'UP' ? 'connected' : 'error');
            } catch {
                setBackendStatus('error');
            }
        };
        checkHealth();
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    const statusColor = backendStatus === 'connected' ? 'bg-emerald-400' : backendStatus === 'error' ? 'bg-red-400' : 'bg-amber-400';
    const statusText = backendStatus === 'connected' ? 'Node: Active' : backendStatus === 'error' ? 'Node: Offline' : 'Checking...';

    return (
        <aside className="w-72 fixed inset-y-0 left-0 z-50 p-6">
            <div className="glass-panel w-full h-full rounded-3xl flex flex-col pt-8 pb-8 px-4">
                <div className="flex items-center justify-center gap-3 px-2 mb-10">
                    <Logo className="w-10 h-10 drop-shadow-md" />
                    <span className="font-display text-2xl font-semibold tracking-wide text-slate-100">
                        TerraLedger
                    </span>
                </div>

                {/* Role Badge */}
                <div className="px-4 mb-8">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 ${
                        userRole === 'REGISTRAR' ? 'text-blue-300' : 'text-indigo-300'
                    }`}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {userRole}
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium border ${isActive
                                    ? 'bg-blue-500/20 text-blue-300 border-blue-400/30 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]'
                                    : 'border-transparent text-slate-300 hover:bg-white/10 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5 opacity-90" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto px-4">
                    <div className="p-4 rounded-xl bg-slate-900/40 border border-white/10 text-sm shadow-inner backdrop-blur-md">
                        <p className="font-semibold text-slate-200 mb-1 tracking-wide">Network Graph</p>
                        <p className="text-slate-400 text-xs">{backendStatus === 'connected' ? 'Connected to EVM Node' : 'Attempting handshake...'}</p>
                        <div className="flex items-center gap-2 mt-3">
                            <span className={`w-2 h-2 rounded-full ${statusColor} shadow-[0_0_8px_rgba(255,255,255,0.3)] animate-pulse`}></span>
                            <span className="text-xs font-mono text-slate-300 opacity-80">{statusText}</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
