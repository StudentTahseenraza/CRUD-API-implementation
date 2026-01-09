import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { isAdmin } = useAuth();

  const userNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Tasks', href: '/tasks', icon: ClipboardDocumentListIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  const adminNavItems = [
    { name: 'Admin Dashboard', href: '/admin', icon: Cog6ToothIcon },
    { name: 'User Management', href: '/admin/users', icon: UserGroupIcon },
    { name: 'All Tasks', href: '/admin/tasks', icon: ChartBarIcon },
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
            : 'text-gray-700 hover:bg-gray-100'
        }`
      }
    >
      <item.icon className="h-5 w-5 mr-3" />
      {item.name}
    </NavLink>
  );

  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <div className="p-4">
        <nav className="space-y-1">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Main Navigation
          </h3>
          {userNavItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}

          {isAdmin() && (
            <>
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2">
                Administration
              </h3>
              {adminNavItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;