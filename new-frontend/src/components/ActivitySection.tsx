import { motion, AnimatePresence } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { useEffect, useState } from "react";
import { ArrowRightLeft, UserCheck, FileCheck, MapPin } from "lucide-react";

const txTypes = [
  { icon: ArrowRightLeft, label: "Transfer", color: "text-primary" },
  { icon: UserCheck, label: "Verification", color: "text-primary" },
  { icon: FileCheck, label: "Registration", color: "text-primary" },
  { icon: MapPin, label: "Survey", color: "text-primary" },
];

const generateTx = (id: number) => {
  const type = txTypes[Math.floor(Math.random() * txTypes.length)];
  const hash = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`;
  const regions = ["Nairobi", "Lagos", "Accra", "Kigali", "Dar es Salaam", "Kampala"];
  return {
    id,
    type,
    hash,
    region: regions[Math.floor(Math.random() * regions.length)],
    time: "Just now",
  };
};

const ActivitySection = () => {
  const [transactions, setTransactions] = useState(() =>
    Array.from({ length: 5 }, (_, i) => generateTx(i))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTransactions((prev) => {
        const newTx = generateTx(Date.now());
        return [newTx, ...prev.slice(0, 4)];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="activity" className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <span className="text-primary text-sm font-medium tracking-wider uppercase mb-3 block">
            Live Explorer
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            On-Chain <span className="font-serif-italic text-gradient-primary">Activity</span>
          </h2>
        </motion.div>

        <motion.div {...fadeUp(0.2)} className="liquid-glass rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border/50 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-xs text-muted-foreground font-medium">LIVE FEED</span>
          </div>
          <div className="divide-y divide-border/30">
            <AnimatePresence mode="popLayout">
              {transactions.map((tx) => {
                const Icon = tx.type.icon;
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: "auto" }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-4 px-6 py-4"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="text-primary" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{tx.type.label}</span>
                        <span className="text-xs text-muted-foreground">• {tx.region}</span>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{tx.hash}</span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{tx.time}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ActivitySection;
