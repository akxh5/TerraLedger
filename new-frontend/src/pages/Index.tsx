import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SystemSection from "@/components/SystemSection";
import ActivitySection from "@/components/ActivitySection";
import SolutionSection from "@/components/SolutionSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SystemSection />
      <ActivitySection />
      <SolutionSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
