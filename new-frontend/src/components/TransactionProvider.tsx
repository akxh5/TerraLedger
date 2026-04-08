import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, Loader2, XCircle, Copy } from 'lucide-react';
import LiquidGlassCard from './LiquidGlassCard';

interface Transaction {
    id: string;
    title: string;
    status: 'submitting' | 'processing' | 'confirmed' | 'failed';
    hash: string | null;
}

interface TransactionContextType {
    addTx: (id: string, title: string) => void;
    updateTx: (id: string, status: Transaction['status'], hash?: string | null) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransaction = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransaction must be used within a TransactionProvider');
    }
    return context;
};

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
  const [txs, setTxs] = useState<Transaction[]>([]);

  const addTx = useCallback((id: string, title: string) => {
    setTxs(prev => [...prev, { id, title, status: 'submitting', hash: null }]);
  }, []);

  const updateTx = useCallback((id: string, status: Transaction['status'], hash: string | null = null) => {
    setTxs(prev => prev.map(tx => tx.id === id ? { ...tx, status, hash: hash || tx.hash } : tx));
    
    // Auto-remove after some time if confirmed or failed
    if (status === 'confirmed' || status === 'failed') {
      setTimeout(() => {
        setTxs(prev => prev.filter(tx => tx.id !== id));
      }, 8000);
    }
  }, []);

  return (
    <TransactionContext.Provider value={{ addTx, updateTx }}>
      {children}
      <div className="fixed top-24 right-6 z-[60] flex flex-col gap-4 w-80 pointer-events-none">
        {txs.map(tx => (
          <div key={tx.id} className="pointer-events-auto animate-in slide-in-from-right-8 fade-in duration-500">
            <LiquidGlassCard className={`p-4 border-l-4 ${
              tx.status === 'confirmed' ? 'border-l-[#00E69A]' : 
              tx.status === 'failed' ? 'border-l-red-500' : 'border-l-blue-500'
            } shadow-2xl`}>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {tx.status === 'submitting' || tx.status === 'processing' ? (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                  ) : tx.status === 'confirmed' ? (
                    <CheckCircle className="w-5 h-5 text-[#00E69A]" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white mb-1 truncate">{tx.title}</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      tx.status === 'confirmed' ? 'text-[#00E69A]' : 
                      tx.status === 'failed' ? 'text-red-500' : 'text-blue-400'
                    }`}>
                      {tx.status}
                    </span>
                    <div className="flex-1 h-[1px] bg-white/10"></div>
                  </div>

                  {tx.hash && (
                    <div className="flex items-center justify-between bg-black/40 rounded-lg p-2 border border-white/5 mb-2">
                      <span className="text-[10px] font-mono text-white/40 truncate mr-2">{tx.hash}</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(tx.hash!)}
                        className="p-1 hover:text-[#00E69A] transition-colors text-white/20"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {tx.status === 'confirmed' && (
                    <span className="text-[10px] font-bold text-[#00E69A] flex items-center gap-1">
                      ✓ CONFIRMED ON LEDGER
                    </span>
                  )}
                </div>
              </div>
            </LiquidGlassCard>
          </div>
        ))}
      </div>
    </TransactionContext.Provider>
  );
};
