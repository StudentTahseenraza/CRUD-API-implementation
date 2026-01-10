import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  PlusIcon, 
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';
import taskService from '../../api/taskService';
import TaskTable from '../../components/tasks/TaskTable';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskForm from '../../components/tasks/TaskForm';
import TaskEditModal from '../../components/tasks/TaskEditModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Tasks = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAdmin } = useAuth();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Fetch tasks
  const { 
    data: tasksData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskService.getTasks(filters),
  });

  // Create task mutation
  const createMutation = useMutation({
    mutationFn: (taskData) => taskService.createTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      setShowCreateForm(false);
      toast.success('Task created successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create task');
    },
  });

  // Update task mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, taskData }) => taskService.updateTask(id, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      setShowEditModal(false);
      setSelectedTask(null);
      toast.success('Task updated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update task');
    },
  });

  // Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete task');
    },
  });

  const tasks = tasksData?.data || [];
  const pagination = {
    currentPage: tasksData?.currentPage || 1,
    totalPages: tasksData?.totalPages || 1,
    total: tasksData?.total || 0,
  };

  const handleCreateTask = (taskData) => {
    createMutation.mutate(taskData);
  };

  const handleEditTask = async (taskId) => {
    try {
      const response = await taskService.getTask(taskId);
      if (response.success) {
        setSelectedTask(response.data);
        setShowEditModal(true);
      }
    } catch (error) {
      toast.error('Failed to load task for editing',error);
    }
  };

  const handleUpdateTask = (taskData) => {
    if (selectedTask) {
      updateMutation.mutate({ id: selectedTask._id, taskData });
    }
  };

  const handleDeleteTask = (taskId) => {
    const confirmMessage = isAdmin() 
      ? 'Are you sure you want to delete this task? This action cannot be undone.'
      : 'Only administrators can delete tasks.';

    if (window.confirm(confirmMessage)) {
      deleteMutation.mutate(taskId);
    }
  };

  const handleViewTask = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600">
            Manage and track all your tasks efficiently
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <ArrowPathIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </h2>
          {(filters.status || filters.priority || filters.search) && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Filters
            </button>
          )}
        </div>
        <TaskFilters filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* Create Task Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setShowCreateForm(false)}
            isLoading={createMutation.isLoading}
          />
        </div>
      )}

      {/* Tasks Summary */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Tasks Overview</h3>
            <p className="text-sm text-gray-600">
              Showing {tasks.length} of {pagination.total} tasks
              {pagination.totalPages > 1 && ` • Page ${pagination.currentPage} of ${pagination.totalPages}`}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-gray-600">Your role: </span>
              <span className={`font-medium ${isAdmin() ? 'text-purple-600' : 'text-blue-600'}`}>
                {isAdmin() ? 'Administrator' : 'User'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description="No tasks match your current filters. Try adjusting your search criteria or create a new task."
          action={
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Your First Task
            </button>
          }
        />
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <TaskTable
            tasks={tasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onView={handleViewTask}
            isLoading={deleteMutation.isLoading}
          />
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && selectedTask && (
        <TaskEditModal
          task={selectedTask}
          onSubmit={handleUpdateTask}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedTask(null);
          }}
          isLoading={updateMutation.isLoading}
        />
      )}

      {/* Permissions Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">Permissions Guide</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center">
            <EyeIcon className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-gray-700">View: Everyone</span>
          </div>
          <div className="flex items-center">
            <PencilIcon className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-gray-700">Edit: Task owners & Admins</span>
          </div>
          <div className="flex items-center">
            <TrashIcon className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-gray-700">Delete: Admins only</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;