import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import NotFound from "./pages/NotFound.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { TransactionProvider } from "./components/TransactionProvider.tsx";

// Dashboard sub-pages
import Overview from "./pages/dashboard/Overview.tsx";
import RegisterLand from "./pages/dashboard/RegisterLand.tsx";
import SearchRecord from "./pages/dashboard/SearchRecord.tsx";
import TransferOwnership from "./pages/dashboard/TransferOwnership.tsx";
import FractionalOwnership from "./pages/dashboard/FractionalOwnership.tsx";
import OwnershipHistory from "./pages/dashboard/OwnershipHistory.tsx";
import Explorer from "./pages/dashboard/Explorer.tsx";
import AuditLog from "./pages/dashboard/AuditLog.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TransactionProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }>
              <Route index element={<Overview />} />
              <Route path="register" element={<RegisterLand />} />
              <Route path="search" element={<SearchRecord />} />
              <Route path="transfer" element={<TransferOwnership />} />
              <Route path="fractional" element={<FractionalOwnership />} />
              <Route path="history" element={<OwnershipHistory />} />
              <Route path="explorer" element={<Explorer />} />
              <Route path="audit" element={<AuditLog />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TransactionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
