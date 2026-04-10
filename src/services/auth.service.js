import api from './api';
import { API_BASE_URL } from '../config/constants';

/**
 * Authentication service handling OAuth flows and user session management.
 */
export const authService = {
  /** Redirect to Google OAuth consent screen. */
  loginWithGoogle: () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  /** Redirect to GitHub OAuth consent screen. */
  loginWithGithub: () => {
    window.location.href = `${API_BASE_URL}/auth/github`;
  },

  /**
   * Extract access token from OAuth callback URL hash and persist it.
   * @param {string} hash - The URL hash fragment from the callback.
   * @returns {boolean} Whether a valid token was found and stored.
   */
  handleOauthCallback: (hash) => {
    const params = new URLSearchParams(hash.replace('#', '?'));
    const token = params.get('access_token');
    if (token) {
      localStorage.setItem('kasflow_token', token);
      return true;
    }
    return false;
  },

  /** Clear all stored credentials. */
  logout: () => {
    localStorage.removeItem('kasflow_token');
    localStorage.removeItem('kasflow_user');
  },

  /**
   * Fetch current user profile from the API and cache it locally.
   * @returns {Promise<Object>} The user profile data.
   */
  fetchCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data && response.data.data) {
        localStorage.setItem('kasflow_user', JSON.stringify(response.data.data));
        return response.data.data;
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      throw error;
    }
  },

  /**
   * Update the current user profile (e.g. name, avatar) via API.
   * @param {Object} data - Form data with full_name and/or avatar_url
   * @returns {Promise<Object>} The updated user profile data.
   */
  updateCurrentUser: async (data) => {
    try {
      let payload = data;
      let headers = {};
      
      if (data.avatarFile) {
        payload = new FormData();
        if (data.full_name) payload.append('full_name', data.full_name);
        payload.append('avatar', data.avatarFile);
        headers = { 'Content-Type': 'multipart/form-data' };
      }

      const response = await api.put('/auth/me', payload, { headers });
      if (response.data && response.data.data) {
        localStorage.setItem('kasflow_user', JSON.stringify(response.data.data));
        return response.data.data;
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  },

  /**
   * Retrieve cached user profile from localStorage.
   * @returns {Object|null} The cached user or null.
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('kasflow_user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  /**
   * Retrieve the stored auth token.
   * @returns {string|null} The JWT token or null.
   */
  getToken: () => {
    return localStorage.getItem('kasflow_token');
  },
};
