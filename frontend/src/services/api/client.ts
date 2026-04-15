import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const sanctumUrl = apiUrl.replace(/\/api$/, ''); // Remove /api if present to hit the base URL for sanctum

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
  },
  withCredentials: true, // Crucial for Laravel Sanctum session cookies
});

export const initCsrfCookie = () => {
  return axios.get(`${sanctumUrl}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
};

export default api;
