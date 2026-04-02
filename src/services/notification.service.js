import api from './api';

export const notificationService = {
  getNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengambil notifikasi';
    }
  },
};
