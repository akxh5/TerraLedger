import React from 'react';
import GlassCard from '../components/ui/GlassCard';
import { Activity, Database, FileText, ArrowRight } from 'lucide-react';

const Dashboard = () => {
    // Mock data for initial UI
    const stats = [
        { title: 'Total Land Records', value: '14,204', icon: Database, color: 'text-blue-500' },
        { title: 'Recent Transactions', value: '342', icon: Activity, color: 'text-emerald-500' },
        { title: 'Pending Approvals', value: '12', icon: FileText, color: 'text-amber-500' },
    ];

    const recentTransactions = [
        { id: 'TX-9923', type: 'Transfer', from: '0x12..34', to: '0x99..AB', time: '10 mins ago', status: 'Success' },
        { id: 'TX-9922', type: 'Registration', from: 'System', to: '0x44..21', time: '1 hour ago', status: 'Success' },
        { id: 'TX-9921', type: 'Transfer', from: '0x77..89', to: '0x22..11', time: '3 hours ago', status: 'Pending' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard Overview</h1>
                    <p className="text-slate-500">Welcome to the TerraLedger Land Registry Portal.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <GlassCard key={i} className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl bg-white/50 backdrop-blur-sm shadow-inner ${stat.color}`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
                        </div>
                    </GlassCard>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <GlassCard className="h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-slate-800">Recent Transactions</h2>
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                View All <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200/50 text-sm font-medium text-slate-500">
                                        <th className="pb-3 pl-2">Transaction ID</th>
                                        <th className="pb-3">Type</th>
                                        <th className="pb-3">From → To</th>
                                        <th className="pb-3">Time</th>
                                        <th className="pb-3 text-right pr-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {recentTransactions.map((tx, i) => (
                                        <tr key={i} className="border-b border-slate-100/50 hover:bg-white/20 transition-colors">
                                            <td className="py-4 pl-2 font-mono text-slate-600">{tx.id}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${tx.type === 'Transfer' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="py-4 font-mono text-xs text-slate-500">
                                                {tx.from} <ArrowRight className="w-3 h-3 inline mx-1" /> {tx.to}
                                            </td>
                                            <td className="py-4 text-slate-500">{tx.time}</td>
                                            <td className="py-4 text-right pr-2">
                                                <span className={`flex items-center justify-end gap-1.5 ${tx.status === 'Success' ? 'text-emerald-600' : 'text-amber-500'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${tx.status === 'Success' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </div>

                {/* Blockchain Activity Panel */}
                <div>
                    <GlassCard className="h-full bg-gradient-to-br from-white/60 to-blue-50/30">
                        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-500" />
                            Network Activity
                        </h2>

                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((block) => (
                                <div key={block} className="p-3 rounded-xl bg-white/40 border border-white/50 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                            Bk
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700">Block #{892400 + block}</p>
                                            <p className="text-xs text-slate-500">{block * 12}s ago</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-mono text-slate-400">0x8f...3a</p>
                                        <p className="text-xs text-emerald-600 font-medium">{Math.floor(Math.random() * 5) + 1} txns</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
