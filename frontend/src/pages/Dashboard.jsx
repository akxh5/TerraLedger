import React, { useState, useEffect } from 'react';
import GlassCard from '../components/ui/GlassCard';
import { Activity, Database, FileText, ArrowRight, CheckCircle } from 'lucide-react';
import { landApi } from '../api/land';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [user] = useState(() => {
        try {
            const saved = localStorage.getItem('user');
            return saved ? JSON.parse(saved) : null;
        } catch { return null; }
    });

    const isRegistrar = user?.role === 'REGISTRAR';

    const [lands, setLands] = useState([]);
    const [stats, setStats] = useState({
        totalLands: 0,
        recentTransactions: [],
        counts: { approved: 0, pending: 0 }
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch personal requests/properties
            const landData = isRegistrar ? await landApi.getPendingRequests() : await landApi.getMyRequests();
            setLands(landData);

            // Fetch global stats
            const statsData = await landApi.getStats();
            setStats(statsData);
        } catch (error) {
            // Silently fail or handled via UI state
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, []);

    const handleApprove = async (id) => {
        const toastId = toast.loading('Executing smart contract...', {
            style: { background: '#1e293b', color: '#fff' }
        });
        try {
            await landApi.approveLandRequest(id);
            toast.success('Request approved', { id: toastId });
            fetchData();
        } catch (error) {
            toast.error('Approval failed', { id: toastId });
        }
    };

    const handleReject = async (id) => {
        const toastId = toast.loading('Rejecting request...', {
            style: { background: '#1e293b', color: '#fff' }
        });
        try {
            await landApi.rejectLandRequest(id);
            toast.success('Request rejected', { id: toastId });
            fetchData();
        } catch (error) {
            toast.error('Rejection failed', { id: toastId });
        }
    };

    const statCards = [
        { title: 'Approved Assets', value: stats.totalLands, icon: Database, color: 'text-blue-400' },
        { title: 'Pending Verifications', value: stats.counts.pending, icon: FileText, color: 'text-amber-400' },
        { title: 'My Active Assets', value: isRegistrar ? stats.totalLands : (lands.filter(l => l.status === 'APPROVED').length || 0), icon: CheckCircle, color: 'text-emerald-400' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="font-display text-3xl font-bold text-slate-100 mb-2 drop-shadow-sm">System Command Center</h1>
                    <p className="text-slate-400 tracking-wide">Node synchronized. Welcome, {user?.email}.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {statCards.map((stat, i) => (
                    <GlassCard key={i} className="flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
                        <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 shadow-inner ${stat.color}`}>
                            <stat.icon className="w-8 h-8 opacity-90" />
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">{stat.title}</p>
                            <h3 className="font-display text-4xl font-bold text-slate-100">{stat.value}</h3>
                        </div>
                    </GlassCard>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <GlassCard className="h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-display text-xl font-bold text-slate-100">
                                {isRegistrar ? 'Pending Approval Queue' : 'My Land Requests'}
                            </h2>
                            <button onClick={fetchData} className="text-xs text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider flex items-center gap-1 transition-colors">
                                Sync Output <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                        <th className="pb-4 pl-2">Location</th>
                                        <th className="pb-4">Area</th>
                                        <th className="pb-4">State</th>
                                        <th className="pb-4">Transaction Hash</th>
                                        {isRegistrar && <th className="pb-4 text-right pr-2">Action</th>}
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {loading ? (
                                        <tr><td colSpan="5" className="py-12 text-center text-slate-500 font-mono animate-pulse">Establishing connection...</td></tr>
                                    ) : lands.length === 0 ? (
                                        <tr><td colSpan="5" className="py-12 text-center text-slate-500 font-mono">0x00 Null Data Segment</td></tr>
                                    ) : (
                                        lands.map((land) => (
                                            <tr key={land.id} className="border-b border-white/5 table-row-glass text-slate-300">
                                                <td className="py-4 pl-2 font-mono text-blue-300 font-medium">{land.location}</td>
                                                <td className="py-4 font-medium">{land.area} sq m</td>
                                                <td className="py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                                                        land.status === 'APPROVED' 
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                                            : land.status === 'REJECTED'
                                                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] ${
                                                            land.status === 'APPROVED' ? 'bg-emerald-400' : land.status === 'REJECTED' ? 'bg-red-400' : 'bg-amber-400'
                                                        }`}></span>
                                                        {land.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 font-mono text-[10px] text-slate-400 break-all max-w-[150px]">
                                                    {land.transactionHash || '-'}
                                                </td>
                                                {isRegistrar && (
                                                    <td className="py-4 text-right pr-2 space-x-2">
                                                        {land.status === 'PENDING' ? (
                                                            <>
                                                                <button 
                                                                    onClick={() => handleApprove(land.id)}
                                                                    className="glass-button px-4 py-1.5 rounded-lg text-xs font-bold text-white tracking-wide border border-emerald-500/50 bg-emerald-500/20 hover:bg-emerald-500/40"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleReject(land.id)}
                                                                    className="glass-button px-4 py-1.5 rounded-lg text-xs font-bold text-white tracking-wide border border-red-500/50 bg-red-500/20 hover:bg-red-500/40"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-white/5 px-3 py-1 rounded-lg border border-white/5">{land.status}</span>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>

                {/* Recent Approved Activity Panel */}
                <div>
                    <GlassCard className="h-full relative overflow-hidden group">
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-400/20 transition-all duration-700" />
                        
                        <h2 className="font-display text-xl font-bold text-slate-100 mb-6 flex items-center gap-3 relative z-10">
                            <Activity className="w-5 h-5 text-blue-400" />
                            Recent Registry
                        </h2>

                        <div className="space-y-4 relative z-10">
                            {stats.recentTransactions && stats.recentTransactions.length > 0 ? (
                                stats.recentTransactions.map((land) => (
                                    <div key={land.id} className="p-4 rounded-xl bg-slate-900/40 border border-white/5 shadow-inner flex items-center justify-between backdrop-blur-md hover:bg-slate-800/60 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-300 flex items-center justify-center font-mono font-bold text-xs shadow-inner">
                                                ID
                                            </div>
                                            <div>
                                                <p className="font-display text-sm font-bold text-slate-200">{land.location}</p>
                                                <p className="text-xs font-mono text-slate-500">{land.area} sq m</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-mono text-slate-500 bg-slate-950/50 px-2 py-0.5 rounded border border-white/5 mb-1">
                                                {land.transactionHash ? land.transactionHash.substring(0, 6) + '...' + land.transactionHash.substring(land.transactionHash.length - 4) : '-'}
                                            </p>
                                            <p className="text-xs text-emerald-400 font-bold tracking-wide">APPROVED</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-slate-500 font-mono text-sm py-8">No recent activity</p>
                            )}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
