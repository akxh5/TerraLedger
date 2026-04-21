import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// JWT interceptor — attach token to all requests
apiClient.interceptors.request.use(
    (config) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        } catch (e) {
            // ignore parse errors
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — redirect to login on 401
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
