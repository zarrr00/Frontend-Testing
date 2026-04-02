import api from './api';

export const customerService = {
  getCustomers: async (params = {}) => {
    try {
      const response = await api.get('/customers', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengambil data pelanggan';
    }
  },

  getCustomer: async (id) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengambil detail pelanggan';
    }
  },

  createCustomer: async (customerData) => {
    try {
      const response = await api.post('/customers', customerData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal menambah pelanggan baru';
    }
  },

  updateCustomer: async (id, customerData) => {
    try {
      const response = await api.put(`/customers/${id}`, customerData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal memperbarui pelanggan';
    }
  },

  deleteCustomer: async (id) => {
    try {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal menghapus pelanggan';
    }
  },
};
