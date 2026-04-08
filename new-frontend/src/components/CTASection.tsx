import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[200px]" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div {...fadeUp(0)}>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Start Using{" "}
            <span className="font-serif-italic text-gradient-primary">TerraLedger</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">
            Join governments, surveyors, and institutions building the future of land administration.
          </p>
        </motion.div>

        <motion.div {...fadeUp(0.2)} className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
            <Mail size={16} />
            Contact Us
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
