import axios from 'axios';

const api = axios.create({
  // Use relative path so dev server proxy (vite) can forward to backend.
  // If you prefer an absolute backend url, set VITE_API_URL in .env (e.g. http://localhost:5000/api)
  baseURL: 'https://student-placement-shortlisting-portal.onrender.com/api',
  withCredentials: true,
});

export default api;

