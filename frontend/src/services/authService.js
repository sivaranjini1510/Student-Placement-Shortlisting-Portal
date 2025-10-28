import api from '../config/api';

const login = async (credentials) => {
  try {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  } catch (err) {
    // Normalize error response so callers can handle it consistently
    if (err.response && err.response.data) {
      return err.response.data;
    }
    return { status: 'error', message: err.message };
  }
};

export default { login };
