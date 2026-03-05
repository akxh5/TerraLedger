import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import GlassCard from '../components/ui/GlassCard';
import GlassInput from '../components/ui/GlassInput';
import GlassButton from '../components/ui/GlassButton';
import { landApi } from '../api/land';

const RegisterLand = () => {
    const [formData, setFormData] = useState({
        landId: '',
        ownerName: '',
        location: '',
        area: '',
        documentHash: ''
    });

    const registerMutation = useMutation({
        mutationFn: landApi.registerLand,
        onSuccess: (data) => {
            toast.success(
                <div className="flex flex-col">
                    <span className="font-bold">Transaction Successful</span>
                    <span className="text-xs opacity-90">Land #{formData.landId} registered.</span>
                </div>
            );
            setFormData({ landId: '', ownerName: '', location: '', area: '', documentHash: '' });
        },
        onError: (error) => {
            toast.error('Failed to register land. Ensure unique ID and valid data.');
        }
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.landId || !formData.ownerName) {
            toast.error('Please fill required fields.');
            return;
        }
        const payload = {
            ...formData,
            area: formData.area ? parseFloat(formData.area) : undefined
        };
        const promise = registerMutation.mutateAsync(payload);

        toast.promise(promise, {
            loading: 'Writing to Blockchain...',
            success: 'Confirmed on Ledger',
            error: (err) => err?.response?.data?.message || err.message || 'Registration failed'
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Register Land</h1>
                <p className="text-slate-500">Enter property details to mint a new land record on the ledger.</p>
            </div>

            <GlassCard>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                        <GlassInput
                            id="landId"
                            label="Land ID / Parcel Number *"
                            placeholder="e.g. LND-2026-001"
                            value={formData.landId}
                            onChange={handleChange}
                            required
                        />
                        <GlassInput
                            id="ownerName"
                            label="Initial Owner Name *"
                            placeholder="Full legal name"
                            value={formData.ownerName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <GlassInput
                        id="location"
                        label="Location / Address"
                        placeholder="123 Example Street, City"
                        value={formData.location}
                        onChange={handleChange}
                    />

                    <div className="grid grid-cols-2 gap-5">
                        <GlassInput
                            id="area"
                            label="Area (sq meters)"
                            type="number"
                            placeholder="e.g. 500"
                            value={formData.area}
                            onChange={handleChange}
                        />
                        <GlassInput
                            id="documentHash"
                            label="Document IPFS Hash"
                            placeholder="Qm... or bafy..."
                            value={formData.documentHash}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="pt-6 mt-2 border-t border-slate-200/50 flex justify-end">
                        <GlassButton type="submit" disabled={registerMutation.isPending} className="w-full sm:w-auto px-8 bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 border-blue-300/50">
                            {registerMutation.isPending ? 'Processing...' : 'Register on Ledger'}
                        </GlassButton>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};

export default RegisterLand;
