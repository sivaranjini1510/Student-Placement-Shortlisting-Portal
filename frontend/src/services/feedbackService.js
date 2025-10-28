import api from '../config/api';

const uploadFeedback = async (formData) => {
  const res = await api.post('/feedback/upload', formData);
  return res.data;
};

const getStudentFeedback = async () => {
  const res = await api.get('/feedback');
  return res.data;
};

const getAllFeedbacks = async () => {
  const res = await api.get('/feedback/all');
  return res.data;
};

const exportFeedbacksPDF = async () => {
  const res = await api.get('/feedback/export', { responseType: 'blob' });
  return res.data;
};

const updateFeedback = async (id, formData) => {
  const res = await api.put(`/feedback/${id}`, formData);
  return res.data;
};

const deleteFeedback = async (id) => {
  const res = await api.delete(`/feedback/${id}`);
  return res.data;
};

export default { uploadFeedback, getStudentFeedback, getAllFeedbacks, exportFeedbacksPDF, updateFeedback, deleteFeedback };
