import axiosInstance from './axiosConfig';

const taskService = {
  // Create new task
  createTask: async (taskData) => {
    try {
      console.log('📝 Creating task:', taskData);
      const response = await axiosInstance.post('/tasks', taskData);
      console.log('✅ Create task response:', response.data);
      return response.data; // Return the data property
    } catch (error) {
      console.error('❌ Create task error:', error);
      throw error;
    }
  },

  // Get all tasks with filters
  getTasks: async (params = {}) => {
    try {
      console.log('🔄 Fetching tasks with params:', params);
      const response = await axiosInstance.get('/tasks', { params });
      console.log('📊 Get tasks response:', response.data);
      
      // The response.data should contain the structure from backend
      // { success: true, count: 2, total: 2, data: [...] }
      return response.data;
    } catch (error) {
      console.error('❌ Get tasks error:', error);
      throw error;
    }
  },

  // Get single task
  getTask: async (id) => {
    const response = await axiosInstance.get(`/tasks/${id}`);
    return response.data;
  },

  // Update task
  updateTask: async (id, taskData) => {
    const response = await axiosInstance.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task (admin only)
  deleteTask: async (id) => {
    const response = await axiosInstance.delete(`/tasks/${id}`);
    return response.data;
  },

  // Get task statistics
  getTaskStats: async () => {
    const response = await axiosInstance.get('/tasks/stats');
    return response.data;
  },
};

export default taskService;