import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import GlassCard from '../components/ui/GlassCard';
import GlassInput from '../components/ui/GlassInput';
import GlassButton from '../components/ui/GlassButton';
import { landApi } from '../api/land';

const SubmitLand = () => {
    const [formData, setFormData] = useState({
        location: '',
        area: '',
        documentHash: '',
        citizenId: ''
    });

    const submitMutation = useMutation({
        mutationFn: landApi.submitLandRequest,
        onSuccess: (data) => {
            toast.success(
                <div className="flex flex-col">
                    <span className="font-bold">Request Submitted</span>
                    <span className="text-xs opacity-90">Your land request is pending approval.</span>
                </div>,
                { style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }
            );
            setFormData({ location: '', area: '', documentHash: '', citizenId: '' });
        },
        onError: (error) => {
            toast.error('Submission failed. Please check your data.', {
                style: { background: '#450a0a', color: '#fca5a5', border: '1px solid rgba(248,113,113,0.2)' }
            });
        }
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.location || !formData.citizenId) {
            toast.error('Location and Citizen ID are required.');
            return;
        }
        const payload = {
            ...formData,
            area: formData.area ? parseFloat(formData.area) : undefined
        };
        const promise = submitMutation.mutateAsync(payload);

        toast.promise(promise, {
            loading: 'Submitting request...',
            success: 'Request submitted successfully!',
            error: (err) => err?.response?.data?.message || err.message || 'Submission failed'
        }, {
            style: { background: '#0f172a', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)' }
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="font-display text-4xl font-bold text-slate-100 mb-2 drop-shadow-md">Land Asset Submission</h1>
                <p className="text-slate-400 tracking-wide text-sm">Provide property metadata for formal registrar verification and blockchain registration.</p>
            </div>

            <GlassCard>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <GlassInput
                            id="citizenId"
                            label="Citizen ID *"
                            placeholder="e.g. CID-12345"
                            value={formData.citizenId}
                            onChange={handleChange}
                            required
                        />
                        <GlassInput
                            id="location"
                            label="Location *"
                            placeholder="Coordinates / Street"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
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

                    <div className="pt-8 mt-4 border-t border-white/10 flex justify-end">
                        <GlassButton type="submit" disabled={submitMutation.isPending} className="w-full sm:w-auto px-10 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-400/20 font-bold tracking-widest uppercase text-xs rounded-xl py-3">
                            {submitMutation.isPending ? 'Processing...' : 'Submit Request'}
                        </GlassButton>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};

export default SubmitLand;
