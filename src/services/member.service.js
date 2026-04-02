import api from './api';

export const memberService = {
  getMembers: async (params = {}) => {
    try {
      const response = await api.get('/members', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengambil data anggota tim';
    }
  },

  inviteMember: async (profileId, email) => {
    try {
      const response = await api.post('/members/invite', { email }, { params: { profile_id: profileId } });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengirim undangan';
    }
  },

  acceptInvite: async (inviteId) => {
    try {
      const response = await api.post(`/members/${inviteId}/accept`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal menerima undangan';
    }
  },

  removeMember: async (memberId) => {
    try {
      const response = await api.delete(`/members/${memberId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal menghapus anggota';
    }
  },
};
