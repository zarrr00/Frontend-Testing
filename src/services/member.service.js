import api from './api';

/**
 * Service for managing team member invitations and access.
 */
export const memberService = {
  /**
   * @param {Object} [params={}] - Query filters.
   * @returns {Promise<Array>} List of team members.
   */
  getMembers: async (params = {}) => {
    try {
      const response = await api.get('/members', { params });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengambil data anggota tim';
    }
  },

  /**
   * @param {string} profileId - Profile to invite into.
   * @param {string} email - Invitee email address.
   * @param {string} role - Role of the invitee (editor/viewer).
   * @returns {Promise<Object>} The invitation record.
   */
  inviteMember: async (profileId, email, role = 'viewer') => {
    try {
      const response = await api.post('/members/invite', { email, role }, { params: { profile_id: profileId } });
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal mengirim undangan';
    }
  },

  /**
   * @param {string} inviteId - Invitation ID to accept.
   * @returns {Promise<Object>} Confirmation data.
   */
  acceptInvite: async (inviteId) => {
    try {
      const response = await api.post(`/members/${inviteId}/accept`);
      return response.data.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal menerima undangan';
    }
  },

  /**
   * @param {string} memberId - Member ID to remove.
   * @returns {Promise<Object>} Deletion confirmation.
   */
  removeMember: async (memberId) => {
    try {
      const response = await api.delete(`/members/${memberId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Gagal menghapus anggota';
    }
  },
};
