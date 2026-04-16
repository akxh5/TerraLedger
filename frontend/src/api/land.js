import apiClient from './client';

// All paths are relative to baseURL (http://localhost:8080/api)
// Backend controller is at /api/lands, so paths here use /lands/...

export const landApi = {
    // Get owner's properties
    getMyProperties: async () => {
        const response = await apiClient.get('/lands/my-properties');
        return response.data;
    },

    // Get all properties (REGISTRAR only)
    getAllLands: async () => {
        const response = await apiClient.get('/lands/all');
        return response.data;
    },

    // Approve land (REGISTRAR only - legacy)
    approveLand: async (id) => {
        const response = await apiClient.post(`/lands/${id}/approve`);
        return response.data;
    },

    // NEW GOVERNED FLOW Endpoints

    submitLandRequest: async (data) => {
        const response = await apiClient.post('/lands/request', data);
        return response.data;
    },

    getMyRequests: async () => {
        const response = await apiClient.get('/lands/my-requests');
        return response.data;
    },

    getPendingRequests: async () => {
        const response = await apiClient.get('/lands/requests');
        return response.data;
    },

    approveLandRequest: async (id) => {
        const response = await apiClient.post(`/lands/approve/${id}`);
        return response.data;
    },

    rejectLandRequest: async (id) => {
        const response = await apiClient.post(`/lands/reject/${id}`);
        return response.data;
    },


    // Register new land
    registerLand: async (data) => {
        const response = await apiClient.post('/lands/register', data);
        return response.data;
    },

    // Get land record by ID
    getLandRecord: async (id) => {
        const response = await apiClient.get(`/lands/${id}`);
        return response.data;
    },

    // Search lands by location/owner
    advancedSearch: async (params) => {
        const response = await apiClient.get('/lands/search', { params });
        return response.data;
    },

    // Initiate a transfer
    proposeTransfer: async (data) => {
        const response = await apiClient.post('/lands/transfer/initiate', data);
        return response.data;
    },

    // Approve a transfer
    voteOnProposal: async (landId) => {
        const response = await apiClient.post('/lands/transfer/approve', { landId });
        return response.data;
    },

    // Execute a proposal (alias for approve in simplified backend)
    executeProposal: async (landId) => {
        const response = await apiClient.post('/lands/transfer/approve', { landId });
        return response.data;
    },

    // Get ownership history timeline
    getOwnershipHistory: async (id) => {
        const response = await apiClient.get(`/lands/history/${id}`);
        return response.data;
    },

    // Get stats for dashboard
    getStats: async () => {
        const response = await apiClient.get('/lands/dashboard/stats');
        return response.data;
    },

    // Get fractional shares info
    getFractionalShares: async (id) => {
        try {
            const response = await apiClient.get(`/lands/fractional/${id}`);
            return response.data;
        } catch (e) {
            if (e.response && e.response.status === 404) return { holders: [] };
            throw e;
        }
    },

    // Create fractional shares
    createFractionalShares: async (id, totalShares) => {
        const response = await apiClient.post(`/lands/fractional/${id}/create`, { totalShares });
        return response.data;
    },

    // Transfer fractional shares
    transferFractionalShares: async (id, to, shares) => {
        const response = await apiClient.post(`/lands/fractional/${id}/transfer`, { to, shares });
        return response.data;
    },

    // Verify identity (mock KYC)
    verifyIdentity: async (data) => {
        const response = await apiClient.post('/lands/identity/verify', data);
        return response.data;
    },

    // Upload document
    uploadDocument: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post('/lands/upload-document', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    // Get blockchain events
    getBlockchainEvents: async () => {
        const response = await apiClient.get('/lands/blockchain/events');
        return response.data;
    },

    // Get audit logs
    getAuditLogs: async () => {
        const response = await apiClient.get('/lands/audit-logs');
        return response.data;
    },

    // Freeze property
    freezeLand: async (landId) => {
        const response = await apiClient.post('/lands/freeze', { landId });
        return response.data;
    },

    // Unfreeze property
    unfreezeLand: async (landId) => {
        const response = await apiClient.post('/lands/unfreeze', { landId });
        return response.data;
    },

    // Resolve dispute
    resolveDispute: async (landId, newOwner) => {
        const response = await apiClient.post('/lands/resolve-dispute', { landId, newOwner });
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
    walletLogin: async (address, signature) => {
        const response = await apiClient.post('/auth/wallet-login', { address, signature });
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
