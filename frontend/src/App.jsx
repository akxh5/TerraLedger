import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import RegisterLand from './pages/RegisterLand';
import SearchRecord from './pages/SearchRecord';
import TransferOwnership from './pages/TransferOwnership';
import OwnershipHistory from './pages/OwnershipHistory';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="register" element={<RegisterLand />} />
            <Route path="search" element={<SearchRecord />} />
            <Route path="transfer" element={<TransferOwnership />} />
            <Route path="history" element={<OwnershipHistory />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Global Toast Provider with Glassmorphism Overrides */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            color: '#1e293b',
            borderRadius: '16px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
