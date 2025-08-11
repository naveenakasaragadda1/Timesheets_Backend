// TOP: Same imports as before
import React, { useEffect, useState } from 'react';
import { adminAPI, downloadBlob } from '../utils/api';
import { format } from 'date-fns';

const AdminTimesheets: React.FC = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await adminAPI.getEmployees();
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    }
  };

  const fetchTimesheets = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedEmployee) params.employee = selectedEmployee;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const res = await adminAPI.getAllTimesheets(params);
      setTimesheets(res.data);
    } catch (err) {
      console.error('Failed to fetch timesheets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchTimesheets();
  }, []);

  const handleReview = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      let adminComments = '';
      if (status === 'rejected') {
        adminComments = prompt('Enter reason for rejection') || '';
      }
      await adminAPI.reviewTimesheet(id, { status, adminComments });
      fetchTimesheets();
    } catch (err) {
      console.error('Failed to review timesheet', err);
    }
  };

  const handleCSVDownload = async () => {
    try {
      const params: any = {};
      if (selectedEmployee) params.employee = selectedEmployee;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const res = await adminAPI.exportAllCSV({ params });
      downloadBlob(res.data, 'timesheets.csv');
    } catch (err) {
      console.error('CSV download failed', err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🗂 All Timesheets</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end bg-white p-4 rounded-lg shadow">
        <div>
          <label className="block text-sm font-semibold mb-1">Employee</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Employees</option>
            {employees.map((emp: any) => (
              <option key={emp._id} value={emp._id}>{emp.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">From Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">To Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={fetchTimesheets}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full"
          >
            Apply Filters
          </button>
          <button
            onClick={handleCSVDownload}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full"
          >
            Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600 italic">Loading timesheets...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="text-left text-gray-700 uppercase text-xs">
                <th className="px-4 py-3 border">Date</th>
                <th className="px-4 py-3 border">Employee</th>
                <th className="px-4 py-3 border">Planned</th>
                <th className="px-4 py-3 border">Actual</th>
                <th className="px-4 py-3 border">Remarks</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border">Comments</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timesheets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    No timesheets found.
                  </td>
                </tr>
              ) : (
                timesheets.map((ts: any, idx) => (
                  <tr
                    key={ts._id}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-4 py-2 border">{format(new Date(ts.date), 'yyyy-MM-dd')}</td>
                    <td className="px-4 py-2 border">{ts.employeeName}</td>
                    <td className="px-4 py-2 border">{ts.plannedWork}</td>
                    <td className="px-4 py-2 border">{ts.actualWork}</td>
                    <td className="px-4 py-2 border">{ts.remarks || '-'}</td>
                    <td className="px-4 py-2 border">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          ts.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : ts.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {ts.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border">{ts.adminComments || '-'}</td>
                    <td className="px-4 py-2 border flex flex-wrap gap-2">
                      <button
                        className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1 rounded-lg text-xs font-medium transition disabled:opacity-50"
                        disabled={ts.status !== 'pending'}
                        onClick={() => handleReview(ts._id, 'accepted')}
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="bg-rose-100 text-rose-700 hover:bg-rose-200 px-3 py-1 rounded-lg text-xs font-medium transition disabled:opacity-50"
                        disabled={ts.status !== 'pending'}
                        onClick={() => handleReview(ts._id, 'rejected')}
                      >
                        ❌ Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTimesheets;
