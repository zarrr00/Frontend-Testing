import { useState, useEffect, useCallback } from 'react';
import { transactionService } from '../services/transaction.service';

export const useTransactions = (initialParams = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await transactionService.getTransactions(params);
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (transactionData) => {
    try {
      const newTransaction = await transactionService.createTransaction(transactionData);
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      throw err;
    }
  };

  const editTransaction = async (id, transactionData) => {
    try {
      const updatedTransaction = await transactionService.updateTransaction(id, transactionData);
      setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
      return updatedTransaction;
    } catch (err) {
      throw err;
    }
  };

  const removeTransaction = async (id) => {
    try {
      await transactionService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      return true;
    } catch (err) {
      throw err;
    }
  };
  
  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  return {
    transactions,
    loading,
    error,
    addTransaction,
    editTransaction,
    removeTransaction,
    refresh: fetchTransactions,
    updateParams
  };
};
