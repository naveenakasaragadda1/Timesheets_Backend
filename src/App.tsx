import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import TimesheetList from './components/TimesheetList';
import AdminEmployees from './components/AdminEmployees';
import AdminTimesheets from './components/AdminTimesheets';

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  return isLogin ? (
    <Login onToggleMode={() => setIsLogin(false)} />
  ) : (
    <Register onToggleMode={() => setIsLogin(true)} />
  );
};

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) return <AuthScreen />;

  const isAdmin = user.role === 'admin';
  const isEmployee = user.role === 'employee';

  const renderContent = () => {
    if (isAdmin) {
      if (activeTab === 'dashboard') return <AdminDashboard onTabChange={setActiveTab} />;
      if (activeTab === 'employees') return <AdminEmployees />;
      if (activeTab === 'timesheets') return <AdminTimesheets />;
    }

    if (isEmployee) {
      if (activeTab === 'dashboard') return <Dashboard />;
      if (activeTab === 'timesheets') return <TimesheetList />;
    }

    return <div className="p-4 text-red-600">Invalid role or tab</div>;
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} role={user.role}>
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;
