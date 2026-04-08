import apiClient from './client';

export const landApi = {
    // Register new land
    registerLand: async (data) => {
        const response = await apiClient.post('/land/register', data);
        return response.data;
    },

    // Get land record by ID
    getLandRecord: async (id) => {
        const response = await apiClient.get(`/land/${id}`);
        return response.data;
    },

    // Advanced search
    advancedSearch: async (params) => {
        const response = await apiClient.get('/land/search', { params });
        return response.data;
    },

    // Propose a transfer
    proposeTransfer: async (data) => {
        const response = await apiClient.post('/land/transfer/propose', data);
        return response.data;
    },

    // Vote on a proposal
    voteOnProposal: async (proposalId) => {
        const response = await apiClient.post('/land/transfer/vote', { proposalId });
        return response.data;
    },

    // Execute a proposal
    executeProposal: async (proposalId) => {
        const response = await apiClient.post('/land/transfer/execute', { proposalId });
        return response.data;
    },

    // Get ownership history timeline
    getOwnershipHistory: async (id) => {
        const response = await apiClient.get(`/land/history/${id}`);
        return response.data;
    },

    // Get stats for dashboard
    getStats: async () => {
        const response = await apiClient.get('/land/dashboard/stats');
        return response.data;
    },

    // Get fractional shares info
    getFractionalShares: async (id) => {
        try {
            const response = await apiClient.get(`/land/fractional/${id}`);
            return response.data;
        } catch (e) {
            // Only treat 404 as "not fractionalized yet" — re-throw real errors
            if (e.response && e.response.status === 404) return { holders: [] };
            throw e;
        }
    },

    // Create fractional shares
    createFractionalShares: async (id, totalShares) => {
        const response = await apiClient.post(`/land/fractional/${id}/create`, { totalShares });
        return response.data;
    },

    // Transfer fractional shares
    transferFractionalShares: async (id, to, shares) => {
        const response = await apiClient.post(`/land/fractional/${id}/transfer`, { to, shares });
        return response.data;
    },

    // Verify identity
    verifyIdentity: async (data) => {
        const response = await apiClient.post('/land/identity/verify', data);
        return response.data;
    },

    // Upload document to IPFS
    uploadDocument: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post('/land/upload-document', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get blockchain events
    getBlockchainEvents: async () => {
        const response = await apiClient.get('/land/blockchain/events');
        return response.data;
    },

    // Get audit logs
    getAuditLogs: async () => {
        const response = await apiClient.get('/land/audit-logs');
        return response.data;
    },

    // Freeze property
    freezeLand: async (landId) => {
        const response = await apiClient.post('/land/freeze', { landId });
        return response.data;
    },

    // Unfreeze property
    unfreezeLand: async (landId) => {
        const response = await apiClient.post('/land/unfreeze', { landId });
        return response.data;
    },

    // Resolve dispute
    resolveDispute: async (landId, newOwner) => {
        const response = await apiClient.post('/land/resolve-dispute', { landId, newOwner });
        return response.data;
    }
};

export const authApi = {
    login: async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },
    walletLogin: async (address, signature, message) => {
        const response = await apiClient.post('/auth/wallet-login', { address, signature, message });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },
    register: async (email, password, role) => {
        const response = await apiClient.post('/auth/register', { email, password, role });
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('user');
    }
};
