import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
  CalendarIcon,
  UserIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import taskService from '../../api/taskService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getTask(id);
      
      if (response.success) {
        setTask(response.data);
        setEditData({
          title: response.data.title,
          description: response.data.description,
          status: response.data.status,
          priority: response.data.priority
        });
      } else {
        setError(new Error(response.error || 'Task not found'));
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await taskService.updateTask(id, editData);
      if (response.success) {
        setTask(response.data);
        setIsEditing(false);
        toast.success('Task updated successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        toast.success('Task deleted successfully!');
        navigate('/tasks');
      } catch (error) {
        toast.error(error.message || 'Failed to delete task');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="mt-8" />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Task not found</h3>
        <button
          onClick={() => navigate('/tasks')}
          className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to tasks
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/tasks')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to tasks
        </button>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            {isEditing ? 'Cancel Edit' : 'Edit Task'}
          </button>
          
          {isAdmin() && (
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Delete Task
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        {/* Status Bar */}
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({...editData, title: e.target.value})}
                  className="text-2xl font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
              )}
            </div>
            
            <div className="mt-2 sm:mt-0 flex space-x-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                {isEditing ? (
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({...editData, status: e.target.value})}
                    className="bg-transparent border-none focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                ) : task.status}
              </span>
              
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                {isEditing ? (
                  <select
                    value={editData.priority}
                    onChange={(e) => setEditData({...editData, priority: e.target.value})}
                    className="bg-transparent border-none focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                ) : `${task.priority} priority`}
              </span>
            </div>
          </div>
        </div>

        {/* Task Details */}
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              {isEditing ? (
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {task.description || 'No description provided.'}
                </p>
              )}
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Created Info */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created By</p>
                    <p className="text-sm text-gray-900">
                      {task.createdBy?.name || 'Unknown'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created Date</p>
                    <p className="text-sm text-gray-900">
                      {format(new Date(task.createdAt), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Updated Info */}
              <div className="space-y-4">
                {task.dueDate && (
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Due Date</p>
                      <p className="text-sm text-gray-900">
                        {format(new Date(task.dueDate), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                    <p className="text-sm text-gray-900">
                      {format(new Date(task.updatedAt), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                  <TagIcon className="h-5 w-5 mr-2" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Save Button for Edit Mode */}
          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;