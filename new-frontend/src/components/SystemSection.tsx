import { motion } from "framer-motion";
import { fadeUp, hoverGlow } from "@/lib/animations";
import { Fingerprint, Users, HardDrive, MapPin } from "lucide-react";

const features = [
  {
    icon: Fingerprint,
    title: "NFT Ownership",
    description: "Each land parcel is tokenized as a unique NFT with immutable provenance on-chain.",
  },
  {
    icon: Users,
    title: "DAO Governance",
    description: "Community-driven dispute resolution and policy updates through decentralized governance.",
  },
  {
    icon: HardDrive,
    title: "IPFS Storage",
    description: "Documents and survey data stored on IPFS for censorship-resistant, permanent access.",
  },
  {
    icon: MapPin,
    title: "GIS Mapping",
    description: "Precise geospatial boundaries integrated with satellite imagery and survey data.",
  },
];

const SystemSection = () => {
  return (
    <section id="system" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-wider uppercase mb-3 block">
            The System
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            How <span className="font-serif-italic text-gradient-primary">TerraLedger</span> works
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A complete infrastructure stack for modern land administration.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              {...fadeUp(0.1 * (i + 1))}
              {...hoverGlow}
              className="liquid-glass rounded-2xl p-6 group cursor-default"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="text-primary" size={20} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SystemSection;
