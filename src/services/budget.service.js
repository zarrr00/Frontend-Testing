import api from './api';

export const budgetService = {
  getBudgets: async (params = {}) => {
    try {
      const response = await api.get('/budgets', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengambil data anggaran';
    }
  },

  createBudget: async (budgetData) => {
    try {
      const response = await api.post('/budgets', budgetData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal membuat anggaran baru';
    }
  },

  updateBudget: async (id, budgetData) => {
    try {
      const response = await api.put(`/budgets/${id}`, budgetData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal memperbarui anggaran';
    }
  },

  deleteBudget: async (id) => {
    try {
      const response = await api.delete(`/budgets/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal menghapus anggaran';
    }
  },
};
