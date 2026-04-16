import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import { Search, MapPin, User, FileDigit, Hash } from 'lucide-react';
import { landApi } from '../api/land';

const SearchRecord = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSearch, setActiveSearch] = useState('');

    const { data: record, isLoading, isError } = useQuery({
        queryKey: ['land', activeSearch],
        queryFn: () => landApi.getLandRecord(activeSearch),
        enabled: !!activeSearch,
        retry: false
    });

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setActiveSearch(searchTerm.trim());
        }
    };

    const displayRecord = record;

    useEffect(() => {
        if (isError) {
            toast.error('Query Failed. Data not mapped in blocks.', {
                style: { background: '#450a0a', color: '#fca5a5', border: '1px solid rgba(248,113,113,0.2)' }
            });
        }
    }, [isError, activeSearch]);

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="font-display text-4xl font-bold text-slate-100 mb-2 drop-shadow-md">Global Ledger Search</h1>
                <p className="text-slate-400 tracking-wide text-sm">Query the immutable smart contract for transparent property ownership data.</p>
            </div>

            <GlassCard className="p-3 sm:p-3 overflow-hidden relative">
                <form onSubmit={handleSearch} className="flex gap-3 relative z-10">
                    <input
                        type="text"
                        className="flex-1 glass-input px-5 py-4 outline-none text-slate-100 placeholder:text-slate-500 rounded-xl"
                        placeholder="Input Protocol Asset ID or Owner Hash Matrix..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <GlassButton type="submit" className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-400/20 font-bold uppercase text-xs tracking-widest px-8 rounded-xl shadow-sm flex items-center">
                        <Search className="w-5 h-5 mr-2" /> Execute
                    </GlassButton>
                </form>
            </GlassCard>

            {isLoading && (
                <div className="flex justify-center p-16">
                    <div className="w-10 h-10 rounded-full border-4 border-blue-500/20 border-t-blue-400 animate-spin shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
                </div>
            )}

            {displayRecord && !isLoading && (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <GlassCard className="overflow-hidden relative border-t-4 border-t-blue-500/50">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[50px] -z-10 pointer-events-none"></div>

                        <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-8">
                            <div>
                                <span className="px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4 inline-block shadow-sm">
                                    <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 shadow-[0_0_5px_currentColor]"></span>
                                    Blockchain Consensus Verified
                                </span>
                                <h2 className="font-display text-4xl font-bold text-white flex items-center gap-3 drop-shadow-sm">
                                    <FileDigit className="text-blue-400 w-8 h-8" />
                                    {displayRecord.id}
                                </h2>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-1">Node Status</p>
                                <p className="font-bold text-emerald-400">ACTIVE</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400 flex items-center gap-2 mb-2">
                                        <User className="w-4 h-4 text-indigo-400" /> Current Owner Identify
                                    </p>
                                    <p className="font-bold text-white text-xl">{displayRecord.ownerName}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400 flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-indigo-400" /> Geolocation Matrix
                                    </p>
                                    <p className="font-bold text-slate-200">{displayRecord.location}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400 flex items-center gap-2 mb-2">
                                        <Hash className="w-4 h-4 text-indigo-400" /> Perimeter Metrics
                                    </p>
                                    <p className="font-bold text-slate-200">{displayRecord.area} sq. meters</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400 flex items-center gap-2 mb-2">
                                        <FileDigit className="w-4 h-4 text-indigo-400" /> IPFS Storage Pointer
                                    </p>
                                    <p className="font-mono text-xs text-blue-300 bg-slate-950/50 p-3 rounded-lg break-all border border-blue-500/10 shadow-inner">
                                        {displayRecord.documentHash}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}
        </div>
    );
};

export default SearchRecord;
