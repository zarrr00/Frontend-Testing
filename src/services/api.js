import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

/**
 * Pre-configured Axios instance for all KasFlow API requests.
 * Automatically attaches auth tokens and handles 401 redirects.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Bearer token and current profile mode from localStorage to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kasflow_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Attach profile mode (personal vs business) so backend resolves the correct profile
    const mode = localStorage.getItem('kasflow-mode') || 'personal';
    const profileType = mode === 'umkm' ? 'business' : 'personal';
    config.headers['X-Profile-Type'] = profileType;

    return config;
  },
  (error) => Promise.reject(error)
);

// Clear credentials and redirect on 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('kasflow_token');
      localStorage.removeItem('kasflow_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;