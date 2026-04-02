import { useState, useEffect, useCallback } from 'react';
import { recurringService } from '../services/recurring.service';

export const useRecurring = (initialParams = {}) => {
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchRecurring = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await recurringService.getRecurring(params);
      setRecurring(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchRecurring();
  }, [fetchRecurring]);

  const addRecurring = async (recurringData) => {
    try {
      const newItem = await recurringService.createRecurring(recurringData);
      setRecurring(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      throw err;
    }
  };

  const editRecurring = async (id, recurringData) => {
    try {
      const updated = await recurringService.updateRecurring(id, recurringData);
      setRecurring(prev => prev.map(r => r.id === id ? updated : r));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const removeRecurring = async (id) => {
    try {
      await recurringService.deleteRecurring(id);
      setRecurring(prev => prev.filter(r => r.id !== id));
      return true;
    } catch (err) {
      throw err;
    }
  };

  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  return {
    recurring,
    loading,
    error,
    addRecurring,
    editRecurring,
    removeRecurring,
    refresh: fetchRecurring,
    updateParams,
  };
};
