 import axios from 'axios';

const axiosServices = axios.create();

// Debug function to check token status
const debugTokens = () => {
  const adminToken = localStorage.getItem('adminToken');
  const token = localStorage.getItem('token');
  console.log('Debug - Tokens:', {
    adminToken: adminToken ? 'present' : 'missing',
    token: token ? 'present' : 'missing'
  });
};

// Add request interceptor to attach the token
debugTokens(); // Initial debug check
axiosServices.interceptors.request.use(
    (config) => {
        // For admin endpoints, use adminToken first
        const adminToken = localStorage.getItem('adminToken');
        const token = localStorage.getItem('token');
        
        console.log('Request URL:', config.url);
        console.log('Admin token:', adminToken ? 'present' : 'missing');
        console.log('Regular token:', token ? 'present' : 'missing');
        
        // Set default headers
        config.headers = {
            ...config.headers,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        // Add authorization header
        if (config.url?.includes('/api/admin')) {
            if (adminToken) {
                config.headers.Authorization = `Bearer ${adminToken}`;
                console.log('Using admin token for request');
            } else {
                console.warn('Admin token missing for admin endpoint');
                throw new Error('Admin authentication required');
            }
        } else if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Using regular token for request');
        }

        console.log('Final headers:', config.headers);
        return config;
    },
    (error) => Promise.reject(error)
);

// interceptor for http
axiosServices.interceptors.response.use(
    (response) => {
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        return response;
    },
    (error) => {
        console.error('API Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject((error.response && error.response.data) || 'Wrong Services');
    }
);

export default axiosServices;
