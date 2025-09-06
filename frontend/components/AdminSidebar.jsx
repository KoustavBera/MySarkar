import React from 'react';
import { 
  ChartBarIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  CogIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../stores/authStore';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuthStore();
  const isGovtOfficial = user?.role === 'govt_official';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, available: true },
    { id: 'schemes', label: 'Schemes', icon: DocumentTextIcon, available: true },
    { id: 'applications', label: 'Applications', icon: ClipboardDocumentListIcon, available: true },
    { id: 'users', label: 'Users', icon: UsersIcon, available: isGovtOfficial },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon, available: isGovtOfficial },
    { id: 'community', label: 'Community', icon: UserGroupIcon, available: true },
    { id: 'settings', label: 'Settings', icon: CogIcon, available: true },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white h-screen flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-purple-700">
        <h1 className="text-2xl font-bold">MySarkar</h1>
        <p className="text-purple-200 text-sm">Admin Panel</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-purple-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">{user?.name?.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-sm">{user?.name}</p>
            <p className="text-purple-200 text-xs capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            if (!item.available) return null;
            
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'text-purple-200 hover:bg-purple-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-purple-700">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-purple-200 hover:bg-purple-700 hover:text-white rounded-lg transition-all duration-200"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;