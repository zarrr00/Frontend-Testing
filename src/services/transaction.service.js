import api from './api';

/**
 * Service for CRUD operations on financial transactions and OCR receipt scanning.
 */
export const transactionService = {
  /**
   * @param {Object} [params={}] - Query filters (limit, offset, type, etc.).
   * @returns {Promise<Array>} List of transactions.
   */
  getTransactions: async (params = {}) => {
    try {
      const response = await api.get('/transactions', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengambil data transaksi';
    }
  },

  /**
   * Fetch total transaction count for current profile.
   * @returns {Promise<number>} Total transactions.
   */
  getTotalCount: async () => {
    try {
      const response = await api.get('/transactions', { params: { limit: 1 } });
      return response.data.pagination?.total || 0;
    } catch (error) {
      console.error('Failed to get transactions count:', error);
      return 0;
    }
  },

  /**
   * @param {Object} transactionData - Transaction payload (type, amount, description, etc.).
   * @returns {Promise<Object>} The newly created transaction.
   */
  createTransaction: async (transactionData) => {
    try {
      const response = await api.post('/transactions', transactionData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal membuat transaksi baru';
    }
  },

  /**
   * @param {string} id - Transaction ID.
   * @param {Object} transactionData - Updated fields.
   * @returns {Promise<Object>} The updated transaction.
   */
  updateTransaction: async (id, transactionData) => {
    try {
      const response = await api.put(`/transactions/${id}`, transactionData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal memperbarui transaksi';
    }
  },

  /**
   * @param {string} id - Transaction ID to delete.
   * @returns {Promise<Object>} Deletion confirmation.
   */
  deleteTransaction: async (id) => {
    try {
      const response = await api.delete(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal menghapus transaksi';
    }
  },

  /**
   * Upload a receipt image for OCR text extraction.
   * @param {File} file - The receipt image file.
   * @returns {Promise<Object>} Extracted data (amount, description, etc.).
   */
  scanReceipt: async (file) => {
    try {
      const formData = new FormData();
      formData.append('receipt', file);
      const response = await api.post('/transactions/ocr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal melakukan scan struk OCR';
    }
  },
};