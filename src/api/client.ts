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
        // Validate JSON response to prevent frontend crashes on 500 HTML pages
        if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
            console.error("CRITICAL: Received HTML instead of JSON from API. Server likely crashed.");
            return { success: false, data: null, error: 'Internal Server Error (HTML Response)' };
        }
        return response.data;
    },
    (error) => {
        const errorData = error.response?.data;
        const errorMessage = typeof errorData?.error === 'string' 
            ? errorData.error 
            : (errorData?.error?.message || error.message || "Protocol Failure");
            
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user_data');
            // Avoid redirect loops if already on login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        } else {
            toast.error(errorMessage);
        }
        
        return Promise.reject(error);
    }
);

export default api;
