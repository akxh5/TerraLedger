import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { ArrowRightLeft, CheckCircle2, List, Vote, Play, Loader2, Send } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { landApi } from "@/lib/api/land";
import { useTransaction } from "@/components/TransactionProvider";
import GlassInput from "@/components/GlassInput";
import LiquidGlassButton from "@/components/LiquidGlassButton";
import LiquidGlassCard from "@/components/LiquidGlassCard";

const TransferOwnership = () => {
  const queryClient = useQueryClient();
  const { addTx, updateTx } = useTransaction();
  const [activeTab, setActiveTab] = useState<'propose' | 'view'>('propose');
  const [proposeData, setProposeData] = useState({ landId: '', toAddress: '' });

  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['blockchainEvents'],
    queryFn: async () => {
      const res = await landApi.getBlockchainEvents();
      return Array.isArray(res) ? res : [];
    }
  });

  const proposeMutation = useMutation({
    mutationFn: landApi.proposeTransfer,
    onMutate: () => {
      const txId = Date.now().toString();
      addTx(txId, "DAO Transfer Proposal");
      return { txId };
    },
    onSuccess: (_, __, context) => {
      updateTx(context.txId, 'confirmed');
      setProposeData({ landId: '', toAddress: '' });
      toast.success("Transfer proposal created successfully");
      queryClient.invalidateQueries({ queryKey: ['blockchainEvents'] });
    },
    onError: (err: any, _, context) => {
      updateTx(context!.txId, 'failed');
      toast.error(err.response?.data?.message || err.message || 'Failed to create proposal');
    }
  });

  const voteMutation = useMutation({
    mutationFn: landApi.voteOnProposal,
    onMutate: () => {
      const txId = Date.now().toString();
      addTx(txId, "Casting DAO Vote");
      return { txId };
    },
    onSuccess: (_, __, context) => {
      updateTx(context.txId, 'confirmed');
      toast.success("Vote cast successfully");
      queryClient.invalidateQueries({ queryKey: ['blockchainEvents'] });
    },
    onError: (err: any, _, context) => {
      updateTx(context!.txId, 'failed');
      toast.error(err.response?.data?.message || err.message || 'Failed to cast vote');
    }
  });

  const executeMutation = useMutation({
    mutationFn: landApi.executeProposal,
    onMutate: () => {
      const txId = Date.now().toString();
      addTx(txId, "Executing Property Transfer");
      return { txId };
    },
    onSuccess: (_, __, context) => {
      updateTx(context.txId, 'confirmed');
      toast.success("Proposal executed successfully");
      queryClient.invalidateQueries({ queryKey: ['blockchainEvents'] });
    },
    onError: (err: any, _, context) => {
      updateTx(context!.txId, 'failed');
      toast.error(err.response?.data?.message || err.message || 'Failed to execute proposal');
    }
  });

  const handlePropose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposeData.landId || !proposeData.toAddress) {
      toast.error('All fields are required.');
      return;
    }
    proposeMutation.mutate(proposeData);
  };

  const transferProposals = Array.isArray(events) ? events.filter(e => e?.eventType === 'TransferInitiated') : [];

  return (
    <motion.div {...fadeUp(0.1)} className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">DAO Governance: Transfer</h1>
        <p className="text-muted-foreground">Manage land transfers through the decentralized proposal and voting system.</p>
      </div>

      <div className="flex p-1 bg-secondary/50 backdrop-blur-md rounded-xl border border-white/5 w-max shadow-sm">
        <button
          onClick={() => setActiveTab('propose')}
          className={`px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'propose'
            ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,230,154,0.1)]'
            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            }`}
        >
          <Send className="w-3.5 h-3.5" />
          1. Propose
        </button>
        <button
          onClick={() => setActiveTab('view')}
          className={`px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'view'
            ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,230,154,0.1)]'
            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            }`}
        >
          <List className="w-3.5 h-3.5" />
          2. View & Vote
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {activeTab === 'propose' ? (
              <motion.div
                key="propose"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <LiquidGlassCard className="p-8 border-t-4 border-t-primary">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-primary" />
                    New Transfer Proposal
                  </h2>
                  <form onSubmit={handlePropose} className="space-y-6">
                    <GlassInput
                      id="landId"
                      label="Land Record ID (Numeric)"
                      placeholder="e.g. 1"
                      value={proposeData.landId}
                      onChange={(e) => setProposeData({ ...proposeData, landId: e.target.value })}
                    />
                    <GlassInput
                      id="toAddress"
                      label="Recipient Wallet Address"
                      placeholder="0x..."
                      value={proposeData.toAddress}
                      onChange={(e) => setProposeData({ ...proposeData, toAddress: e.target.value })}
                    />
                    <div className="pt-6 border-t border-white/5 flex justify-end">
                      <LiquidGlassButton type="submit" disabled={proposeMutation.isPending} className="px-8">
                        {proposeMutation.isPending ? 'Submitting...' : 'Create Proposal'}
                      </LiquidGlassButton>
                    </div>
                  </form>
                </LiquidGlassCard>
              </motion.div>
            ) : (
              <motion.div
                key="view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <List className="w-5 h-5 text-primary" />
                  Active Proposals
                </h2>
                
                {isLoadingEvents ? (
                  <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transferProposals.map((proposal, idx) => (
                      <LiquidGlassCard key={idx} className="p-5 hover:border-primary/30 transition-all hover:scale-[1.01]">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20 uppercase tracking-widest">PROPOSAL</span>
                              <span className="text-muted-foreground text-[10px] font-mono truncate">{proposal?.transactionHash}</span>
                            </div>
                            <p className="text-foreground font-medium text-sm leading-relaxed">{proposal?.eventData || 'Transfer Proposal'}</p>
                            <p className="text-[10px] text-muted-foreground mt-3 font-bold uppercase tracking-widest">Block Height: {proposal?.blockNumber || 'Unknown'}</p>
                          </div>
                          <div className="flex gap-2 shrink-0 ml-4">
                            <button 
                              disabled={voteMutation.isPending}
                              onClick={() => voteMutation.mutate(proposal?.id || idx + 1)}
                              className="p-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all hover:scale-110 border border-primary/20 active:scale-95 disabled:opacity-50"
                              title="Vote For"
                            >
                              <Vote className="w-5 h-5" />
                            </button>
                            <button 
                              disabled={executeMutation.isPending}
                              onClick={() => executeMutation.mutate(proposal?.id || idx + 1)}
                              className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all hover:scale-110 border border-blue-500/20 active:scale-95 disabled:opacity-50"
                              title="Execute"
                            >
                              <Play className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </LiquidGlassCard>
                    ))}
                    
                    {transferProposals.length === 0 && (
                      <div className="p-16 text-center bg-secondary/20 rounded-2xl border border-dashed border-border">
                        <p className="text-muted-foreground italic text-sm">No active transfer proposals found.</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <LiquidGlassCard className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10"></div>
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Governance Rules
            </h3>
            <ul className="space-y-4 text-xs text-muted-foreground leading-relaxed">
              <li className="flex gap-3">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Owners can propose transfers for their own land tokens.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Registrars must vote to reach the approval threshold.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Threshold is currently set to 1 vote (Development Mode).</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Once threshold is met, anyone can trigger the execution.</span>
              </li>
            </ul>
          </LiquidGlassCard>
        </div>
      </div>
    </motion.div>
  );
};

export default TransferOwnership;
