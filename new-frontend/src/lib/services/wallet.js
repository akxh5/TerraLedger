import { ethers } from 'ethers';

const SIGN_MESSAGE = "Sign this message to authenticate with TerraLedger";

export const walletService = {
    /**
     * Connect to MetaMask and return the user's address
     */
    connectWallet: async () => {
        if (!window.ethereum) {
            throw new Error("MetaMask is not installed");
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            return accounts[0];
        } catch (error) {
            console.error("Error connecting to wallet:", error);
            throw error;
        }
    },

    /**
     * Get the ethers signer
     */
    getSigner: async () => {
        if (!window.ethereum) return null;
        const provider = new ethers.BrowserProvider(window.ethereum);
        return await provider.getSigner();
    },

    /**
     * Sign the login message using MetaMask
     */
    signLoginMessage: async () => {
        const signer = await walletService.getSigner();
        if (!signer) throw new Error("Wallet not connected");

        try {
            const signature = await signer.signMessage(SIGN_MESSAGE);
            const address = await signer.getAddress();
            return { address, signature, message: SIGN_MESSAGE };
        } catch (error) {
            console.error("Error signing message:", error);
            throw error;
        }
    },

    /**
     * Utility to shorten address for display
     */
    shortenAddress: (address) => {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }
};
