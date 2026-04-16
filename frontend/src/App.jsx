import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import RegisterLand from './pages/RegisterLand';
import SubmitLand from './pages/SubmitLand';
import SearchRecord from './pages/SearchRecord';
import TransferOwnership from './pages/TransferOwnership';
import OwnershipHistory from './pages/OwnershipHistory';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 10000,
    },
  },
});

/** Checks localStorage for a valid JWT session */
const ProtectedRoute = ({ children }) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.token) return <Navigate to="/login" replace />;
    return children;
  } catch {
    return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected dashboard */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="register" element={<RegisterLand />} />
            <Route path="submit-land" element={<SubmitLand />} />
            <Route path="search" element={<SearchRecord />} />
            <Route path="transfer" element={<TransferOwnership />} />
            <Route path="history" element={<OwnershipHistory />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Global Toast Provider with Dark Refractive Glassmorphism */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(16px) saturate(150%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: 'inset 1px 1px 3px rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.4)',
            color: '#f8fafc',
            borderRadius: '16px',
            padding: '16px',
            fontFamily: "'Inter', sans-serif"
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#0f172a' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0f172a' },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
