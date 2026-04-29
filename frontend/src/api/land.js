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

    // Get ownership history timeline
    getOwnershipHistory: async (id) => {
        const response = await apiClient.get(`/lands/history/${id}`);
        return response.data;
    },

    // Get stats for dashboard
    getStats: async () => {
        const response = await apiClient.get('/lands/dashboard/stats');
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
