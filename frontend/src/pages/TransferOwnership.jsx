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

    const toastStyle = { style: { background: '#0f172a', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)' } };

    const initiateMutation = useMutation({
        mutationFn: landApi.initiateTransfer,
        onSuccess: () => {
            toast.success(
                <div className="flex flex-col">
                    <span className="font-bold">Transaction Initiated</span>
                    <span className="text-xs opacity-90">Waiting for counterparty consensus.</span>
                </div>, toastStyle
            );
            setInitiateData({ landId: '', newOwnerName: '', newOwnerAddress: '' });
        }
    });

    const approveMutation = useMutation({
        mutationFn: landApi.approveTransfer,
        onSuccess: () => {
            toast.success(
                <div className="flex flex-col">
                    <span className="font-bold">Consensus Reached</span>
                    <span className="text-xs opacity-90">Ownership matrix updated on ledger.</span>
                </div>, toastStyle
            );
            setApproveData({ transferId: '', privateKey: '' });
        }
    });

    const handleInitiate = (e) => {
        e.preventDefault();
        if (!initiateData.landId || !initiateData.newOwnerAddress) {
            toast.error('Asset ID and Target Address Required.', toastStyle);
            return;
        }
        const promise = initiateMutation.mutateAsync(initiateData);
        toast.promise(promise, {
            loading: 'Propagating transfer request...',
            success: 'Transfer Sent to Mempool',
            error: (err) => err?.response?.data?.message || err.message || 'Failed to initiate transfer'
        }, toastStyle);
    };

    const handleApprove = (e) => {
        e.preventDefault();
        if (!approveData.transferId || !approveData.privateKey) {
            toast.error('TX ID and Cryptographic Key needed.', toastStyle);
            return;
        }
        const promise = approveMutation.mutateAsync(approveData);
        toast.promise(promise, {
            loading: 'Executing consensus...',
            success: 'Asset Transferred Successfully',
            error: (err) => err?.response?.data?.message || err.message || 'Signature failed'
        }, toastStyle);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="font-display text-4xl font-bold text-slate-100 mb-2 drop-shadow-md">Transfer Asset Ownership</h1>
                <p className="text-slate-400 tracking-wide text-sm">Initiate and execute secure asset transfers cryptographically.</p>
            </div>

            <div className="mb-8 flex p-1 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/5 w-max shadow-inner">
                <button
                    onClick={() => setActiveTab('initiate')}
                    className={`px-6 py-3 rounded-lg text-xs tracking-widest font-bold uppercase transition-all ${activeTab === 'initiate'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-400/20 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                        }`}
                >
                    Initiate Transfer
                </button>
                <button
                    onClick={() => setActiveTab('approve')}
                    className={`px-6 py-3 rounded-lg text-xs tracking-widest font-bold uppercase transition-all ${activeTab === 'approve'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                        }`}
                >
                    Confirm Consensus
                </button>
            </div>

            {activeTab === 'initiate' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <GlassCard className="border-t-[3px] border-t-blue-500/50">
                        <h2 className="font-display text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                            <ArrowRightLeft className="w-5 h-5 text-blue-400" />
                            Transfer Payload Data
                        </h2>
                        <form onSubmit={handleInitiate} className="space-y-6">
                            <GlassInput
                                id="landId"
                                label="Asset ID"
                                placeholder="e.g. LND-2026-001"
                                value={initiateData.landId}
                                onChange={(e) => setInitiateData({ ...initiateData, landId: e.target.value })}
                            />
                            <GlassInput
                                id="newOwnerName"
                                label="Target Owner Alias"
                                placeholder="Receiver's authorized name"
                                value={initiateData.newOwnerName}
                                onChange={(e) => setInitiateData({ ...initiateData, newOwnerName: e.target.value })}
                            />
                            <GlassInput
                                id="newOwnerAddress"
                                label="Target Wallet Hex"
                                placeholder="0x..."
                                value={initiateData.newOwnerAddress}
                                onChange={(e) => setInitiateData({ ...initiateData, newOwnerAddress: e.target.value })}
                            />
                            <div className="pt-8 border-t border-white/10 flex justify-end">
                                <GlassButton type="submit" disabled={initiateMutation.isPending} className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-400/20 font-bold uppercase text-xs tracking-widest py-3 px-8 rounded-xl shadow-sm">
                                    {initiateMutation.isPending ? 'Propagating...' : 'Broadcast Intent'}
                                </GlassButton>
                            </div>
                        </form>
                    </GlassCard>
                </div>
            )}

            {activeTab === 'approve' && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                    <GlassCard className="border-t-[3px] border-t-emerald-500/50">
                        <h2 className="font-display text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            Cryptographic Signature
                        </h2>
                        <form onSubmit={handleApprove} className="space-y-6">
                            <GlassInput
                                id="transferId"
                                label="Transaction Intent Hash"
                                placeholder="e.g. TX-9923"
                                value={approveData.transferId}
                                onChange={(e) => setApproveData({ ...approveData, transferId: e.target.value })}
                            />
                            <GlassInput
                                id="privateKey"
                                type="password"
                                label="Private Signing Key [Demo]"
                                placeholder="0x..."
                                value={approveData.privateKey}
                                onChange={(e) => setApproveData({ ...approveData, privateKey: e.target.value })}
                            />
                            <div className="pt-8 border-t border-white/10 flex justify-end">
                                <GlassButton type="submit" disabled={approveMutation.isPending} className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border-emerald-400/20 font-bold uppercase text-xs tracking-widest py-3 px-8 rounded-xl shadow-sm">
                                    {approveMutation.isPending ? 'Executing...' : 'Sign & Complete'}
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
