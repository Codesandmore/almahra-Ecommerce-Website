import axios from 'axios';

// Base URL - will use local backend for development, cloud for production
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies/sessions
});

// Request interceptor - Add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (status === 403) {
        console.error('Access forbidden:', data.message);
      } else if (status === 404) {
        console.error('Resource not found:', data.message);
      } else if (status === 500) {
        console.error('Server error:', data.message);
      }
      
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network error - Backend not responding');
      return Promise.reject({
        message: 'Cannot connect to server. Make sure backend is running on http://localhost:5000'
      });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

export default api;
