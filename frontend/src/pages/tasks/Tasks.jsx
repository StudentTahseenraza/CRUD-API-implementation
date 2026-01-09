import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import taskService from '../../api/taskService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium'
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      console.log('🔄 Starting to fetch tasks...');
      
      // Call the service
      const response = await taskService.getTasks();
      console.log('📦 Response from taskService:', response);
      
      // The response should be: { success: true, count: 2, total: 2, data: [...] }
      if (response.success && response.data) {
        console.log('✅ Found tasks:', response.data.length);
        setTasks(response.data);
      } else {
        console.warn('⚠️ No tasks found or invalid response:', response);
        setTasks([]);
      }
    } catch (error) {
      console.error('❌ Failed to fetch tasks:', error);
      toast.error('Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      console.log('🔄 Creating task:', formData);
      const response = await taskService.createTask(formData);
      console.log('✅ Task creation response:', response);
      
      if (response.success) {
        toast.success('Task created successfully!');
        setShowCreateForm(false);
        setFormData({ title: '', description: '', status: 'pending', priority: 'medium' });
        fetchTasks(); // Refresh the list
      } else {
        toast.error(response.error || 'Failed to create task');
      }
    } catch (error) {
      console.error('❌ Failed to create task:', error);
      toast.error(error.message || 'Failed to create task');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">
            Total tasks: {tasks.length} | Showing all tasks
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Task
        </button>
      </div>

      {showCreateForm && (
        <div className="p-6 border rounded-lg bg-white shadow-md">
          <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter task title"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Enter task description (optional)"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium text-gray-700">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks List */}
      <div className="border rounded-lg overflow-hidden bg-white shadow-md">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800">Task List</h2>
          <p className="text-sm text-gray-600">{tasks.length} task(s) found</p>
        </div>
        
        {tasks.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">No tasks found</p>
            <p className="text-sm text-gray-400 mb-4">Create your first task using the "New Task" button above</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Create Your First Task
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-sm font-medium text-gray-700">Title</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-700">Priority</th>
                  <th className="p-3 text-left text-sm font-medium text-gray-700">Created Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <div className="font-medium text-gray-900">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
                          {task.description}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {new Date(task.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Debug Info Panel */}
      {/* <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-2">Debug Information</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>✅ Backend returned: {tasks.length} task(s)</p>
          <p>🔄 Loading state: {loading ? 'Loading...' : 'Complete'}</p>
          <p>📊 User ID: {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : 'Not logged in'}</p>
          <button 
            onClick={fetchTasks}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            Refresh Tasks
          </button>
          <button 
            onClick={() => console.log('Tasks state:', tasks)}
            className="mt-2 ml-2 px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
          >
            Log Tasks to Console
          </button>
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default Tasks;