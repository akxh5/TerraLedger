import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import GlassCard from '../components/ui/GlassCard';
import GlassInput from '../components/ui/GlassInput';
import GlassButton from '../components/ui/GlassButton';
import { ArrowRightLeft, CheckCircle2 } from 'lucide-react';
import { landApi } from '../api/land';

const TransferOwnership = () => {
    const [activeTab, setActiveTab] = useState('initiate');
    const [initiateData, setInitiateData] = useState({ landId: '', newOwnerName: '', newOwnerAddress: '' });
    const [approveData, setApproveData] = useState({ transferId: '', privateKey: '' });

    const initiateMutation = useMutation({
        mutationFn: landApi.initiateTransfer,
        onSuccess: () => {
            toast.success(
                <div className="flex flex-col">
                    <span className="font-bold">Transfer Initiated</span>
                    <span className="text-xs opacity-90">Waiting for receiver approval.</span>
                </div>
            );
            setInitiateData({ landId: '', newOwnerName: '', newOwnerAddress: '' });
        }
    });

    const approveMutation = useMutation({
        mutationFn: landApi.approveTransfer,
        onSuccess: () => {
            toast.success(
                <div className="flex flex-col">
                    <span className="font-bold">Transfer Approved</span>
                    <span className="text-xs opacity-90">Ownership updated on ledger.</span>
                </div>
            );
            setApproveData({ transferId: '', privateKey: '' });
        }
    });

    const handleInitiate = (e) => {
        e.preventDefault();
        if (!initiateData.landId || !initiateData.newOwnerAddress) {
            toast.error('Land ID and New Owner Address are required.');
            return;
        }
        const promise = initiateMutation.mutateAsync(initiateData);

        toast.promise(promise, {
            loading: 'Initiating transfer...',
            success: 'Transfer Sent',
            error: (err) => err?.response?.data?.message || err.message || 'Failed to initiate transfer'
        });
    };

    const handleApprove = (e) => {
        e.preventDefault();
        if (!approveData.transferId || !approveData.privateKey) {
            toast.error('Transfer ID and Signing Key are required.');
            return;
        }
        const promise = approveMutation.mutateAsync(approveData);

        toast.promise(promise, {
            loading: 'Signing transfer...',
            success: 'Ownership Transferred',
            error: (err) => err?.response?.data?.message || err.message || 'Failed to approve transfer'
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Transfer Ownership</h1>
                <p className="text-slate-500">Initiate or securely approve land transfers via the blockchain.</p>
            </div>

            <div className="mb-6 flex p-1 bg-white/20 backdrop-blur-md rounded-xl border border-white/40 w-max shadow-sm">
                <button
                    onClick={() => setActiveTab('initiate')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'initiate'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-800'
                        }`}
                >
                    Initiate Transfer
                </button>
                <button
                    onClick={() => setActiveTab('approve')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'approve'
                        ? 'bg-white text-emerald-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-800'
                        }`}
                >
                    Approve Transfer
                </button>
            </div>

            {activeTab === 'initiate' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <GlassCard className="border-t-4 border-t-blue-400">
                        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                            <ArrowRightLeft className="w-5 h-5 text-blue-500" />
                            Transfer Details
                        </h2>
                        <form onSubmit={handleInitiate} className="space-y-5">
                            <GlassInput
                                id="landId"
                                label="Land ID"
                                placeholder="e.g. LND-2026-001"
                                value={initiateData.landId}
                                onChange={(e) => setInitiateData({ ...initiateData, landId: e.target.value })}
                            />
                            <GlassInput
                                id="newOwnerName"
                                label="New Owner Name"
                                placeholder="Receiver's full name"
                                value={initiateData.newOwnerName}
                                onChange={(e) => setInitiateData({ ...initiateData, newOwnerName: e.target.value })}
                            />
                            <GlassInput
                                id="newOwnerAddress"
                                label="New Owner Wallet Address"
                                placeholder="0x..."
                                value={initiateData.newOwnerAddress}
                                onChange={(e) => setInitiateData({ ...initiateData, newOwnerAddress: e.target.value })}
                            />
                            <div className="pt-6 border-t border-slate-200/50 flex justify-end">
                                <GlassButton type="submit" disabled={initiateMutation.isPending} className="bg-blue-600/10 text-blue-700 hover:bg-blue-600/20 border-blue-200">
                                    {initiateMutation.isPending ? 'Processing...' : 'Initiate on Ledger'}
                                </GlassButton>
                            </div>
                        </form>
                    </GlassCard>
                </div>
            )}

            {activeTab === 'approve' && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                    <GlassCard className="border-t-4 border-t-emerald-400">
                        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            Verify & Approve
                        </h2>
                        <form onSubmit={handleApprove} className="space-y-5">
                            <GlassInput
                                id="transferId"
                                label="Transfer ID"
                                placeholder="e.g. TX-9923"
                                value={approveData.transferId}
                                onChange={(e) => setApproveData({ ...approveData, transferId: e.target.value })}
                            />
                            <GlassInput
                                id="privateKey"
                                type="password"
                                label="Signing Key (Development Only)"
                                placeholder="Enter private key to sign"
                                value={approveData.privateKey}
                                onChange={(e) => setApproveData({ ...approveData, privateKey: e.target.value })}
                            />
                            <div className="pt-6 border-t border-slate-200/50 flex justify-end">
                                <GlassButton type="submit" disabled={approveMutation.isPending} className="bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/20 border-emerald-200/50">
                                    {approveMutation.isPending ? 'Signing...' : 'Approve Transfer'}
                                </GlassButton>
                            </div>
                        </form>
                    </GlassCard>
                </div>
            )}
        </div>
    );
};

export default TransferOwnership;
