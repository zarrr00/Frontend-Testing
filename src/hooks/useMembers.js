import { useState, useEffect, useCallback } from 'react';
import { memberService } from '../services/member.service';

/**
 * Hook for managing team member invitations and access control.
 *
 * @param {Object} [initialParams={}] - Initial query filters.
 * @returns {Object} Members state and mutation functions.
 */
export const useMembers = (initialParams = {}) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await memberService.getMembers(params);
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const invite = async (profileId, email, role = 'viewer') => {
    const result = await memberService.inviteMember(profileId, email, role);
    await fetchMembers();
    return result;
  };

  const acceptInvite = async (inviteId) => {
    const result = await memberService.acceptInvite(inviteId);
    await fetchMembers();
    return result;
  };

  const removeMember = async (memberId) => {
    await memberService.removeMember(memberId);
    setMembers(prev => prev.filter(m => m.id !== memberId));
    return true;
  };

  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  return {
    members,
    loading,
    error,
    invite,
    acceptInvite,
    removeMember,
    refresh: fetchMembers,
    updateParams,
  };
};
