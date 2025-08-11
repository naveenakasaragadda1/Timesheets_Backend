import React, { useState, useEffect } from 'react';
import { timesheetAPI } from '../utils/api';
import { X, Save, Loader } from 'lucide-react';

interface TimesheetFormProps {
  timesheet?: any;
  onClose: () => void;
  onSaved: () => void;
}

const TimesheetForm: React.FC<TimesheetFormProps> = ({ timesheet, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    date: '',
    plannedWork: '',
    actualWork: '',
    remarks: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (timesheet) {
      setFormData({
        date: new Date(timesheet.date).toISOString().split('T')[0],
        plannedWork: timesheet.plannedWork,
        actualWork: timesheet.actualWork,
        remarks: timesheet.remarks
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        plannedWork: '',
        actualWork: '',
        remarks: ''
      });
    }
  }, [timesheet]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (timesheet) {
        await timesheetAPI.updateTimesheet(timesheet._id, formData);
      } else {
        await timesheetAPI.createTimesheet(formData);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {timesheet ? 'Edit Timesheet' : 'New Timesheet'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="plannedWork" className="block text-sm font-medium text-gray-700 mb-1">
              Planned Work
            </label>
            <textarea
              id="plannedWork"
              name="plannedWork"
              required
              rows={3}
              value={formData.plannedWork}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Describe what you planned to work on..."
            />
          </div>

          <div>
            <label htmlFor="actualWork" className="block text-sm font-medium text-gray-700 mb-1">
              Actual Work
            </label>
            <textarea
              id="actualWork"
              name="actualWork"
              required
              rows={3}
              value={formData.actualWork}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Describe what you actually worked on..."
            />
          </div>

          <div>
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-1">
              Remarks (Optional)
            </label>
            <textarea
              id="remarks"
              name="remarks"
              rows={2}
              value={formData.remarks}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Any additional comments..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  {timesheet ? 'Update' : 'Save'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimesheetForm;