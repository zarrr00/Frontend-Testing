import { useState, useEffect, useCallback } from 'react';
import { goalService } from '../services/goal.service';

export const useGoals = (initialParams = {}) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await goalService.getGoals(params);
      setGoals(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = async (goalData) => {
    try {
      const newGoal = await goalService.createGoal(goalData);
      setGoals(prev => [newGoal, ...prev]);
      return newGoal;
    } catch (err) {
      throw err;
    }
  };

  const editGoal = async (id, goalData) => {
    try {
      const updated = await goalService.updateGoal(id, goalData);
      setGoals(prev => prev.map(g => g.id === id ? updated : g));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const removeGoal = async (id) => {
    try {
      await goalService.deleteGoal(id);
      setGoals(prev => prev.filter(g => g.id !== id));
      return true;
    } catch (err) {
      throw err;
    }
  };

  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  return {
    goals,
    loading,
    error,
    addGoal,
    editGoal,
    removeGoal,
    refresh: fetchGoals,
    updateParams,
  };
};
