import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminRoute from '../components/auth/AdminRoute';

// Lazy load pages
const Login = React.lazy(() => import('../pages/auth/Login'));
const Register = React.lazy(() => import('../pages/auth/Register'));
const Dashboard = React.lazy(() => import('../pages/dashboard/Dashboard'));
const Tasks = React.lazy(() => import('../pages/tasks/Tasks'));
const TaskDetail = React.lazy(() => import('../pages/tasks/TaskDetail'));
const Profile = React.lazy(() => import('../pages/profile/Profile'));
const AdminDashboard = React.lazy(() => import('../pages/admin/AdminDashboard'));
const AdminUsers = React.lazy(() => import('../pages/admin/AdminUsers'));
const AdminTasks = React.lazy(() => import('../pages/admin/AdminTasks'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'tasks',
        element: (
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        ),
      },
      {
        path: 'tasks/:id',
        element: (
          <ProtectedRoute>
            <TaskDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/tasks',
        element: (
          <AdminRoute>
            <AdminTasks />
          </AdminRoute>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);