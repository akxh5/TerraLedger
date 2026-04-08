import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Wallet, ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo.png";
import { authApi } from "@/lib/api/land";
import { walletService } from "@/lib/services/wallet";
import { toast } from "sonner";

const Login = () => {
  const [mode, setMode] = useState<"select" | "government" | "wallet">("select");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGovernmentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.login(email, password);
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletLogin = async () => {
    setIsLoading(true);
    try {
      const { address, signature, message } = await walletService.signLoginMessage();
      await authApi.walletLogin(address, signature, message);
      toast.success("Wallet connected successfully");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Wallet login error:", error);
      toast.error(error.message || "Failed to login with wallet");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-primary/8 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src={logo} alt="TerraLedger" className="w-8 h-8" />
            <span className="text-lg font-bold">TerraLedger</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
          <p className="text-muted-foreground text-sm">Choose your login method</p>
        </div>

        <div className="liquid-glass rounded-2xl p-8">
          <AnimatePresence mode="wait">
            {mode === "select" && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <button
                  onClick={() => setMode("government")}
                  className="w-full liquid-glass rounded-xl p-5 flex items-center gap-4 hover:bg-primary/5 transition-all duration-300 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Building2 className="text-primary" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">Government Login</p>
                    <p className="text-xs text-muted-foreground">Official credentials</p>
                  </div>
                </button>
                <button
                  onClick={() => setMode("wallet")}
                  className="w-full liquid-glass rounded-xl p-5 flex items-center gap-4 hover:bg-primary/5 transition-all duration-300 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Wallet className="text-primary" size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">Wallet Connect</p>
                    <p className="text-xs text-muted-foreground">MetaMask, WalletConnect</p>
                  </div>
                </button>
              </motion.div>
            )}

            {mode === "government" && (
              <motion.div
                key="government"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <button
                  onClick={() => setMode("select")}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <form onSubmit={handleGovernmentLogin} className="space-y-5">
                  <div className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        className="pl-10 h-11 bg-secondary border-border/50 rounded-xl"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="pl-10 pr-10 h-11 bg-secondary border-border/50 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </motion.div>
            )}

            {mode === "wallet" && (
              <motion.div
                key="wallet"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <button
                  onClick={() => setMode("select")}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <div className="space-y-3">
                  <button
                    onClick={handleWalletLogin}
                    disabled={isLoading}
                    className="w-full liquid-glass rounded-xl p-4 text-sm font-medium hover:bg-primary/5 transition-all duration-300 text-left flex items-center justify-between"
                  >
                    <span>MetaMask</span>
                    {isLoading && <span className="text-xs animate-pulse">Connecting...</span>}
                  </button>
                  {["WalletConnect", "Coinbase Wallet"].map((wallet) => (
                    <button
                      key={wallet}
                      disabled={true}
                      className="w-full liquid-glass rounded-xl p-4 text-sm font-medium opacity-50 cursor-not-allowed text-left"
                    >
                      {wallet}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
