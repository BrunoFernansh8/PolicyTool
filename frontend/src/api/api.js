import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Backend URL
  timeout: 5000, // Timeout for requests 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization header if token is available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (optional)
      console.error('Unauthorized: Please log in again.');
    }
    return Promise.reject(error);
  }
);

export default api;
