import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

const SolutionSection = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          {...fadeUp(0)}
          className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center justify-center"
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/8 to-transparent" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
          
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          <motion.div {...fadeUp(0.2)} className="relative z-10 text-center px-6 py-20">
            <div className="liquid-glass rounded-2xl px-8 py-10 md:px-16 md:py-14 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                The infrastructure for{" "}
                <span className="font-serif-italic text-gradient-primary">modern</span> land ownership
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                From registration to transfer, TerraLedger provides a complete, transparent, and tamper-proof system for managing land rights globally.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;
