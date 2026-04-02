import { useState, useEffect } from 'react';
import { dashboardService } from '../../../services/dashboard.service';
export function useDashboardData() {
  const [data, setData] = useState({
    summary: { total_income: 0, total_expense: 0, profit_loss: 0, balance: 0 },
    chartData: [],
    sparklineBalance: [],
    sparklineIncome: [],
    sparklineExpense: [],
    categoryData: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [summary, chart, recent, topCategories] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getChart(),
          dashboardService.getRecentTransactions(5),
          dashboardService.getTopCategories()
        ]);
        // Sparklines
        const sb = chart.map(c => ({ v: Number(c.profit_loss) }));
        const si = chart.map(c => ({ v: Number(c.income) }));
        const se = chart.map(c => ({ v: Number(c.expense) }));
        // Categories
        const totalCatSum = topCategories.reduce((sum, cat) => sum + Number(cat.total), 0);
        const catData = topCategories.map(cat => ({
          name: cat.name,
          value: totalCatSum > 0 ? Math.round((Number(cat.total) / totalCatSum) * 100) : 0,
          color: cat.color || '#cbd5e1'
        }));
        // Activities
        const recentData = recent.map(t => ({
          id: t.id,
          type: t.type,
          action: t.description,
          date: new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          status: 'Selesai'
        }));
        setData({
          summary,
          chartData: chart,
          sparklineBalance: sb.length > 0 ? sb : [{v:0}],
          sparklineIncome: si.length > 0 ? si : [{v:0}],
          sparklineExpense: se.length > 0 ? se : [{v:0}],
          categoryData: catData,
          recentActivity: recentData
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
        setError("Gagal memuat data dashboard.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  return { ...data, loading, error };
}
