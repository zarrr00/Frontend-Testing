import axios from 'axios';
// Axios Instance
const api = axios.create({
  // Base URL
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 10000, // Request Timeout
  headers: {
    'Content-Type': 'application/json',
  },
});
// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kasflow_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token Expired
      localStorage.removeItem('kasflow_token');
      localStorage.removeItem('kasflow_user');
      // Redirect Login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
export default api;