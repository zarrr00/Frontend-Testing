import api from './api';
export const dashboardService = {
  getSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data.data;
  },
  getChart: async () => {
    const response = await api.get('/dashboard/chart');
    return response.data.data;
  },
  getRecentTransactions: async (limit = 5) => {
    const response = await api.get(`/dashboard/recent?limit=${limit}`);
    return response.data.data;
  },
  getTopCategories: async () => {
    const response = await api.get('/dashboard/top-categories');
    return response.data.data;
  }
};
