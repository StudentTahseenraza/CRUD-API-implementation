import axiosInstance from './axiosConfig';

const authService = {
  // Register new user
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  // Login user
login: async (credentials) => {
  try {
    console.log('Attempting login with:', credentials.email);
    const response = await axiosInstance.post('/auth/login', credentials);
    console.log('Login response:', response);
    
    // Store token and user data
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } else if (response.data?.data?.token) {
      // Handle nested data structure
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response;
  } catch (error) {
    console.error('Login service error:', error);
    throw error;
  }
},

  // Get current user profile
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await axiosInstance.put('/auth/update-profile', userData);
    
    // Update stored user data
    if (response.data?.data) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...currentUser,
        ...response.data.data
      }));
    }
    
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await axiosInstance.put('/auth/change-password', passwordData);
    
    // Update token if returned
    if (response.data?.data?.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      // Always clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('token');
  },
};

export default authService;