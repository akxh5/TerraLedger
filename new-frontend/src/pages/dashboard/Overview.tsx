import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUp, hoverGlow } from "@/lib/animations";
import {
  MapPin,
  FileCheck,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { landApi } from "@/lib/api/land";
import { createWebSocketClient } from "@/lib/services/websocket";
import { toast } from "sonner";

const Overview = () => {
  const [liveEvents, setLiveEvents] = useState<string[]>([]);

  const { data: statsData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['stats'],
    queryFn: landApi.getStats,
    retry: 2,
  });

  useEffect(() => {
    let client: any;
    let isMounted = true;

    const connect = () => {
      try {
        client = createWebSocketClient((message: string) => {
          if (!isMounted) return;
          setLiveEvents(prev => [message, ...prev].slice(0, 5));
          refetch();
          toast.info("New ledger event received", {
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

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
        <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20 mb-4 text-destructive">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Analytics Offline</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          {error instanceof Error ? error.message : "Unable to fetch platform statistics."}
        </p>
        <Button 
          onClick={() => refetch()}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </Button>
      </div>
    );
  }

  const stats = [
    { label: "Total Parcels", value: isLoading ? "..." : statsData?.totalRecords || 0, change: "+2.4%", up: true, icon: MapPin },
    { label: "Verified Titles", value: isLoading ? "..." : statsData?.totalRecords || 0, change: "+5.1%", up: true, icon: FileCheck },
    { label: "Total Transfers", value: isLoading ? "..." : statsData?.totalTransfers || 0, change: "+1.8%", up: true, icon: Activity },
    { label: "Avg Parcel Size", value: isLoading ? "..." : Math.round(statsData?.avgLandArea || 0) + " m²", change: "-1.2%", up: false, icon: Users },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            {...fadeUp(0.05 * i)}
            {...hoverGlow}
            className="liquid-glass rounded-xl p-5 cursor-default"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="text-primary" size={16} />
              </div>
              <span
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  stat.up ? "text-primary" : "text-destructive"
                }`}
              >
                {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold tracking-tight">
              {isLoading ? (
                <span className="inline-block w-16 h-8 bg-white/5 animate-pulse rounded"></span>
              ) : stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Activity Section */}
      <motion.div {...fadeUp(0.2)} className="liquid-glass rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Live Network Feed</h3>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
            View All
          </Button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {liveEvents.length > 0 ? (
              liveEvents.map((event, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl bg-secondary/30 border border-border/50 flex items-start gap-4 hover:bg-secondary/50 transition-all duration-300"
                >
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                    TX
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground leading-tight mb-1">{event}</p>
                    <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">Confirmed • Just now</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-muted-foreground/20" />
                </div>
                <p className="text-muted-foreground/40 font-medium italic text-sm px-4">Listening for validated on-chain events...</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;
