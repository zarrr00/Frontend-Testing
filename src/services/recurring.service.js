import api from './api';

export const recurringService = {
  getRecurring: async (params = {}) => {
    try {
      const response = await api.get('/recurring', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengambil data transaksi berulang';
    }
  },

  createRecurring: async (recurringData) => {
    try {
      const response = await api.post('/recurring', recurringData, { params: { profile_id: recurringData.profile_id } });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal membuat transaksi berulang baru';
    }
  },

  updateRecurring: async (id, recurringData) => {
    try {
      const response = await api.put(`/recurring/${id}`, recurringData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal memperbarui transaksi berulang';
    }
  },

  deleteRecurring: async (id) => {
    try {
      const response = await api.delete(`/recurring/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal menghapus transaksi berulang';
    }
  },
};
