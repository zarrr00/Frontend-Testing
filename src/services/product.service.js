import api from './api';

export const productService = {
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengambil data produk';
    }
  },

  getProduct: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengambil detail produk';
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal menambah produk baru';
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal memperbarui produk';
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal menghapus produk';
    }
  },

  adjustStock: async (id, adjustment) => {
    try {
      const response = await api.patch(`/products/${id}/stock`, { adjustment });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengubah stok produk';
    }
  },
};
