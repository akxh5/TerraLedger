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

    // Initiate a transfer
    initiateTransfer: async (data) => {
        const response = await apiClient.post('/land/transfer/initiate', data);
        return response.data;
    },

    // Approve a transfer
    approveTransfer: async (data) => {
        const response = await apiClient.post('/land/transfer/approve', data);
        return response.data;
    },

    // Get ownership history timeline
    getOwnershipHistory: async (id) => {
        const response = await apiClient.get(`/land/history/${id}`);
        return response.data;
    }
};
