import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import GlassCard from '../components/ui/GlassCard';
import Timeline from '../components/ui/Timeline';
import GlassButton from '../components/ui/GlassButton';
import { Search, History } from 'lucide-react';
import { landApi } from '../api/land';

const OwnershipHistory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSearch, setActiveSearch] = useState('');

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

    const displayHistory = history;

    useEffect(() => {
        if (isError) {
            toast.error('Failed to fetch ownership history.');
        }
    }, [isError, activeSearch]);

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Ownership History</h1>
                <p className="text-slate-500">View the immutable timeline of land transfers and registrations.</p>
            </div>

            <GlassCard className="p-2 sm:p-2">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 bg-transparent px-4 py-3 outline-none text-slate-700 placeholder:text-slate-400"
                        placeholder="Enter Land ID..."
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

            {displayHistory && !isLoading && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <GlassCard className="p-8">
                        <h2 className="text-xl font-semibold text-slate-800 mb-8 flex items-center gap-2">
                            <History className="w-5 h-5 text-blue-500" />
                            Timeline for {activeSearch || 'LND-2026-001'}
                        </h2>

                        <Timeline events={displayHistory} />
                    </GlassCard>
                </div>
            )}
        </div>
    );
};

export default OwnershipHistory;
