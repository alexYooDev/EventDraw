/* 
    Axios client configuration for API requests
*/

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://eventdraw-production.up.railway.app/api/v1';

// Debug: Log the API URL being used (remove in production)
console.log('API Base URL:', API_BASE_URL);

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type' : 'application/json'
    },
    timeout: 10000 // 10 seconds
});

// Request interceptor to force HTTPS
apiClient.interceptors.request.use(
    (config) => {
        // Force HTTPS for production URLs
        if (config.baseURL && config.baseURL.startsWith('http://') && !config.baseURL.includes('localhost')) {
            config.baseURL = config.baseURL.replace('http://', 'https://');
            console.warn('Forced HTTP to HTTPS:', config.baseURL);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle 401 Unauthorized - redirect to login
            if (error.response.status === 401) {
                // Clear token
                localStorage.removeItem('admin_token');
                // Redirect to login page
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
            // Server responded with error status
            console.error('API Error:', error.response.data);            
        } else if (error.request) {
            // Request made but no response received
            console.error('Network Error:', error.message);
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);