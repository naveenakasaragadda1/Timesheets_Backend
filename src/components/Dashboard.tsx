import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { timesheetAPI, adminAPI } from '../utils/api';
import { Calendar, Clock, CheckCircle, XCircle, Users, FileText } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTimesheets: 0,
    pendingTimesheets: 0,
    acceptedTimesheets: 0,
    rejectedTimesheets: 0,
    totalEmployees: 0
  });
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    plannedWork: '',
    actualWork: '',
    remarks: '',
  });

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      if (user?.role === 'admin') {
        const [timesheetsRes, employeesRes] = await Promise.all([
          adminAPI.getAllTimesheets(),
          adminAPI.getEmployees()
        ]);
        const timesheets = timesheetsRes.data;
        setStats({
          totalTimesheets: timesheets.length,
          pendingTimesheets: timesheets.filter((t: any) => t.status === 'pending').length,
          acceptedTimesheets: timesheets.filter((t: any) => t.status === 'accepted').length,
          rejectedTimesheets: timesheets.filter((t: any) => t.status === 'rejected').length,
          totalEmployees: employeesRes.data.length
        });
      } else {
        const response = await timesheetAPI.getTimesheets();
        const timesheets = response.data;
        setStats({
          totalTimesheets: timesheets.length,
          pendingTimesheets: timesheets.filter((t: any) => t.status === 'pending').length,
          acceptedTimesheets: timesheets.filter((t: any) => t.status === 'accepted').length,
          rejectedTimesheets: timesheets.filter((t: any) => t.status === 'rejected').length,
          totalEmployees: 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await timesheetAPI.createTimesheet(formData); // POST to /api/timesheets
 // POST to /api/timesheets
      alert('Timesheet submitted!');
      setFormData({ date: '', plannedWork: '', actualWork: '', remarks: '' });
      setShowForm(false);
      fetchDashboardData(); // refresh stats
    } catch (err) {
      console.error('Failed to submit timesheet:', err);
      alert('Error submitting timesheet.');
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here's your dashboard overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Timesheets" value={stats.totalTimesheets} icon={<FileText className="h-6 w-6 text-white" />} color="bg-blue-500" />
        <StatCard title="Pending Reviews" value={stats.pendingTimesheets} icon={<Clock className="h-6 w-6 text-white" />} color="bg-yellow-500" />
        <StatCard title="Accepted" value={stats.acceptedTimesheets} icon={<CheckCircle className="h-6 w-6 text-white" />} color="bg-green-500" />
        <StatCard title="Rejected" value={stats.rejectedTimesheets} icon={<XCircle className="h-6 w-6 text-white" />} color="bg-red-500" />
      </div>

      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="Total Employees" value={stats.totalEmployees} icon={<Users className="h-6 w-6 text-white" />} color="bg-purple-500" />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user?.role === 'employee' && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Submit Timesheet</p>
                <p className="text-sm text-gray-500">Add your daily work log</p>
              </div>
            </button>
          )}

          {user?.role === 'admin' && (
            <>
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-8 w-8 text-green-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Manage Employees</p>
                  <p className="text-sm text-gray-500">Add or edit employee details</p>
                </div>
              </button>

              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="h-8 w-8 text-purple-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Review Timesheets</p>
                  <p className="text-sm text-gray-500">Approve or reject submissions</p>
                </div>
              </button>
            </>
          )}
        </div>
          {showForm && (
  <div className="mt-8 bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl shadow-md px-8 py-10 max-w-3xl mx-auto">
    <div className="flex items-center mb-6">
      <Calendar className="h-7 w-7 text-blue-600 mr-2" />
      <h2 className="text-2xl font-bold text-gray-800">Submit Your Timesheet</h2>
    </div>

    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Date */}
      <div className="relative">
        <label className="text-sm text-gray-600 font-medium mb-1 block">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* Planned Work */}
      <div className="relative">
        <label className="text-sm text-gray-600 font-medium mb-1 block">Planned Work</label>
        <input
          type="text"
          name="plannedWork"
          value={formData.plannedWork}
          onChange={handleChange}
          required
          placeholder="e.g., Design Homepage UI"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* Actual Work */}
      <div className="relative md:col-span-2">
        <label className="text-sm text-gray-600 font-medium mb-1 block">Actual Work</label>
        <input
          type="text"
          name="actualWork"
          value={formData.actualWork}
          onChange={handleChange}
          required
          placeholder="e.g., Designed and implemented UI + fixed mobile bug"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* Remarks */}
      <div className="relative md:col-span-2">
        <label className="text-sm text-gray-600 font-medium mb-1 block">Remarks (optional)</label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          rows={4}
          placeholder="Mention any blockers or important notes..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* Action Buttons */}
      <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          Submit Timesheet
        </button>
      </div>
    </form>
  </div>
)}

        
      </div>
    </div>
  );
};

export default Dashboard;
