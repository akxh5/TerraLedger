import { motion } from "framer-motion";
import { fadeUp, hoverGlow } from "@/lib/animations";
import { ShieldAlert, Scale, Building2 } from "lucide-react";

const problems = [
  {
    icon: ShieldAlert,
    title: "Rampant Fraud",
    description: "Forged documents and duplicate titles plague traditional registries, costing billions annually.",
  },
  {
    icon: Scale,
    title: "Endless Disputes",
    description: "Land conflicts take years to resolve in overloaded court systems with no single source of truth.",
  },
  {
    icon: Building2,
    title: "Institutional Corruption",
    description: "Centralized registries are vulnerable to manipulation by corrupt officials and bureaucrats.",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Land ownership is{" "}
            <span className="font-serif-italic text-gradient-primary">broken</span>.
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            The world's land registries are outdated, opaque, and rife with corruption.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, i) => (
            <motion.div
              key={problem.title}
              {...fadeUp(0.1 * (i + 1))}
              {...hoverGlow}
              className="liquid-glass rounded-2xl p-8 group cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <problem.icon className="text-primary" size={22} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
