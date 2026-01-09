import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import adminService from '../../api/adminService';
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import StatCard from '../../components/dashboard/StatCard';

const AdminDashboard = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['systemStats'],
    queryFn: () => adminService.getSystemStats(),
  });

  if (isLoading) {
    return <LoadingSpinner size="lg" className="mt-8" />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const statItems = [
    {
      title: 'Total Users',
      value: stats?.data?.totalUsers || 0,
      icon: UserGroupIcon,
      color: 'blue',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Total Tasks',
      value: stats?.data?.totalTasks || 0,
      icon: ClipboardDocumentListIcon,
      color: 'green',
      change: '+5%',
      trend: 'up',
    },
    {
      title: 'Active Users',
      value: stats?.data?.usersByRole?.find(r => r._id === 'user')?.count || 0,
      icon: UserPlusIcon,
      color: 'purple',
      change: '+8%',
      trend: 'up',
    },
    {
      title: 'Completed Tasks',
      value: stats?.data?.tasksByStatus?.find(s => s._id === 'completed')?.count || 0,
      icon: ChartBarIcon,
      color: 'yellow',
      change: '+15%',
      trend: 'up',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View, edit, and manage system users',
      href: '/admin/users',
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'View All Tasks',
      description: 'Monitor all tasks across the system',
      href: '/admin/tasks',
      icon: ClipboardDocumentListIcon,
      color: 'bg-green-500',
    },
    {
      title: 'System Analytics',
      description: 'Detailed analytics and reports',
      href: '#',
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">
          System overview and administration controls
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            to={action.href}
            className="card p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`${action.color} p-3 rounded-lg`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            User Distribution
          </h2>
          <div className="space-y-3">
            {stats?.data?.usersByRole?.map((role) => (
              <div key={role._id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {role._id === 'admin' ? 'Administrators' : 'Regular Users'}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {role.count}
                  </span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{
                        width: `${(role.count / stats.data.totalUsers) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Task Status Distribution
          </h2>
          <div className="space-y-3">
            {stats?.data?.tasksByStatus?.map((status) => (
              <div key={status._id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">
                  {status._id}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {status.count}
                  </span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        status._id === 'completed'
                          ? 'bg-green-600'
                          : status._id === 'in-progress'
                          ? 'bg-yellow-600'
                          : 'bg-red-600'
                      }`}
                      style={{
                        width: `${(status.count / stats.data.totalTasks) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;