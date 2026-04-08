import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { Activity, Clock, Database, CheckCircle, Cpu, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { landApi } from "@/lib/api/land";
import { createWebSocketClient } from "@/lib/services/websocket";
import LiquidGlassCard from "@/components/LiquidGlassCard";
import { toast } from "sonner";

const Explorer = () => {
  const [timedOut, setTimedOut] = useState(false);

  const { data: events = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['blockchain-events'],
    queryFn: landApi.getBlockchainEvents,
    staleTime: 30000,
    retry: 1,
    retryDelay: 2000,
  });

  useEffect(() => {
    let client: any;
    let isMounted = true;

    const connect = () => {
      try {
        client = createWebSocketClient((message: string) => {
          if (!isMounted) return;
          refetch();
          toast.info("Ledger synchronized", {
            description: message,
          });
        });
      } catch (e) {
        console.error("WebSocket initialization failed", e);
      }
    };

    connect();

    return () => {
      isMounted = false;
      if (client) client.deactivate();
    };
  }, [refetch]);

  // Timeout fallback
  useEffect(() => {
    if (isLoading) {
      setTimedOut(false);
      const timer = setTimeout(() => setTimedOut(true), 8000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const getIconAndColor = (type: string) => {
    switch (type) {
      case 'LandRegistered': return { icon: Database, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' };
      case 'TransferInitiated': return { icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
      case 'TransferApprovalReceived': return { icon: Cpu, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' };
      case 'TransferFinalized': return { icon: CheckCircle, color: 'text-primary', bg: 'bg-primary/10 border-primary/20' };
      default: return { icon: Activity, color: 'text-muted-foreground', bg: 'bg-white/5 border-white/10' };
    }
  };

  if (isLoading && !timedOut) return (
    <div className="flex flex-col items-center justify-center p-24 min-h-[400px]">
      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground animate-pulse text-xs font-bold tracking-widest uppercase">Fetching Ledger Events...</p>
    </div>
  );

  if (isError || timedOut) return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
      <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20 mb-4 text-destructive">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold mb-2">{timedOut ? 'Connection Timeout' : 'Sync Failed'}</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6 text-sm">
        {timedOut 
          ? 'The blockchain indexer is taking too long to respond. The node may be starting up.'
          : (error instanceof Error ? error.message : "Couldn't reach the blockchain indexing node.")}
      </p>
      <button 
        onClick={() => { setTimedOut(false); refetch(); }}
        className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-foreground transition-all text-sm font-medium"
      >
        <RefreshCw className="w-4 h-4" />
        Retry
      </button>
    </div>
  );

  return (
    <motion.div {...fadeUp(0.1)} className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Live Explorer
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Block Explorer</h1>
          <p className="text-muted-foreground">Querying real-time indexed data from the internal blockchain network.</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 rounded-xl bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all border border-white/10 text-xs font-bold flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          REFRESH
        </button>
      </div>

      <LiquidGlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                <th className="py-6 pl-8">Block</th>
                <th className="py-6">Type</th>
                <th className="py-6">Details</th>
                <th className="py-6">Tx Hash</th>
                <th className="py-6 pr-8 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {events && events.length > 0 ? events.map((ev: any, i: number) => {
                const style = getIconAndColor(ev?.eventType);
                const Icon = style.icon;
                return (
                  <tr key={ev?.id || i} className="group border-b border-white/5 hover:bg-white/[0.02] transition-all duration-300">
                    <td className="py-5 pl-8 font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                      #{ev?.blockNumber || '?'}
                    </td>
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border ${style.bg} ${style.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-foreground/90 text-xs">{ev?.eventType || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-5 text-muted-foreground max-w-xs" title={ev?.eventData}>
                      <div className="truncate text-xs group-hover:text-foreground transition-colors">
                        {ev?.eventData || 'N/A'}
                      </div>
                    </td>
                    <td className="py-5 font-mono text-[10px] text-muted-foreground/50 max-w-[140px]" title={ev?.transactionHash}>
                      <div className="truncate bg-white/5 px-2 py-1 rounded w-fit group-hover:bg-white/10 transition-colors">
                        {ev?.transactionHash || '0x00'}
                      </div>
                    </td>
                    <td className="py-5 pr-8 text-right text-muted-foreground whitespace-nowrap font-medium text-xs">
                      {ev?.timestamp ? new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Just now'}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="text-center py-20">
                    <Database className="w-12 h-12 text-white/5 mx-auto mb-4" />
                    <p className="text-muted-foreground/40 font-bold uppercase tracking-widest text-xs">No events indexed yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </LiquidGlassCard>
    </motion.div>
  );
};

export default Explorer;
