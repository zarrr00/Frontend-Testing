import { useState, useEffect, useCallback } from 'react';
import { debtService } from '../services/debt.service';

export const useDebts = (initialParams = {}) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchDebts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await debtService.getDebts(params);
      setDebts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

  const addDebt = async (debtData) => {
    try {
      const newDebt = await debtService.createDebt(debtData);
      setDebts(prev => [newDebt, ...prev]);
      return newDebt;
    } catch (err) {
      throw err;
    }
  };

  const editDebt = async (id, debtData) => {
    try {
      const updated = await debtService.updateDebt(id, debtData);
      setDebts(prev => prev.map(d => d.id === id ? updated : d));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const payDebt = async (id, amount) => {
    try {
      const updated = await debtService.payDebt(id, amount);
      setDebts(prev => prev.map(d => d.id === id ? updated : d));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const removeDebt = async (id) => {
    try {
      await debtService.deleteDebt(id);
      setDebts(prev => prev.filter(d => d.id !== id));
      return true;
    } catch (err) {
      throw err;
    }
  };

  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  return {
    debts,
    loading,
    error,
    addDebt,
    editDebt,
    payDebt,
    removeDebt,
    refresh: fetchDebts,
    updateParams,
  };
};
