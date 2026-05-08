import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Standardized Response & Error Interceptor
api.interceptors.response.use(
    (response) => {
        // Backend contract: always return the envelope `{ success, data, error }`
        // Normalize here so call-sites are consistent.
        return response.data;
    },
    (error) => {
        const errorMsg = error.response?.data?.error || error.message || 'System error occurred';
        
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user_data');
            // Avoid redirect loops if already on login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        } else if (error.response?.status === 403) {
            toast.error("Security: Access denied to this protocol.");
        } else {
            toast.error(errorMsg);
        }
        
        return Promise.reject(error);
    }
);

export default api;
