import { useState, useEffect, useCallback } from 'react';
import { debtService } from '../services/debt.service';

export const useDebts = () => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDebts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await debtService.getDebts();
      setDebts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

  const addDebt = async (debtData) => {
    const newDebt = await debtService.createDebt(debtData);
    setDebts(prev => [newDebt, ...prev]);
    return newDebt;
  };

  const editDebt = async (id, debtData) => {
    const updated = await debtService.updateDebt(id, debtData);
    setDebts(prev => prev.map(d => d.id === id ? updated : d));
    return updated;
  };

  const payDebt = async (id, amount) => {
    const updated = await debtService.payDebt(id, amount);
    setDebts(prev => prev.map(d => d.id === id ? updated : d));
    return updated;
  };

  const removeDebt = async (id) => {
    await debtService.deleteDebt(id);
    setDebts(prev => prev.filter(d => d.id !== id));
    return true;
  };

  return { debts, loading, error, addDebt, editDebt, payDebt, removeDebt, refresh: fetchDebts };
};
