import { useState, useEffect, useCallback } from 'react';
import { goalService } from '../services/goal.service';

export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await goalService.getGoals();
      setGoals(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = async (goalData) => {
    const newGoal = await goalService.createGoal(goalData);
    setGoals(prev => [newGoal, ...prev]);
    return newGoal;
  };

  const editGoal = async (id, goalData) => {
    const updated = await goalService.updateGoal(id, goalData);
    setGoals(prev => prev.map(g => g.id === id ? updated : g));
    return updated;
  };

  const removeGoal = async (id) => {
    await goalService.deleteGoal(id);
    setGoals(prev => prev.filter(g => g.id !== id));
    return true;
  };

  return { goals, loading, error, addGoal, editGoal, removeGoal, refresh: fetchGoals };
};
