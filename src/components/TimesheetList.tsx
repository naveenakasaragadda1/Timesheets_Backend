import React, { useEffect, useState } from 'react';
import { timesheetAPI, downloadBlob } from '../utils/api';
import { format } from 'date-fns';
import TimesheetForm from './TimesheetForm';
import { Plus, Edit, Download } from 'lucide-react';

interface Timesheet {
  _id: string;
  date: string;
  plannedWork: string;
  actualWork: string;
  remarks: string;
  status: string;
  adminComments?: string;
}

const TimesheetList: React.FC = () => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTimesheets = async () => {
    try {
      setLoading(true);
      const res = await timesheetAPI.getTimesheets();
      setTimesheets(res.data);
    } catch (err) {
      console.error('Error fetching timesheets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const handleEdit = (ts: Timesheet) => {
    if (['pending', 'rejected'].includes(ts.status)) {
      setSelectedTimesheet(ts);
      setShowForm(true);
    } else {
      alert('Only pending or rejected timesheets can be edited.');
    }
  };

  const handleCSVDownload = async () => {
    try {
      const res = await timesheetAPI.downloadCSV();
      downloadBlob(res.data, 'my_timesheets.csv'); // ✅ fixed argument count
    } catch (err) {
      console.error('CSV download failed:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <h2 className="text-xl font-semibold">My Timesheets</h2>
        <div className="flex gap-3">
          <button
            onClick={handleCSVDownload}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            <Download className="w-4 h-4 mr-2" />
            Download CSV
          </button>
          <button
            onClick={() => {
              setSelectedTimesheet(null);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Timesheet
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading timesheets...</p>
      ) : timesheets.length === 0 ? (
        <p className="text-gray-500">No timesheets found.</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full bg-white border rounded-md shadow">
            <thead>
              <tr className="bg-gray-100 text-sm text-left">
                <th className="p-3">Date</th>
                <th className="p-3">Planned</th>
                <th className="p-3">Actual</th>
                <th className="p-3">Remarks</th>
                <th className="p-3">Status</th>
                <th className="p-3">Admin Comments</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timesheets.map(ts => (
                <tr key={ts._id} className="border-t hover:bg-gray-50 text-sm">
                  <td className="p-3">{format(new Date(ts.date), 'MMM dd, yyyy')}</td>
                  <td className="p-3">{ts.plannedWork}</td>
                  <td className="p-3">{ts.actualWork}</td>
                  <td className="p-3">{ts.remarks || '-'}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        ts.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : ts.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {ts.status}
                    </span>
                  </td>
                  <td className="p-3">{ts.adminComments || '-'}</td>
                  <td className="p-3">
                    {['pending', 'rejected'].includes(ts.status) && (
                      <button
                        onClick={() => handleEdit(ts)}
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <TimesheetForm
          timesheet={selectedTimesheet || undefined}
          onClose={() => setShowForm(false)}
          onSaved={fetchTimesheets}
        />
      )}
    </div>
  );
};

export default TimesheetList;
