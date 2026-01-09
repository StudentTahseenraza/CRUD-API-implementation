import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import taskService from '../../api/taskService';
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatCard from '../../components/dashboard/StatCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch tasks
      const tasksResponse = await taskService.getTasks();
      if (tasksResponse.success) {
        setTasks(tasksResponse.data || []);
      }
      
      // Fetch stats
      const statsResponse = await taskService.getTaskStats();
      if (statsResponse.success) {
        setStats(statsResponse.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from tasks if stats API fails
  const calculateStats = () => {
    const totalTasks = tasks.length;
    const completedCount = tasks.filter(task => task.status === 'completed').length;
    const inProgressCount = tasks.filter(task => task.status === 'in-progress').length;
    const pendingCount = tasks.filter(task => task.status === 'pending').length;

    return [
      {
        title: 'Total Tasks',
        value: totalTasks,
        icon: ClipboardDocumentListIcon,
        color: 'blue',
      },
      {
        title: 'Completed',
        value: completedCount,
        icon: CheckCircleIcon,
        color: 'green',
      },
      {
        title: 'In Progress',
        value: inProgressCount,
        icon: ClockIcon,
        color: 'yellow',
      },
      {
        title: 'Pending',
        value: pendingCount,
        icon: ExclamationTriangleIcon,
        color: 'red',
      },
    ];
  };

  const statItems = calculateStats();

  if (loading) {
    return <LoadingSpinner size="lg" className="mt-8" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.name}! Here's what's happening with your tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <Link
              to="/tasks"
              className="flex items-center justify-between p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
              onClick={() => {
                // This will trigger the tasks page to show create form
                localStorage.setItem('showCreateForm', 'true');
              }}
            >
              <div className="flex items-center">
                <ClipboardDocumentListIcon className="h-5 w-5 text-primary-600 mr-3" />
                <span className="font-medium text-primary-700">Create New Task</span>
              </div>
              <span className="text-primary-600">→</span>
            </Link>
            
            <Link
              to="/tasks"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-gray-600 mr-3" />
                <span className="font-medium text-gray-700">View All Tasks</span>
              </div>
              <span className="text-gray-600">→</span>
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
            <Link to="/tasks" className="text-sm text-primary-600 hover:text-primary-800">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {tasks.slice(0, 3).map((task) => (
              <div key={task._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div>
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-500">
                    {task.status} • {task.priority} priority
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  task.status === 'completed' ? 'bg-green-100 text-green-800' :
                  task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="text-gray-500 text-center py-4">No tasks yet. Create your first task!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;