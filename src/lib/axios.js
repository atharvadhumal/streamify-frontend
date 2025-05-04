import axios from "axios";

const BASE_URL = "https://streamify-backend-no3j.onrender.com/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for CORS
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any auth token if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Backend might be down or not accessible');
      return Promise.reject(new Error('Unable to connect to the server. Please try again later.'));
    }
    
    // Handle CORS errors
    if (error.response?.status === 401) {
      console.error('Unauthorized access');
      return Promise.reject(new Error('Please login to continue'));
    }
    
    return Promise.reject(error);
  }
);
