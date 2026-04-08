import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";
import NetworkBackground from "@/components/NetworkBackground";
import { ArrowRight, Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <NetworkBackground />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background z-[1]" />
      
      {/* Green glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-primary/8 blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <motion.div {...fadeUp(0)} className="mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass text-xs font-medium text-primary tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
            Blockchain-Powered Land Registry
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.15)}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-[-2px] leading-[0.95] mb-6"
        >
          Land Ownership.
          <br />
          <span className="font-serif-italic text-gradient-primary">Verified</span>{" "}
          On-Chain.
        </motion.h1>

        <motion.p
          {...fadeUp(0.3)}
          className="text-hero-subtitle text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Secure, transparent, dispute-resistant land registry powered by blockchain.
        </motion.p>

        <motion.div
          {...fadeUp(0.45)}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/dashboard">
            <Button size="lg" className="h-12 px-8 text-sm font-semibold rounded-xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(0,230,154,0.3)] transition-all duration-300">
              Launch Dashboard
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 text-sm font-semibold rounded-xl gap-2 liquid-glass border-0 text-foreground hover:text-foreground hover:bg-primary/10"
          >
            <Play size={14} />
            Request Demo
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
