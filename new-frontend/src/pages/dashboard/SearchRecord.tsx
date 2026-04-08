import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { Search, MapPin, User, FileDigit, Hash, AlertTriangle, Lock, Unlock, CheckCircle, X } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { landApi } from "@/lib/api/land";
import { useTransaction } from "@/components/TransactionProvider";
import GlassInput from "@/components/GlassInput";
import LiquidGlassButton from "@/components/LiquidGlassButton";
import LiquidGlassCard from "@/components/LiquidGlassCard";
import MapView from "@/components/MapView";

const SearchRecord = () => {
  const { addTx, updateTx } = useTransaction();
  const [searchParams, setSearchParams] = useState({ location: '', owner: '', minArea: '', maxArea: '' });
  const [activeParams, setActiveParams] = useState<any>(null);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedLandId, setSelectedLandId] = useState<string | null>(null);
  const [newOwnerAddress, setNewOwnerAddress] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isRegistrar = user?.role === 'ROLE_REGISTRAR';

  const { data: records, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['land-search', activeParams],
    queryFn: async () => {
      const res = await landApi.advancedSearch(activeParams);
      return Array.isArray(res) ? res : [];
    },
    enabled: !!activeParams,
    retry: false
  });

  useEffect(() => {
    if (isError) {
      toast.error(error instanceof Error ? error.message : "Failed to search records.");
    }
  }, [isError, error]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params: any = {};
    if (searchParams.location?.trim()) params.location = searchParams.location.trim();
    if (searchParams.owner?.trim()) params.owner = searchParams.owner.trim();
    if (searchParams.minArea) params.minArea = searchParams.minArea;
    if (searchParams.maxArea) params.maxArea = searchParams.maxArea;
    
    if (Object.keys(params).length > 0) {
      setActiveParams(params);
    } else {
      toast.error("Please enter at least one search filter");
    }
  };

  const freezeMutation = useMutation({
    mutationFn: async (id: string) => {
      const txId = Date.now().toString();
      addTx(txId, "Freezing Property Assets");
      try {
        const res = await landApi.freezeLand(id);
        updateTx(txId, 'confirmed');
        toast.success("Property frozen successfully");
        return res;
      } catch (err) {
        updateTx(txId, 'failed');
        throw err;
      }
    },
    onSuccess: () => refetch()
  });

  const unfreezeMutation = useMutation({
    mutationFn: async (id: string) => {
      const txId = Date.now().toString();
      addTx(txId, "Unfreezing Property Assets");
      try {
        const res = await landApi.unfreezeLand(id);
        updateTx(txId, 'confirmed');
        toast.success("Property unfrozen successfully");
        return res;
      } catch (err) {
        updateTx(txId, 'failed');
        throw err;
      }
    },
    onSuccess: () => refetch()
  });

  const resolveDisputeMutation = useMutation({
    mutationFn: async ({ id, newOwner }: { id: string, newOwner: string }) => {
      const txId = Date.now().toString();
      addTx(txId, "Resolving Legal Dispute");
      try {
        const res = await landApi.resolveDispute(id, newOwner);
        updateTx(txId, 'confirmed');
        toast.success("Dispute resolved and owner updated");
        return res;
      } catch (err) {
        updateTx(txId, 'failed');
        throw err;
      }
    },
    onSuccess: () => {
      setResolveModalOpen(false);
      setNewOwnerAddress('');
      refetch();
    }
  });

  const safeRecords = Array.isArray(records) ? records : [];

  return (
    <motion.div {...fadeUp(0.1)} className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Advanced Registry Search</h1>
        <p className="text-muted-foreground">Query the immutable ledger using advanced spatial and ownership filters.</p>
      </div>

      <LiquidGlassCard className="p-6">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassInput
              id="location"
              label="Location"
              placeholder="e.g. Bhopal"
              value={searchParams.location}
              onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
            />
            <GlassInput
              id="owner"
              label="Owner Address"
              placeholder="0x..."
              value={searchParams.owner}
              onChange={(e) => setSearchParams({...searchParams, owner: e.target.value})}
            />
            <GlassInput
              id="minArea"
              label="Min Area (sq m)"
              type="number"
              placeholder="e.g. 500"
              value={searchParams.minArea}
              onChange={(e) => setSearchParams({...searchParams, minArea: e.target.value})}
            />
            <GlassInput
              id="maxArea"
              label="Max Area (sq m)"
              type="number"
              placeholder="e.g. 2000"
              value={searchParams.maxArea}
              onChange={(e) => setSearchParams({...searchParams, maxArea: e.target.value})}
            />
          </div>
          <div className="flex justify-end">
            <LiquidGlassButton type="submit" disabled={isLoading} className="px-8">
              {isLoading ? 'Searching...' : <><Search className="w-4 h-4 mr-2" /> Search</>}
            </LiquidGlassButton>
          </div>
        </form>
      </LiquidGlassCard>

      <AnimatePresence>
        {safeRecords.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h2 className="text-xl font-bold">Search Results ({safeRecords.length})</h2>
            {safeRecords.map((record, index) => (
              <motion.div 
                key={record?.landId || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <LiquidGlassCard className={`p-6 relative overflow-hidden ${record?.isFrozen ? 'border-destructive/30 bg-destructive/5' : ''}`}>
                  <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-6">
                    <div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary mb-3 inline-block border border-primary/20 uppercase tracking-widest">
                        Verified Record
                      </span>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <FileDigit className="text-primary w-6 h-6" />
                        {record?.landId || 'Unknown ID'}
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                      {record?.isFrozen ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-destructive/20 text-destructive font-bold border border-destructive/30 text-xs">
                          <Lock className="w-4 h-4" /> FROZEN
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary/10 text-primary font-bold border border-primary/20 text-xs">
                          <CheckCircle className="w-4 h-4" /> ACTIVE
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                          <User className="w-3.5 h-3.5" /> Current Owner
                        </p>
                        <p className="font-semibold text-lg">{record?.ownerName || 'Unknown'}</p>
                        <p className="text-xs font-mono text-muted-foreground mt-1 truncate">{record?.ownerAddress}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5" /> Location
                        </p>
                        <p className="font-medium">{record?.location || 'N/A'}</p>
                      </div>
                      {record?.latitude && record?.longitude && (
                        <MapView 
                          latitude={record.latitude} 
                          longitude={record.longitude} 
                          landId={record.landId} 
                          geoJsonBoundary={record.geoJsonBoundary}
                        />
                      )}
                    </div>
                    <div className="space-y-6">
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                          <Hash className="w-3.5 h-3.5" /> Area size
                        </p>
                        <p className="font-medium text-lg">{record?.area || 0} m²</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-2">
                          <FileDigit className="w-3.5 h-3.5" /> IPFS Document Hash
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground bg-black/40 p-3 rounded-lg break-all border border-white/5">
                          {record?.documentHash || 'None'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {isRegistrar && (
                    <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-3">
                      {!record?.isFrozen ? (
                        <LiquidGlassButton 
                          onClick={() => freezeMutation.mutate(record?.id)}
                          disabled={freezeMutation.isPending}
                          variant="secondary"
                          className="text-destructive hover:border-destructive/50 py-2 text-xs"
                        >
                          <Lock className="w-3.5 h-3.5 mr-2" /> Freeze Property
                        </LiquidGlassButton>
                      ) : (
                        <>
                          <LiquidGlassButton 
                            onClick={() => unfreezeMutation.mutate(record?.id)}
                            disabled={unfreezeMutation.isPending}
                            variant="secondary"
                            className="text-primary hover:border-primary/50 py-2 text-xs"
                          >
                            <Unlock className="w-3.5 h-3.5 mr-2" /> Unfreeze Property
                          </LiquidGlassButton>
                          <LiquidGlassButton 
                            onClick={() => { setSelectedLandId(record?.id); setResolveModalOpen(true); }}
                            variant="secondary"
                            className="text-orange-400 hover:border-orange-400/50 py-2 text-xs"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 mr-2" /> Resolve Dispute
                          </LiquidGlassButton>
                        </>
                      )}
                    </div>
                  )}
                </LiquidGlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {activeParams && !isLoading && !isError && safeRecords.length === 0 && (
        <div className="text-center text-muted-foreground py-16 bg-secondary/20 rounded-2xl border border-dashed border-border">
          No records found matching your criteria.
        </div>
      )}

      {resolveModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <LiquidGlassCard className="max-w-md w-full p-8 border-orange-500/30">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <AlertTriangle className="text-orange-400" /> Resolve Dispute
                </h3>
                <button onClick={() => setResolveModalOpen(false)} className="text-muted-foreground hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <p className="text-muted-foreground text-sm mb-6">
                This action will force-transfer the frozen property to a new owner and unfreeze it. This action is irreversible.
              </p>
              <div className="space-y-6">
                <GlassInput 
                  id="newOwner" 
                  label="New Owner Address" 
                  placeholder="0x..." 
                  value={newOwnerAddress}
                  onChange={(e) => setNewOwnerAddress(e.target.value)}
                />
                <div className="flex gap-3">
                  <LiquidGlassButton 
                    onClick={() => setResolveModalOpen(false)}
                    variant="secondary"
                    className="flex-1"
                  >
                    Cancel
                  </LiquidGlassButton>
                  <LiquidGlassButton 
                    onClick={() => resolveDisputeMutation.mutate({ id: selectedLandId!, newOwner: newOwnerAddress })}
                    disabled={!newOwnerAddress || resolveDisputeMutation.isPending}
                    className="flex-1"
                  >
                    {resolveDisputeMutation.isPending ? 'Resolving...' : 'Confirm'}
                  </LiquidGlassButton>
                </div>
              </div>
            </LiquidGlassCard>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default SearchRecord;
