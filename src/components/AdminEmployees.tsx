import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Employee {
  _id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  isActive: boolean;
}

const AdminEmployees: React.FC = () => {
  const { token } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState<Partial<Employee & { password: string }>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('https://timesheet-server-gkd8.onrender.com/api/admin/employees', {

        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`https://timesheet-server-gkd8.onrender.com/api/admin/employees/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('https://timesheet-server-gkd8.onrender.com/api/admin/employees', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setForm({});
      setEditingId(null);
      fetchEmployees();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred');
    }
  };

  const handleEdit = (emp: Employee) => {
    setForm(emp);
    setEditingId(emp._id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await axios.delete(`https://timesheet-server-gkd8.onrender.com/api/admin/employees/${id}`, {

        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Employees</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={form.name || ''}
            onChange={handleInputChange}
            placeholder="Name"
            required
            className="border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            value={form.email || ''}
            onChange={handleInputChange}
            placeholder="Email"
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="employeeId"
            value={form.employeeId || ''}
            onChange={handleInputChange}
            placeholder="Employee ID"
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="department"
            value={form.department || ''}
            onChange={handleInputChange}
            placeholder="Department"
            className="border p-2 rounded"
          />
          {!editingId && (
            <input
              type="password"
              name="password"
              value={form.password || ''}
              onChange={handleInputChange}
              placeholder="Password"
              required
              className="border p-2 rounded"
            />
          )}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? 'Update Employee' : 'Add Employee'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({});
              setError('');
            }}
            className="ml-2 text-gray-600 underline"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Employee List */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Employee ID</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp._id} className="border-b">
                <td className="px-4 py-2">{emp.name}</td>
                <td className="px-4 py-2">{emp.email}</td>
                <td className="px-4 py-2">{emp.employeeId}</td>
                <td className="px-4 py-2">{emp.department}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      emp.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {emp.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(emp._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-4">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEmployees;
