import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Search, Share2, Users, Loader2, PieChart as PieIcon } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { landApi } from "@/lib/api/land";
import { useTransaction } from "@/components/TransactionProvider";
import GlassInput from "@/components/GlassInput";
import LiquidGlassButton from "@/components/LiquidGlassButton";
import LiquidGlassCard from "@/components/LiquidGlassCard";

const FractionalOwnership = () => {
  const { addTx, updateTx } = useTransaction();
  const [searchId, setSearchId] = useState('');
  const [activeLandId, setActiveLandId] = useState('');
  const [createData, setCreateData] = useState({ totalShares: '' });
  const [transferData, setTransferData] = useState({ to: '', shares: '' });

  const { data: sharesInfo, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['fractional-shares', activeLandId],
    queryFn: async () => {
      const res = await landApi.getFractionalShares(activeLandId);
      return res || { holders: [] };
    },
    enabled: !!activeLandId,
    retry: false
  });

  useEffect(() => {
    if (isError) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch fractional shares.');
    }
  }, [isError, error]);

  const createSharesMutation = useMutation({
    mutationFn: async (data: { totalShares: string }) => {
      if (!data.totalShares) throw new Error("Please enter total shares");
      return await landApi.createFractionalShares(activeLandId, data.totalShares);
    },
    onMutate: () => {
      const txId = Date.now().toString();
      addTx(txId, "Fractionalizing Land Parcel");
      return { txId };
    },
    onSuccess: (_, __, context) => {
      updateTx(context.txId, 'confirmed');
      toast.success("Parcel fractionalized successfully");
      refetch();
    },
    onError: (err: any, _, context) => {
      updateTx(context!.txId, 'failed');
      toast.error(err.response?.data?.message || err.message || "Something went wrong");
    }
  });

  const transferSharesMutation = useMutation({
    mutationFn: async (data: { to: string; shares: string }) => {
      if (!data.to || !data.shares) throw new Error("Please fill all fields");
      return await landApi.transferFractionalShares(activeLandId, data.to, data.shares);
    },
    onMutate: () => {
      const txId = Date.now().toString();
      addTx(txId, "Transferring Equity Shares");
      return { txId };
    },
    onSuccess: (_, __, context) => {
      updateTx(context.txId, 'confirmed');
      toast.success("Shares transferred successfully");
      setTransferData({ to: '', shares: '' });
      refetch();
    },
    onError: (err: any, _, context) => {
      updateTx(context!.txId, 'failed');
      toast.error(err.response?.data?.message || err.message || "Something went wrong");
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) {
      toast.error("Please enter a Land Token ID");
      return;
    }
    setActiveLandId(searchId);
  };

  const COLORS = ['#00E69A', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];
  const holdersList = sharesInfo?.holders || [];

  return (
    <motion.div {...fadeUp(0.1)} className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Fractional Ownership</h1>
        <p className="text-muted-foreground">Tokenize land parcels and distribute equity among multiple stakeholders securely.</p>
      </div>

      <LiquidGlassCard className="p-2 border-t-2 border-t-primary">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-transparent px-4 py-3 outline-none text-foreground placeholder:text-muted-foreground text-sm"
            placeholder="Enter Land Token ID (e.g. 1)..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <LiquidGlassButton type="submit" className="py-2.5 px-6">
            <Search className="w-4 h-4 mr-2" /> Find Parcel
          </LiquidGlassButton>
        </form>
      </LiquidGlassCard>

      <AnimatePresence mode="wait">
        {activeLandId && isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
          </motion.div>
        ) : activeLandId && sharesInfo ? (
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Share Distribution */}
            <LiquidGlassCard className="p-8">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-primary" />
                Equity Distribution
              </h2>
              {holdersList.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={holdersList}
                        dataKey="shares"
                        nameKey="address"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={60}
                        paddingAngle={5}
                      >
                        {holdersList.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#0A0A0A', 
                          borderRadius: '16px', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          color: '#fff',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-10 space-y-6">
                  <p className="text-muted-foreground text-sm italic">This parcel has not been fractionalized yet.</p>
                  <div className="max-w-xs mx-auto space-y-4 pt-4 border-t border-white/5">
                    <GlassInput 
                      id="totalShares" 
                      type="number" 
                      placeholder="Total Shares to Mint" 
                      value={createData.totalShares}
                      onChange={(e) => setCreateData({totalShares: e.target.value})}
                    />
                    <LiquidGlassButton 
                      onClick={() => createSharesMutation.mutate(createData)}
                      disabled={createSharesMutation.isPending} 
                      className="w-full"
                    >
                      {createSharesMutation.isPending ? 'Minting...' : 'Fractionalize Parcel'}
                    </LiquidGlassButton>
                  </div>
                </div>
              )}
            </LiquidGlassCard>

            {/* Shareholders & Management */}
            <div className="space-y-6">
              {holdersList.length > 0 && (
                <>
                  <LiquidGlassCard className="p-6">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Stakeholders ({holdersList.length})
                    </h2>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {holdersList.map((holder: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                          <span className="font-mono text-[10px] text-muted-foreground truncate mr-4">
                            {holder?.address}
                          </span>
                          <span className="font-bold text-xs bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 whitespace-nowrap">
                            {holder?.shares} Shares
                          </span>
                        </div>
                      ))}
                    </div>
                  </LiquidGlassCard>

                  <LiquidGlassCard className="p-6">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-primary" />
                      Transfer Equity
                    </h2>
                    <form onSubmit={(e) => { e.preventDefault(); transferSharesMutation.mutate(transferData); }} className="space-y-5">
                      <GlassInput
                        id="toAddress"
                        label="Recipient Address"
                        placeholder="0x..."
                        value={transferData.to}
                        onChange={(e) => setTransferData({...transferData, to: e.target.value})}
                      />
                      <GlassInput
                        id="shareAmount"
                        label="Number of Shares"
                        type="number"
                        placeholder="e.g. 100"
                        value={transferData.shares}
                        onChange={(e) => setTransferData({...transferData, shares: e.target.value})}
                      />
                      <LiquidGlassButton type="submit" disabled={transferSharesMutation.isPending} className="w-full mt-2">
                        {transferSharesMutation.isPending ? 'Transferring...' : 'Send Shares'}
                      </LiquidGlassButton>
                    </form>
                  </LiquidGlassCard>
                </>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

export default FractionalOwnership;
