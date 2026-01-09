import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import EmptyState from '../../components/common/EmptyState';

const AdminTasks = () => {
  // This is a placeholder - implement with real data when backend is ready
  const tasks = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
        <p className="text-gray-600">View and manage all tasks in the system</p>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={ClipboardDocumentListIcon}
          title="No tasks available"
          description="Task management functionality will be available when the backend is connected."
          action={
            <Link
              to="/tasks"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
              View User Tasks
            </Link>
          }
        />
      ) : (
        <div className="card p-6">
          <p>Task list will be displayed here</p>
        </div>
      )}
    </div>
  );
};

export default AdminTasks;