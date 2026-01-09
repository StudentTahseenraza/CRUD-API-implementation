import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
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

// REMOVE or COMMENT OUT the response interceptor that's causing issues
// The issue is this interceptor is returning response.data instead of the full response
/*
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('📡 Axios Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response.data; // ← THIS IS THE PROBLEM!
  },
  (error) => {
    console.error('❌ Axios error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
*/

// Instead, just add logging but keep the full response
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('📡 API Response from', response.config.url, ':', {
      status: response.status,
      data: response.data
    });
    return response; // Keep the full Axios response object
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      error: error.response?.data || error.message
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;