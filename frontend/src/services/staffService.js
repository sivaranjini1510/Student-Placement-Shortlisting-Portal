import api from '../config/api';

const createCompany = async (companyData) => {
  const res = await api.post('/staff/companies', companyData);
  return res.data;
};

const getCompany = async (id) => {
  const res = await api.get(`/staff/companies/${id}`);
  return res.data;
};

const downloadShortlist = async (id) => {
  const res = await api.get(`/staff/companies/${id}/download`, { responseType: 'blob' });
  return res.data;
};

const getPlacedStudents = async (department = '') => {
  const url = department ? `/staff/placed-students?department=${department}` : '/staff/placed-students';
  const res = await api.get(url);
  return res.data;
};

const getNotPlacedStudents = async (department = '') => {
  const url = department ? `/staff/not-placed-students?department=${department}` : '/staff/not-placed-students';
  const res = await api.get(url);
  return res.data;
};

export default { createCompany, getCompany, downloadShortlist, getPlacedStudents, getNotPlacedStudents };
