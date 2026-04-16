import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/land';
import { walletService } from '../services/wallet';
import toast from 'react-hot-toast';
import { Shield, Wallet, Mail, Lock, ArrowRight, AlertTriangle } from 'lucide-react';
import Logo from '../components/ui/Logo';

const LoginPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('registrar');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [walletError, setWalletError] = useState('');
    const [showWalletModal, setShowWalletModal] = useState(false);

    const handleRegistrarLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) { toast.error('Please fill in all fields'); return; }
        setIsLoading(true);
        try {
            const data = await authApi.login(email, password);
            toast.success(`Welcome, ${data.role}`);
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Login failed';
            toast.error(typeof msg === 'string' ? msg : 'Invalid credentials');
        } finally { setIsLoading(false); }
    };

    const handleWalletLogin = async (walletType) => {
        setWalletError('');
        setIsLoading(true);
        setShowWalletModal(false);
        try {
            if (walletType === 'phantom') {
                await walletService.connectPhantom();
            } else {
                await walletService.connectMetaMask();
            }
            const { address, signature } = await walletService.signLoginMessage();
            const data = await authApi.walletLogin(address, signature);
            toast.success(`Connected: ${walletService.shortenAddress(address)}`);
            navigate('/');
        } catch (err) {
            if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
                setWalletError('Signature request rejected. Please try again.');
            } else if (err.code === -32002) {
                setWalletError('Wallet request pending — check your extension.');
            } else {
                setWalletError(err.response?.data?.message || err.message || 'Wallet login failed');
            }
        } finally { setIsLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-100 bg-[#020617]">
            {/* Dark Refractive Atmospheric Background is inherited from global index.css */}

            {/* Decorative circles to enhance glassmorphism refractions */}
            <div className="absolute top-[-10%]" style={{right: '10%'}}>
                <div className="w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
            </div>
            <div className="absolute bottom-[-10%]" style={{left: '5%'}}>
                <div className="w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
            </div>

            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
                {/* Brand */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <Logo className="w-16 h-16 drop-shadow-xl" />
                    </div>
                    <h1 className="font-display text-4xl font-bold tracking-tight mb-2 text-white drop-shadow-sm">
                        TerraLedger
                    </h1>
                    <p className="text-slate-400 text-sm tracking-wide">Blockchain-Powered Land Registry Node</p>
                </div>

                {/* Glass Card */}
                <div className="glass-panel rounded-3xl p-8">
                    {/* Tab Selector */}
                    <div className="flex p-1 bg-slate-900/50 rounded-xl border border-white/5 mb-8 shadow-inner">
                        <button
                            onClick={() => { setActiveTab('registrar'); setWalletError(''); }}
                            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'registrar'
                                    ? 'bg-blue-500/20 text-blue-300 shadow-sm border border-blue-400/20'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                            }`}
                        >
                            <Shield className="w-4 h-4" /> Registrar
                        </button>
                        <button
                            onClick={() => { setActiveTab('owner'); setWalletError(''); }}
                            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'owner'
                                    ? 'bg-indigo-500/20 text-indigo-300 shadow-sm border border-indigo-400/20'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                            }`}
                        >
                            <Wallet className="w-4 h-4" /> Land Owner
                        </button>
                    </div>

                    {/* Registrar Login */}
                    {activeTab === 'registrar' && (
                        <form onSubmit={handleRegistrarLogin} className="space-y-5">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email Identity</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                        placeholder="node@terraledger.gov"
                                        className="glass-input w-full pl-11 pr-4 py-3.5 rounded-xl text-slate-100 placeholder:text-slate-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cipher Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="glass-input w-full pl-11 pr-4 py-3.5 rounded-xl text-slate-100 placeholder:text-slate-500"
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={isLoading}
                                className="glass-button w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
                            >
                                {isLoading ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <>Initialize Session <ArrowRight className="w-4 h-4" /></>}
                            </button>
                            <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                <p className="text-[11px] text-slate-400 text-center font-mono">Test Node: admin@terraledger.gov / admin123</p>
                            </div>
                        </form>
                    )}

                    {/* Owner Wallet Login */}
                    {activeTab === 'owner' && (
                        <div className="space-y-5">
                            <div className="text-center py-4">
                                <div className="w-20 h-20 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center mb-6 shadow-inner">
                                    <Wallet className="w-10 h-10 text-indigo-400" />
                                </div>
                                <h3 className="font-display text-xl font-bold text-slate-100 mb-2">Connect Web3 Wallet</h3>
                                <p className="text-slate-400 text-sm max-w-xs mx-auto">Sign a cryptographic challenge to authenticate ownership.</p>
                            </div>
                            {walletError && (
                                <div className="p-4 rounded-xl bg-red-900/30 border border-red-500/30 flex items-start gap-3 backdrop-blur-md">
                                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-200">{walletError}</p>
                                </div>
                            )}

                            {!showWalletModal ? (
                                <button onClick={() => setShowWalletModal(true)} disabled={isLoading}
                                    className="glass-button w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <><Wallet className="w-5 h-5" /> Connect Wallet</>}
                                </button>
                            ) : (
                                <div className="bg-slate-900/50 backdrop-blur-[20px] saturate-[150%] rounded-xl border border-white/10 p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <p className="text-xs text-center text-slate-400 uppercase tracking-widest font-bold mb-2">Select Provider</p>
                                    <button onClick={() => handleWalletLogin('metamask')}
                                        className="w-full py-3 rounded-lg flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all font-medium text-slate-200"
                                    >
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" className="w-5 h-5" alt="MetaMask" />
                                        MetaMask
                                    </button>
                                    <button onClick={() => handleWalletLogin('phantom')}
                                        className="w-full py-3 rounded-lg flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-transparent hover:border-violet-500/30 hover:text-violet-300 transition-all font-medium text-slate-200"
                                    >
                                        <Wallet className="w-5 h-5 text-violet-400" />
                                        Phantom
                                    </button>
                                    <button onClick={() => setShowWalletModal(false)}
                                        className="w-full py-2 text-xs text-slate-500 hover:text-slate-300 tracking-wide font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                            <p className="text-[11px] text-slate-500 text-center">
                                Ensure your extension is unlocked before connecting.
                            </p>
                        </div>
                    )}
                </div>

                <p className="text-center text-slate-500 text-xs mt-8 tracking-widest uppercase opacity-60">TerraLedger Protocol v2.0</p>
            </div>
        </div>
    );
};

export default LoginPage;
