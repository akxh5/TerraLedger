import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { Search, History, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { landApi } from "@/lib/api/land";
import LiquidGlassCard from "@/components/LiquidGlassCard";
import LiquidGlassButton from "@/components/LiquidGlassButton";
import Timeline from "@/components/Timeline";

const OwnershipHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const { data: history, isLoading, isError, error } = useQuery({
    queryKey: ['history', activeSearch],
    queryFn: async () => {
      const res = await landApi.getOwnershipHistory(activeSearch);
      return Array.isArray(res) ? res : [];
    },
    enabled: !!activeSearch,
    retry: false
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setActiveSearch(searchTerm.trim());
    } else {
      toast.error("Please enter a Land ID");
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch ownership history.');
    }
  }, [isError, error]);

  const safeHistory = Array.isArray(history) ? history : [];

  return (
    <motion.div {...fadeUp(0.1)} className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Ownership History</h1>
        <p className="text-muted-foreground">View the immutable timeline of land transfers and registrations.</p>
      </div>

      <LiquidGlassCard className="p-2 border-t-2 border-t-primary">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-transparent px-4 py-3 outline-none text-foreground placeholder:text-muted-foreground text-sm"
            placeholder="Enter Land ID (e.g. 1)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <LiquidGlassButton type="submit" disabled={isLoading} className="px-8">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4 mr-2" /> Search</>}
          </LiquidGlassButton>
        </form>
      </LiquidGlassCard>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
          </motion.div>
        ) : activeSearch && safeHistory.length === 0 && !isError ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-muted-foreground py-16 bg-secondary/20 rounded-2xl border border-dashed border-border">
            No history found for this ID.
          </motion.div>
        ) : safeHistory.length > 0 ? (
          <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <LiquidGlassCard className="p-8">
              <h2 className="text-xl font-bold mb-10 flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Immutable Timeline for {activeSearch}
              </h2>
              <Timeline events={safeHistory} />
            </LiquidGlassCard>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

export default OwnershipHistory;
