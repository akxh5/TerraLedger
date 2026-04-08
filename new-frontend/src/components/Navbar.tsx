import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "System", href: "#system" },
  { label: "Explorer", href: "#activity" },
  { label: "Docs", href: "#" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-4 inset-x-0 mx-auto z-50 w-[95%] max-w-6xl rounded-2xl transition-all duration-500 ${
        scrolled ? "liquid-glass" : "bg-transparent"
      }`}
    >
      <div className="flex flex-row items-center justify-center gap-8 px-[12px] py-3 text-center">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="TerraLedger" className="w-8 h-8" />
          <span className="text-lg font-bold tracking-tight">TerraLedger</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <Link to="/login">
            <Button variant="outline" size="sm" className="liquid-glass border-0 text-foreground hover:text-foreground hover:bg-primary/10">
              Login
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden px-6 pb-4 flex flex-col gap-3"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link to="/login">
            <Button variant="outline" size="sm" className="w-full liquid-glass border-0 text-foreground">
              Login
            </Button>
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
