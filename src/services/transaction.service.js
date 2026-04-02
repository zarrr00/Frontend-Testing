import api from './api';
export const transactionService = {
  getTransactions: async (params = {}) => {
    try {
      const response = await api.get('/transactions', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengambil data transaksi';
    }
  },
  createTransaction: async (transactionData) => {
    try {
      const response = await api.post('/transactions', transactionData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal membuat transaksi baru';
    }
  },
  updateTransaction: async (id, transactionData) => {
    try {
      const response = await api.put(`/transactions/${id}`, transactionData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal memperbarui transaksi';
    }
  },
  deleteTransaction: async (id) => {
    try {
      const response = await api.delete(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal menghapus transaksi';
    }
  },
  scanReceipt: async (file) => {
    try {
      const formData = new FormData();
      formData.append('receipt', file);
      const response = await api.post('/transactions/ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal melakukan scan struk OCR';
    }
  }
};