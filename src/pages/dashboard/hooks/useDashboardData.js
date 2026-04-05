import { useState, useEffect } from 'react';
import { dashboardService } from '@/services/dashboard.service';

/**
 * Aggregates data from multiple dashboard API calls into a single state object.
 * Computes derived metrics (health score, percentage changes) from real data.
 *
 * @returns {Object} Dashboard state with computed analytics.
 */
export function useDashboardData() {
  const [summary, setSummary] = useState({ balance: 0, total_income: 0, total_expense: 0, profit_loss: 0 });
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sparklineBalance, setSparklineBalance] = useState([{ v: 0 }]);
  const [sparklineIncome, setSparklineIncome] = useState([{ v: 0 }]);
  const [sparklineExpense, setSparklineExpense] = useState([{ v: 0 }]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, chartResult, recentResult, categoryResult] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getChart(),
          dashboardService.getRecentTransactions(5),
          dashboardService.getTopCategories(),
        ]);

        if (summaryData) setSummary(summaryData);
        if (Array.isArray(chartResult)) {
          setChartData(chartResult);
          if (chartResult.length > 0) {
            setSparklineBalance(chartResult.map(d => ({ v: d.profit_loss })));
            setSparklineIncome(chartResult.map(d => ({ v: d.income })));
            setSparklineExpense(chartResult.map(d => ({ v: d.expense })));
          }
        }
        if (Array.isArray(recentResult)) setRecentActivity(recentResult);
        if (Array.isArray(categoryResult)) {
          const totalSum = categoryResult.reduce((acc, cat) => acc + (cat.total || 0), 0);
          setCategoryData(categoryResult.map(cat => ({
            ...cat,
            value: totalSum > 0 ? Math.round((cat.total / totalSum) * 100) : 0
          })));
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute percentage changes from chart data (current month vs previous)
  const computeChanges = () => {
    if (chartData.length < 2) return { incomeChange: 0, expenseChange: 0, balanceChange: 0 };

    const current = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];

    const calcPct = (curr, prev) => {
      if (!prev || prev === 0) return curr > 0 ? 100 : 0;
      return ((curr - prev) / prev * 100).toFixed(1);
    };

    return {
      incomeChange: Number(calcPct(current.income, previous.income)),
      expenseChange: Number(calcPct(current.expense, previous.expense)),
      balanceChange: Number(calcPct(
        current.income - current.expense,
        previous.income - previous.expense
      )),
    };
  };

  // Compute financial health score (0-100) based on savings ratio
  const computeHealthScore = () => {
    const { total_income, total_expense } = summary;
    if (total_income === 0 && total_expense === 0) return 50; // Neutral when no data
    if (total_income === 0) return 10; // Critical — spending without income
    const savingsRatio = (total_income - total_expense) / total_income;
    // Map savings ratio to 0-100 score: -50% → 0, 0% → 50, 50%+ → 100
    return Math.max(0, Math.min(100, Math.round((savingsRatio + 0.5) * 100)));
  };

  const { incomeChange, expenseChange, balanceChange } = computeChanges();
  const healthScore = computeHealthScore();

  // Health label based on score
  const healthLabel = healthScore >= 75 ? 'Sangat Sehat' :
                      healthScore >= 50 ? 'Cukup Sehat' :
                      healthScore >= 25 ? 'Waspada' : 'Kritis';

  return {
    summary,
    chartData,
    sparklineBalance,
    sparklineIncome,
    sparklineExpense,
    categoryData,
    recentActivity,
    loading,
    // Computed analytics
    incomeChange,
    expenseChange,
    balanceChange,
    healthScore,
    healthLabel,
  };
}
