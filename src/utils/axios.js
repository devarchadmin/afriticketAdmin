import axios from 'axios';

const axiosServices = axios.create();

// Helper function to safely access tokens from localStorage or cookies
export const getStorageItem = (key) => {
  if (typeof window !== 'undefined') {
    // Try localStorage first
    const localValue = localStorage.getItem(key);
    if (localValue) return localValue;
    
    // Fallback to cookies
    const Cookies = require('js-cookie');
    return Cookies.get(key);
  }
  return null;
};

// Debug function to check token status
const debugTokens = () => {
  const adminToken = getStorageItem('adminToken');
  const token = getStorageItem('token');
  
  const tokenInfo = {
    adminToken: adminToken ? 'present' : 'missing',
    token: token ? 'present' : 'missing',
    adminTokenValue: adminToken ? `${adminToken.substring(0, 10)}...` : null,
    tokenValue: token ? `${token.substring(0, 10)}...` : null
  };
  
  console.log('Debug - Authentication:', {
    tokens: tokenInfo,
    storage: typeof window !== 'undefined' ? 'available' : 'unavailable',
    cookies: typeof window !== 'undefined' ? document.cookie : 'unavailable'
  });
  
  return tokenInfo;
};

// Add request interceptor to attach the token
axiosServices.interceptors.request.use(
    (config) => {
        // Debug token status at request time
        debugTokens();

        // For admin endpoints, use adminToken first
        const adminToken = getStorageItem('adminToken');
        const token = getStorageItem('token');
        
        console.log('Request URL:', config.url);
        console.log('Admin token:', adminToken ? 'present' : 'missing');
        console.log('Regular token:', token ? 'present' : 'missing');
        
        // Set default headers
        config.headers = {
            ...config.headers,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        // Add authorization header according to API docs
        // Format: "Authorization: Bearer <token>"
        if (config.url?.includes('/api/admin')) {
            if (adminToken) {
                config.headers = {
                    ...config.headers,
                    'Authorization': `Bearer ${adminToken}`,
                    'Accept': 'application/json'
                };
                console.log('Using admin token for request');
            } else {
                console.warn('Admin token missing for admin endpoint');
                throw new Error('Admin authentication required');
            }
        } else if (token) {
            config.headers = {
                ...config.headers,
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            };
            console.log('Using regular token for request');
        }

        // Log the final request configuration
        console.log('Request config:', {
            url: config.url,
            method: config.method,
            headers: config.headers
        });

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
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers
        });

        // Check for specific error types
        if (error.response?.status === 401) {
            console.error('Authentication error - clearing tokens');
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('adminToken');
                window.location.href = '/auth/login';
            }
        }

        return Promise.reject({
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            data: error.response?.data
        });
    }
);

export default axiosServices;
