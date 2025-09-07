import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Users, CalendarCheck } from 'lucide-react';

interface Stats {
  totalTimesheets: number;
  pending: number;
  accepted: number;
  rejected: number;
  totalEmployees: number;
}

interface AdminDashboardProps {
  onTabChange: (tab: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onTabChange }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://timesheet-server-gkd8.onrender.com/api/admin/dashboard', {

          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch admin dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800">Total Timesheets</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalTimesheets}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800">Pending</h2>
          <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800">Accepted</h2>
          <p className="text-3xl font-bold text-green-600">{stats.accepted}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800">Rejected</h2>
          <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800">Total Employees</h2>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalEmployees}</p>
        </div>
      </div>

      {/* Navigation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="cursor-pointer bg-blue-100 hover:bg-blue-200 transition rounded-2xl shadow p-6 flex items-center justify-between"
          onClick={() => onTabChange('employees')}
        >
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Manage Employees</h2>
            <p className="text-sm text-gray-500">View and manage employee accounts</p>
          </div>
          <Users className="w-10 h-10 text-blue-600" />
        </div>

        <div
          className="cursor-pointer bg-green-100 hover:bg-green-200 transition rounded-2xl shadow p-6 flex items-center justify-between"
          onClick={() => onTabChange('timesheets')}
        >
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Review Timesheets</h2>
            <p className="text-sm text-gray-500">Approve or reject submitted timesheets</p>
          </div>
          <CalendarCheck className="w-10 h-10 text-green-600" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
