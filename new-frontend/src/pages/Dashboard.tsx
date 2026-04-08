import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import {
  LayoutDashboard,
  MapPin,
  FileCheck,
  Globe,
  Bell,
  Search,
  ChevronDown,
  History,
  FileText,
  ShieldCheck,
  Send,
  PieChart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link, Outlet, NavLink, useNavigate } from "react-router-dom";
import { authApi } from "@/lib/api/land";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="border-b border-border/50 px-6 py-3 sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="TerraLedger" className="w-7 h-7" />
              <span className="font-bold text-sm">TerraLedger</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <Input
                placeholder="Search parcels..."
                className="pl-8 h-8 w-48 text-xs bg-secondary border-border/50 rounded-lg"
              />
            </div>
            <button className="relative w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
              <Bell size={14} className="text-muted-foreground" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="group relative">
              <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-secondary transition-colors">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary uppercase">
                  {user.email?.substring(0, 2) || 'TL'}
                </div>
                <ChevronDown size={12} className="text-muted-foreground" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 py-1 liquid-glass rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs hover:bg-white/5 transition-colors text-destructive"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex gap-8 px-6 py-8">
        {/* Sidebar Navigation */}
        <aside className="w-64 shrink-0 hidden lg:block space-y-6">
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Main Menu</p>
            {[
              { label: "Overview", icon: LayoutDashboard, path: "/dashboard", end: true },
              { label: "Search Registry", icon: Search, path: "/dashboard/search" },
              { label: "Register Land", icon: FileCheck, path: "/dashboard/register" },
              { label: "Transfer Ownership", icon: Send, path: "/dashboard/transfer" },
            ].map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.end}
                className={({ isActive }) => `
                  flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300
                  ${isActive 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,230,154,0.1)]" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"}
                `}
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Advanced</p>
            {[
              { label: "Fractionalize", icon: PieChart, path: "/dashboard/fractional" },
              { label: "Ownership History", icon: History, path: "/dashboard/history" },
              { label: "Block Explorer", icon: Globe, path: "/dashboard/explorer" },
              { label: "Audit Logs", icon: ShieldCheck, path: "/dashboard/audit" },
            ].map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300
                  ${isActive 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,230,154,0.1)]" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"}
                `}
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
