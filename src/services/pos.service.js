import api from './api';

export const posService = {
  // Payment Methods
  getPaymentMethods: async () => {
    try {
      const response = await api.get('/pos/payment-methods');
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengambil metode pembayaran';
    }
  },

  createPaymentMethod: async (name) => {
    try {
      const response = await api.post('/pos/payment-methods', { name });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal menambah metode pembayaran';
    }
  },

  deletePaymentMethod: async (id) => {
    try {
      const response = await api.delete(`/pos/payment-methods/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal menghapus metode pembayaran';
    }
  },

  // Vouchers
  getVouchers: async () => {
    try {
      const response = await api.get('/pos/vouchers');
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengambil data voucher';
    }
  },

  createVoucher: async (voucherData) => {
    try {
      const response = await api.post('/pos/vouchers', voucherData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal membuat voucher baru';
    }
  },

  updateVoucher: async (id, voucherData) => {
    try {
      const response = await api.put(`/pos/vouchers/${id}`, voucherData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal memperbarui voucher';
    }
  },

  deleteVoucher: async (id) => {
    try {
      const response = await api.delete(`/pos/vouchers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal menghapus voucher';
    }
  },

  validateVoucher: async (code) => {
    try {
      const response = await api.post('/pos/vouchers/validate', { code });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Voucher tidak valid';
    }
  },

  // Orders
  getOrders: async (params = {}) => {
    try {
      const response = await api.get('/pos/orders', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengambil data pesanan';
    }
  },

  getOrder: async (id) => {
    try {
      const response = await api.get(`/pos/orders/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengambil detail pesanan';
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await api.post('/pos/orders', orderData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal membuat pesanan baru';
    }
  },

  cancelOrder: async (id) => {
    try {
      const response = await api.post(`/pos/orders/${id}/cancel`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal membatalkan pesanan';
    }
  },

  printReceipt: async (id) => {
    try {
      const response = await api.get(`/pos/orders/${id}/receipt`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mencetak struk';
    }
  },

  // Sales Report
  getSalesReport: async (params = {}) => {
    try {
      const response = await api.get('/pos/sales-report', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengambil laporan penjualan';
    }
  },
};
