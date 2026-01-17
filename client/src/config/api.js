import axios from 'axios';

// Configure base URL for API calls - uses environment variable with fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

console.log('API Base URL:', API_BASE_URL); // Debug log

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url); // Debug log
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url); // Debug log
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    
    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection and try again.';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };
