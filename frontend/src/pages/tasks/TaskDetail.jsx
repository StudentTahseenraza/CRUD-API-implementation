import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import taskService from '../../api/taskService';
import TaskForm from '../../components/tasks/TaskForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.getTask(id),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (taskData) => taskService.updateTask(id, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries(['task', id]);
      setIsEditing(false);
      toast.success('Task updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update task');
    },
  });

  const task = data?.data;

  if (isLoading) {
    return <LoadingSpinner size="lg" className="mt-8" />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Task not found</h3>
        <p className="mt-2 text-sm text-gray-500">
          The task you're looking for doesn't exist or has been deleted.
        </p>
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

  const handleUpdate = (taskData) => {
    updateMutation.mutate(taskData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/tasks')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to tasks
        </button>
        
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <PencilIcon className="h-5 w-5 mr-2" />
          {isEditing ? 'Cancel Edit' : 'Edit Task'}
        </button>
      </div>

      {isEditing ? (
        <div className="card p-6">
          <TaskForm
            task={task}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            isLoading={updateMutation.isLoading}
          />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
            <div className="mt-2 flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                task.status === 'completed' ? 'bg-green-100 text-green-800' :
                task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {task.status}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {task.priority} priority
              </span>
              {task.dueDate && (
                <span className="text-sm text-gray-600">
                  Due: {format(new Date(task.dueDate), 'MMMM dd, yyyy')}
                </span>
              )}
            </div>
          </div>
          
          <div className="px-6 py-8">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {task.description || 'No description provided.'}
              </p>
            </div>
            
            {task.tags && task.tags.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
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
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Created By</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {task.createdBy?.name || 'Unknown'}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(task.createdAt), 'MMMM dd, yyyy')}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {format(new Date(task.updatedAt), 'MMMM dd, yyyy')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;