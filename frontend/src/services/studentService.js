import api from '../config/api';

const getProfile = async () => {
  const res = await api.get('/student/profile');
  return res.data;
};

const updateAcademic = async (formData) => {
  const res = await api.put('/student/update-academic', formData);
  return res.data;
};

const updateProfile = async (formData) => {
  const res = await api.put('/student/profile', formData);
  return res.data;
};

const viewResume = async () => {
  const res = await api.get('/student/resume', { responseType: 'blob' });
  return res.data;
};

export default { getProfile, updateAcademic, updateProfile, viewResume };
