import api from './api';
export const authService = {
  loginWithGoogle: () => {
    window.location.href = 'http://localhost:3000/api/v1/auth/google';
  },
  loginWithGithub: () => {
    window.location.href = 'http://localhost:3000/api/v1/auth/github';
  },
  handleOauthCallback: (hash) => {
    // Extract Token
    const params = new URLSearchParams(hash.replace('#', '?'));
    const token = params.get('access_token');
    if (token) {
      localStorage.setItem('kasflow_token', token);
      return true;
    }
    return false;
  },
  logout: () => {
    localStorage.removeItem('kasflow_token');
    localStorage.removeItem('kasflow_user');
  },
  fetchCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data && response.data.data) {
        localStorage.setItem('kasflow_user', JSON.stringify(response.data.data));
        return response.data.data;
      }
    } catch (error) {
      console.error("Failed to fetch current user", error);
      throw error;
    }
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('kasflow_user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },
  getToken: () => {
    return localStorage.getItem('kasflow_token');
  }
};
