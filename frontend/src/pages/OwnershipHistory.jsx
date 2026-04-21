import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import GlassCard from '../components/ui/GlassCard';
import Timeline from '../components/ui/Timeline';
import GlassButton from '../components/ui/GlassButton';
import { Search, History } from 'lucide-react';
import { landApi } from '../api/land';

const OwnershipHistory = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialId = queryParams.get('id') || '';

    const [searchTerm, setSearchTerm] = useState(initialId);
    const [activeSearch, setActiveSearch] = useState(initialId);

    const { data: history, isLoading, isError } = useQuery({
        queryKey: ['history', activeSearch],
        queryFn: () => landApi.getOwnershipHistory(activeSearch),
        enabled: !!activeSearch,
        retry: false
    });

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setActiveSearch(searchTerm.trim());
        }
    };

    useEffect(() => {
        if (isError) {
            toast.error('Query Failed.', {
                style: { background: '#450a0a', color: '#fca5a5', border: '1px solid rgba(248,113,113,0.2)' }
            });
        }
    }, [isError, activeSearch]);

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="font-display text-4xl font-bold text-slate-100 mb-2 drop-shadow-md">Ownership Log Tracer</h1>
                <p className="text-slate-400 tracking-wide text-sm">Review the immutable cryptographic timeline of land transfers and registrations.</p>
            </div>

            <GlassCard className="p-3 sm:p-3 overflow-hidden relative">
                <form onSubmit={handleSearch} className="flex gap-3 relative z-10">
                    <input
                        type="text"
                        className="flex-1 glass-input px-5 py-4 outline-none text-slate-100 placeholder:text-slate-500 rounded-xl"
                        placeholder="Scan Asset ID Timeline..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <GlassButton type="submit" className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-indigo-400/20 font-bold uppercase text-xs tracking-widest px-8 rounded-xl shadow-sm flex items-center">
                        <Search className="w-5 h-5 mr-2" /> Trace
                    </GlassButton>
                </form>
            </GlassCard>

            {isLoading && (
                <div className="flex justify-center p-16">
                    <div className="w-10 h-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-400 animate-spin shadow-[0_0_15px_rgba(99,102,241,0.3)]"></div>
                </div>
            )}

            {history && !isLoading && (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <GlassCard className="p-10 border-t-4 border-t-indigo-500/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

                        <h2 className="font-display text-2xl font-bold text-white mb-10 flex items-center gap-3 drop-shadow-sm">
                            <History className="w-6 h-6 text-indigo-400" />
                            Provenance Matrix: {activeSearch}
                        </h2>

                        {history.length > 0 ? (
                            <Timeline events={history} />
                        ) : (
                            <p className="text-center text-slate-500 font-mono">No history found for this asset.</p>
                        )}
                    </GlassCard>
                </div>
            )}
        </div>
    );
};

export default OwnershipHistory;
