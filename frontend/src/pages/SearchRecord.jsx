import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import { Search, MapPin, User, FileDigit, Hash, ExternalLink } from 'lucide-react';
import { landApi } from '../api/land';

const SearchRecord = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSearch, setActiveSearch] = useState('');

    const { data: results, isLoading, isError } = useQuery({
        queryKey: ['lands', 'search', activeSearch],
        queryFn: () => landApi.advancedSearch({ query: activeSearch }),
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
            toast.error('Query Failed. Data not found in registry.', {
                style: { background: '#450a0a', color: '#fca5a5', border: '1px solid rgba(248,113,113,0.2)' }
            });
        }
    }, [isError, activeSearch]);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="font-display text-4xl font-bold text-slate-100 mb-2 drop-shadow-md">Global Ledger Search</h1>
                <p className="text-slate-400 tracking-wide text-sm">Query the indexed database for transparent property ownership data.</p>
            </div>

            <GlassCard className="p-3 sm:p-3 overflow-hidden relative">
                <form onSubmit={handleSearch} className="flex gap-3 relative z-10">
                    <input
                        type="text"
                        className="flex-1 glass-input px-5 py-4 outline-none text-slate-100 placeholder:text-slate-500 rounded-xl"
                        placeholder="Search by Location, Owner Address, or Citizen ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <GlassButton type="submit" className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-400/20 font-bold uppercase text-xs tracking-widest px-8 rounded-xl shadow-sm flex items-center">
                        <Search className="w-5 h-5 mr-2" /> Query Registry
                    </GlassButton>
                </form>
            </GlassCard>

            {isLoading && (
                <div className="flex justify-center p-16">
                    <div className="w-10 h-10 rounded-full border-4 border-blue-500/20 border-t-blue-400 animate-spin shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
                </div>
            )}

            {results && results.length > 0 && !isLoading && (
                <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    {results.map((record) => (
                        <GlassCard key={record.id} className="overflow-hidden relative border-l-4 border-l-blue-500/50 hover:bg-white/5 transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[40px] -z-10 pointer-events-none"></div>

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2 inline-block">
                                        <span className="inline-block w-1 h-1 bg-emerald-400 rounded-full mr-1.5 shadow-[0_0_5px_currentColor]"></span>
                                        Consensus Verified
                                    </span>
                                    <h2 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                                        <FileDigit className="text-blue-400 w-5 h-5" />
                                        Asset #{record.id}
                                    </h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] uppercase tracking-widest font-bold text-slate-500 mb-0.5">Location</p>
                                    <p className="font-bold text-slate-200">{record.location}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 flex items-center gap-1.5 mb-1">
                                        <User className="w-3.5 h-3.5 text-indigo-400" /> Owner
                                    </p>
                                    <p className="font-mono text-[11px] text-slate-300 truncate" title={record.ownerAddress}>
                                        {record.ownerAddress}
                                    </p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 flex items-center gap-1.5 mb-1">
                                        <Hash className="w-3.5 h-3.5 text-indigo-400" /> Area
                                    </p>
                                    <p className="font-bold text-slate-200 text-sm">{record.area} sq. m</p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 flex items-center gap-1.5 mb-1">
                                        <ExternalLink className="w-3.5 h-3.5 text-indigo-400" /> Tx Hash
                                    </p>
                                    <p className="font-mono text-[11px] text-blue-400 truncate">
                                        {record.transactionHash}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex justify-end pt-2 border-t border-white/5">
                                <button 
                                    onClick={() => window.location.href = `/history?id=${record.blockchainLandId}`}
                                    className="text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                >
                                    View Ownership History <ExternalLink className="w-3 h-3" />
                                </button>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}

            {results && results.length === 0 && !isLoading && (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                    <p className="text-slate-500 font-mono text-lg">0x00 No records matched your query segment.</p>
                </div>
            )}
        </div>
    );
};

export default SearchRecord;
