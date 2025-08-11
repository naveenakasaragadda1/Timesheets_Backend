import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  LogOut,
  User,
  Calendar,
  Users,
  BarChart3,
  Github,
  Twitter,
  Linkedin,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  role: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, role }) => {
  const { logout } = useAuth();

  const employeeTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'timesheets', label: 'My Timesheets', icon: Calendar },
  ];

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'timesheets', label: 'All Timesheets', icon: Calendar },
  ];

  const tabs = role === 'admin' ? adminTabs : employeeTabs;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-md font-bold text-lg shadow-sm">
              TimesheetPro
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-sm hidden sm:inline">
              | Smart Work Tracking
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <User className="text-gray-600 dark:text-gray-300" size={20} />
            <button
              onClick={logout}
              className="flex items-center gap-1 px-3 py-1 bg-red-50 dark:bg-red-800 text-red-600 dark:text-red-100 hover:bg-red-100 border border-red-200 rounded-md text-sm transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-2 flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
             >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto flex-1 p-4">{children}</main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="text-sm">
            © {new Date().getFullYear()} TimesheetPro. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-300 transition">
              <Github size={18} />
            </a>
            <a href="#" className="hover:text-gray-300 transition">
              <Twitter size={18} />
            </a>
            <a href="#" className="hover:text-gray-300 transition">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
