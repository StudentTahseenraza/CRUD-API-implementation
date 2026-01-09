import axiosInstance from './axiosConfig';

const adminService = {
  // Get all users
  getUsers: async (params = {}) => {
    const response = await axiosInstance.get('/admin/users', { params });
    return response.data;
  },

  // Get user by ID
  getUser: async (id) => {
    const response = await axiosInstance.get(`/admin/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await axiosInstance.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Get all tasks (admin view)
  getAllTasks: async (params = {}) => {
    const response = await axiosInstance.get('/admin/tasks', { params });
    return response.data;
  },

  // Get system statistics
  getSystemStats: async () => {
    const response = await axiosInstance.get('/admin/stats');
    return response.data;
  },
};

export default adminService;