import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const TaskTable = ({ tasks, onEdit, onDelete, onView, isLoading }) => {
  const { user, isAdmin } = useAuth();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 mr-1" />;
      case 'in-progress':
        return <ClockIcon className="h-4 w-4 mr-1" />;
      default:
        return <ExclamationCircleIcon className="h-4 w-4 mr-1" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const isTaskOwner = (task) => {
    return task.createdBy?._id === user?._id || task.createdBy === user?._id;
  };

  const canEditTask = (task) => {
    // Admin can edit any task, users can only edit their own
    return isAdmin() || isTaskOwner(task);
  };

  const canDeleteTask = (task) => {
    // Only admin can delete tasks
    return isAdmin();
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Task Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr 
              key={task._id} 
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-6 py-4">
                <div>
                  <Link
                    to={`/tasks/${task._id}`}
                    className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {task.title}
                  </Link>
                  {task.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  <div className="mt-2 flex items-center text-xs text-gray-400">
                    <span className="flex items-center">
                      <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {task.createdBy?.name || 'Unknown'}
                    </span>
                    {!isTaskOwner(task) && (
                      <span className="ml-3 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        Assigned
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                  {getStatusIcon(task.status)}
                  <span className="capitalize">{task.status}</span>
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                  <span className="capitalize">{task.priority}</span>
                  {task.priority === 'high' && (
                    <svg className="h-3 w-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  )}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex flex-col">
                  <span>{format(new Date(task.createdAt), 'MMM dd, yyyy')}</span>
                  <span className="text-xs text-gray-400">
                    {format(new Date(task.createdAt), 'hh:mm a')}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  {/* View Button */}
                  <button
                    onClick={() => onView(task._id)}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                    title="View Details"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>

                  {/* Edit Button - Only for owners or admin */}
                  {canEditTask(task) && (
                    <button
                      onClick={() => onEdit(task._id)}
                      disabled={isLoading}
                      className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50 transition-colors disabled:opacity-50"
                      title="Edit Task"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  )}

                  {/* Delete Button - Only for admin */}
                  {canDeleteTask(task) && (
                    <button
                      onClick={() => onDelete(task._id)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                      title={isAdmin() ? "Delete Task" : "Only admins can delete tasks"}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}

                  {/* Indicator for non-owner users */}
                  {!canEditTask(task) && !canDeleteTask(task) && (
                    <span className="text-xs text-gray-400 italic">Read only</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500">Create your first task to get started</p>
        </div>
      )}
    </div>
  );
};

export default TaskTable;