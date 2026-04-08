import { useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { ShieldCheck, User, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { landApi } from "@/lib/api/land";
import LiquidGlassCard from "@/components/LiquidGlassCard";

const AuditLog = () => {
  const { data: logs, isLoading, isError, error } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const res = await landApi.getAuditLogs();
      return Array.isArray(res) ? res : [];
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error(error instanceof Error ? error.message : "Failed to load audit logs.");
    }
  }, [isError, error]);

  if (isLoading) return (
    <div className="flex justify-center p-24">
      <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
    </div>
  );

  const safeLogs = Array.isArray(logs) ? logs : [];

  return (
    <motion.div {...fadeUp(0.1)} className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Immutable Audit Log</h1>
        <p className="text-muted-foreground">Tamper-proof record of all actions performed on the platform via connected wallets.</p>
      </div>

      <LiquidGlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                <th className="py-6 pl-8">ID</th>
                <th className="py-6">Action</th>
                <th className="py-6">Wallet</th>
                <th className="py-6">Tx Hash</th>
                <th className="py-6 pr-8 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {safeLogs.length > 0 ? safeLogs.map((log: any, i: number) => (
                <tr key={log?.id || i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-5 pl-8 font-mono text-xs text-muted-foreground/60">#{log?.id || i + 1}</td>
                  <td className="py-5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span className="font-bold text-foreground/90 text-xs">{log?.action || 'System Process'}</span>
                    </div>
                  </td>
                  <td className="py-5 font-mono text-[10px] text-muted-foreground truncate" title={log?.userWallet}>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
                        <User className="w-3 h-3 text-muted-foreground/50" />
                      </div>
                      {log?.userWallet ? `${log.userWallet.substring(0, 6)}...${log.userWallet.substring(log.userWallet.length - 4)}` : '0x00...0000'}
                    </div>
                  </td>
                  <td className="py-5 font-mono text-[10px] text-muted-foreground/40 max-w-[120px] truncate" title={log?.transactionHash}>
                    {log?.transactionHash || 'Pending...'}
                  </td>
                  <td className="py-5 pr-8 text-right text-muted-foreground whitespace-nowrap text-xs">
                    {log?.timestamp ? new Date(log.timestamp).toLocaleString() : 'Just now'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="text-center py-20">
                    <ShieldCheck className="w-12 h-12 text-white/5 mx-auto mb-4" />
                    <p className="text-muted-foreground/40 font-bold uppercase tracking-widest text-xs">No logs found</p>
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

export default AuditLog;
