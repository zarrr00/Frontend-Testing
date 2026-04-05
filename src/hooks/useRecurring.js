import { useState, useEffect, useCallback } from 'react';
import { recurringService } from '../services/recurring.service';

export const useRecurring = () => {
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecurring = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await recurringService.getRecurring();
      setRecurring(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecurring();
  }, [fetchRecurring]);

  const addRecurring = async (recurringData) => {
    const newItem = await recurringService.createRecurring(recurringData);
    setRecurring(prev => [newItem, ...prev]);
    return newItem;
  };

  const editRecurring = async (id, recurringData) => {
    const updated = await recurringService.updateRecurring(id, recurringData);
    setRecurring(prev => prev.map(r => r.id === id ? updated : r));
    return updated;
  };

  const removeRecurring = async (id) => {
    await recurringService.deleteRecurring(id);
    setRecurring(prev => prev.filter(r => r.id !== id));
    return true;
  };

  return { recurring, loading, error, addRecurring, editRecurring, removeRecurring, refresh: fetchRecurring };
};
