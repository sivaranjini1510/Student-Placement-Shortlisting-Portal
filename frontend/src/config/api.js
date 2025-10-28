import axios from 'axios';

const api = axios.create({
  // Use relative path so dev server proxy (vite) can forward to backend.
  // If you prefer an absolute backend url, set VITE_API_URL in .env (e.g. http://localhost:5000/api)
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

export default api;

