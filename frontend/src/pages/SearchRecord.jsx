import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import GlassCard from '../components/ui/GlassCard';
import GlassInput from '../components/ui/GlassInput';
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
            toast.error('Failed to fetch record. It may not exist.');
        }
    }, [isError, activeSearch]);

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Search Registry</h1>
                <p className="text-slate-500">Query the immutable ledger for property ownership and details.</p>
            </div>

            <GlassCard className="p-2 sm:p-2">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 bg-transparent px-4 py-3 outline-none text-slate-700 placeholder:text-slate-400"
                        placeholder="Enter Land ID or Owner Address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <GlassButton type="submit" className="bg-blue-600/10 text-blue-700 hover:bg-blue-600/20 border-transparent">
                        <Search className="w-5 h-5 mr-1" /> Search
                    </GlassButton>
                </form>
            </GlassCard>

            {isLoading && (
                <div className="flex justify-center p-12">
                    <div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                </div>
            )}

            {displayRecord && !isLoading && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <GlassCard className="overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-[100px] -z-10"></div>

                        <div className="flex justify-between items-start mb-6 border-b border-slate-200/50 pb-6">
                            <div>
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 mb-3 inline-block">
                                    Verified Record
                                </span>
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                    <FileDigit className="text-blue-500 w-6 h-6" />
                                    {displayRecord.id}
                                </h2>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500 mb-1">Status</p>
                                <p className="font-semibold text-emerald-600">Active</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-1">
                                        <User className="w-4 h-4" /> Current Owner
                                    </p>
                                    <p className="font-medium text-slate-800 text-lg">{displayRecord.ownerName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-1">
                                        <MapPin className="w-4 h-4" /> Location
                                    </p>
                                    <p className="font-medium text-slate-800">{displayRecord.location}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-1">
                                        <Hash className="w-4 h-4" /> Area size
                                    </p>
                                    <p className="font-medium text-slate-800">{displayRecord.area} sq. meters</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-1">
                                        <FileDigit className="w-4 h-4" /> IPFS Document Hash
                                    </p>
                                    <p className="font-mono text-xs text-slate-600 bg-white/50 p-2 rounded-lg break-all border border-slate-200/50 mt-1">
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
