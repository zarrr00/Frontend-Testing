import api from './api';

export const debtService = {
  getDebts: async () => {
    try {
      const response = await api.get('/debts');
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengambil data hutang/piutang';
    }
  },

  createDebt: async (debtData) => {
    try {
      const response = await api.post('/debts', debtData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal membuat hutang/piutang baru';
    }
  },

  updateDebt: async (id, debtData) => {
    try {
      const response = await api.put(`/debts/${id}`, debtData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal memperbarui hutang/piutang';
    }
  },

  payDebt: async (id, amount) => {
    try {
      const response = await api.post(`/debts/${id}/pay`, { amount });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mencatat pembayaran hutang';
    }
  },

  deleteDebt: async (id) => {
    try {
      const response = await api.delete(`/debts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal menghapus hutang/piutang';
    }
  },
};
