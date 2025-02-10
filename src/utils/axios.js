import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with default config
const axiosServices = axios.create({
  baseURL: 'https://api.afrikticket.com/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
axiosServices.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common responses
axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 (Unauthorized) responses
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosServices;

// Helper function to get items from storage
export const getStorageItem = (key) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

// Helper function to set items in storage
export const setStorageItem = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};
