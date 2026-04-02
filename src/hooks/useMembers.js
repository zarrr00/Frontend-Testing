import { useState, useEffect, useCallback } from 'react';
import { memberService } from '../services/member.service';

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

  const invite = async (profileId, email) => {
    try {
      const result = await memberService.inviteMember(profileId, email);
      await fetchMembers();
      return result;
    } catch (err) {
      throw err;
    }
  };

  const acceptInvite = async (inviteId) => {
    try {
      const result = await memberService.acceptInvite(inviteId);
      await fetchMembers();
      return result;
    } catch (err) {
      throw err;
    }
  };

  const removeMember = async (memberId) => {
    try {
      await memberService.removeMember(memberId);
      setMembers(prev => prev.filter(m => m.id !== memberId));
      return true;
    } catch (err) {
      throw err;
    }
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
