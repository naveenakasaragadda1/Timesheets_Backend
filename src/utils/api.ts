import axios from 'axios';

const api = axios.create({
  baseURL: 'https://timesheet-backend-production-283f.up.railway.app/api',
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Timesheet APIs (for Employees)
export const timesheetAPI = {
  getTimesheets: (params?: any) => api.get('/timesheets', { params }),
  createTimesheet: (data: any) => api.post('/timesheets', data),
  updateTimesheet: (id: string, data: any) => api.put(`/timesheets/${id}`, data),
  deleteTimesheet: (id: string) => api.delete(`/timesheets/${id}`),
  downloadCSV: () => api.get('/timesheets/export/csv', { responseType: 'blob' }),
  downloadPDF: () => api.get('/timesheets/download-pdf', { responseType: 'blob' }),
};

// Admin APIs
export const adminAPI = {
  getEmployees: () => api.get('/admin/employees'),
  createEmployee: (data: any) => api.post('/admin/employees', data),
  updateEmployee: (id: string, data: any) => api.put(`/admin/employees/${id}`, data),
  deleteEmployee: (id: string) => api.delete(`/admin/employees/${id}`),

  getAllTimesheets: (params?: any) => api.get('/admin/timesheets', { params }),
  reviewTimesheet: (id: string, data: any) => api.put(`/admin/timesheets/${id}/review`, data),
  exportAllCSV: (params?: any) => api.get('/admin/timesheets/export/csv', {
    params,
    responseType: 'blob',
  }),
};

// Blob downloader helper
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
