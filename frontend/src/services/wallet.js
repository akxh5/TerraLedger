import { ethers } from 'ethers';

const SIGN_MESSAGE = "Sign this message to authenticate with TerraLedger";

const getMetaMaskProvider = () => {
    if (window.ethereum) {
        if (window.ethereum.providers) {
            const provider = window.ethereum.providers.find(p => p.isMetaMask);
            if (provider) return provider;
        }
        if (window.ethereum.isMetaMask) {
            return window.ethereum;
        }
    }
    return null;
};

const getPhantomProvider = () => {
    if (window.phantom?.ethereum) {
        return window.phantom.ethereum;
    }
    if (window.ethereum) {
        if (window.ethereum.providers) {
            const provider = window.ethereum.providers.find(p => p.isPhantom);
            if (provider) return provider;
        }
        if (window.ethereum.isPhantom) {
            return window.ethereum;
        }
    }
    return null;
};

let activeProvider = null;

export const walletService = {
    connectMetaMask: async () => {
        const providerObj = getMetaMaskProvider();
        if (!providerObj) {
            throw new Error("MetaMask is not installed");
        }
        activeProvider = providerObj;
        try {
            const provider = new ethers.BrowserProvider(activeProvider);
            const accounts = await provider.send("eth_requestAccounts", []);
            return accounts[0];
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
            throw error;
        }
    },

    connectPhantom: async () => {
        const providerObj = getPhantomProvider();
        if (!providerObj) {
            throw new Error("Phantom is not installed");
        }
        activeProvider = providerObj;
        try {
            const provider = new ethers.BrowserProvider(activeProvider);
            const accounts = await provider.send("eth_requestAccounts", []);
            return accounts[0];
        } catch (error) {
            console.error("Error connecting to Phantom:", error);
            throw error;
        }
    },

    getSigner: async () => {
        if (!activeProvider) {
            activeProvider = getMetaMaskProvider() || getPhantomProvider() || window.ethereum;
        }
        if (!activeProvider) return null;
        
        const provider = new ethers.BrowserProvider(activeProvider);
        return await provider.getSigner();
    },

    signLoginMessage: async () => {
        const signer = await walletService.getSigner();
        if (!signer) throw new Error("Wallet not connected");
        try {
            const signature = await signer.signMessage(SIGN_MESSAGE);
            const address = await signer.getAddress();
            return { address, signature };
        } catch (error) {
            console.error("Error signing message:", error);
            throw error;
        }
    },

    shortenAddress: (address) => {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }
};
