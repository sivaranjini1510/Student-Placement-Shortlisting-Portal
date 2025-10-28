import api from '../config/api';

const getAllStudents = async () => {
  const res = await api.get('/admin/students');
  return res.data;
};

const getAllStaff = async () => {
  const res = await api.get('/admin/staff');
  return res.data;
};

const getDashboardStats = async () => {
  const res = await api.get('/admin/dashboard');
  return res.data;
};

const registerUser = async (payload) => {
  const endpoint = payload.role === 'student' ? '/admin/create-student' : '/admin/create-staff';
  const res = await api.post(endpoint, payload);
  return res.data;
};

const updateStudent = async (id, payload) => {
  const res = await api.put(`/admin/student/${id}`, payload);
  return res.data;
};

const updateStaff = async (id, payload) => {
  const res = await api.put(`/admin/staff/${id}`, payload);
  return res.data;
};

const bulkUpload = async (type, formData) => {
  const endpoint = type === 'student' ? 'students' : 'staff';
  const res = await api.post(`/admin/bulk-upload/${endpoint}`, formData);
  return res.data;
};

const deleteStudent = async (id) => {
  const res = await api.delete(`/admin/student/${id}`);
  return res.data;
};

const deleteStaff = async (id) => {
  const res = await api.delete(`/admin/staff/${id}`);
  return res.data;
};

const exportStudentResumes = async () => {
  const res = await api.get('/admin/export-resumes', { responseType: 'blob' });
  return res.data;
};

const exportPlacedStudentResumes = async () => {
  const res = await api.get('/admin/export-placed-resumes', { responseType: 'blob' });
  return res.data;
};

const exportNotPlacedStudentResumes = async () => {
  const res = await api.get('/admin/export-not-placed-resumes', { responseType: 'blob' });
  return res.data;
};

const exportPlacedStudentsList = async (department = '') => {
  const url = department ? `/admin/export-placed-students-list?department=${department}` : '/admin/export-placed-students-list';
  const res = await api.get(url, { responseType: 'blob' });
  return res.data;
};

const exportNotPlacedStudentsList = async (department = '') => {
  const url = department ? `/admin/export-not-placed-students-list?department=${department}` : '/admin/export-not-placed-students-list';
  const res = await api.get(url, { responseType: 'blob' });
  return res.data;
};

const getPlacedStudents = async (department = '') => {
  const url = department ? `/admin/placed-students?department=${department}` : '/admin/placed-students';
  const res = await api.get(url);
  return res.data;
};

const getNotPlacedStudents = async (department = '') => {
  const url = department ? `/admin/not-placed-students?department=${department}` : '/admin/not-placed-students';
  const res = await api.get(url);
  return res.data;
};

const downloadFeedbackDocument = async (feedbackId) => {
  const res = await api.get(`/feedback/${feedbackId}/download`, { responseType: 'blob' });
  return res.data;
};

export default {
  getAllStudents,
  getAllStaff,
  getDashboardStats,
  registerUser,
  updateStudent,
  updateStaff,
  deleteStudent,
  deleteStaff,
  getPlacedStudents,
  getNotPlacedStudents,
  exportStudentResumes,
  exportPlacedStudentResumes,
  exportNotPlacedStudentResumes,
  exportPlacedStudentsList,
  exportNotPlacedStudentsList,
  downloadFeedbackDocument,
  bulkUpload
};
