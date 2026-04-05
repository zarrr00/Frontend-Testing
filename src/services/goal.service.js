import api from './api';

export const goalService = {
  getGoals: async () => {
    try {
      const response = await api.get('/goals');
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengambil data tujuan keuangan';
    }
  },

  createGoal: async (goalData) => {
    try {
      const response = await api.post('/goals', goalData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal membuat tujuan keuangan baru';
    }
  },

  updateGoal: async (id, goalData) => {
    try {
      const response = await api.put(`/goals/${id}`, goalData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal memperbarui tujuan keuangan';
    }
  },

  deleteGoal: async (id) => {
    try {
      const response = await api.delete(`/goals/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal menghapus tujuan keuangan';
    }
  },
};
