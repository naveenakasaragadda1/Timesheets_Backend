import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RegisterProps {
  onToggleMode: () => void;
}

const Register: React.FC<RegisterProps> = ({ onToggleMode }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employeeId: '',
    department: '',
    role: 'employee',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(formData);
      setSuccess('Registered successfully! Redirecting to login...');
      setTimeout(() => {
        onToggleMode(); // 👈 switch to login screen
      }, 1500);
    } catch (err: any) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6">Register</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <input type="text" name="name" placeholder="Name" onChange={handleChange} required className="mb-4 w-full p-2 border rounded" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="mb-4 w-full p-2 border rounded" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="mb-4 w-full p-2 border rounded" />
        <input type="text" name="employeeId" placeholder="Employee ID" onChange={handleChange} required className="mb-4 w-full p-2 border rounded" />
        <input type="text" name="department" placeholder="Department" onChange={handleChange} required className="mb-4 w-full p-2 border rounded" />

        <select name="role" onChange={handleChange} className="mb-4 w-full p-2 border rounded">
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded">
          Create Account
        </button>

        <p className="mt-4 text-sm">
          Already have an account?{' '}
          <span onClick={onToggleMode} className="text-blue-600 cursor-pointer">
            Log in
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
