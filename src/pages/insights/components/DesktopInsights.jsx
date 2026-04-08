import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import DistributionPieChart from "@/components/charts/DistributionPieChart";
import TrendBarChart from "@/components/charts/TrendBarChart";
import { useMode } from "@/contexts/ModeContext";
import { Lightbulb, TrendingDown, AlertCircle, FileText, Download, Target, Receipt, Plus, X, Trophy, Sparkles } from "lucide-react";
import { formatIDR } from '@/utils/currency';
import { useDashboardData } from "../../dashboard/hooks/useDashboardData";
import { useBudgets } from "@/hooks/useBudgets";
import { useCategories } from "@/hooks/useCategories";
import { reportService } from "@/services/report.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AnimatedContent from "@/components/ui/AnimatedContent";

/**
 * DesktopInsights Component
 * Provides detailed financial analysis, category distribution, and budget management for desktop users.
 * 
 * @returns {JSX.Element} The rendered Insights page.
 */
export default function DesktopInsights() {
  const { mode } = useMode(); 
  const { summary, chartData, categoryData, recentActivity, loading } = useDashboardData();
  const { budgets, addBudget, loading: budgetsLoading } = useBudgets();
  const { expenseCategories } = useCategories();
  
  const isPersonal = mode === 'personal';
  const themeColor = isPersonal ? 'text-purple-600' : 'text-blue-600';
  const themeBg = isPersonal ? 'bg-purple-100 dark:bg-purple-900/20' : 'bg-blue-100 dark:bg-blue-900/20';
  
  const activeData = categoryData.length > 0 ? categoryData : [{ name: 'No data', value: 100, color: '#cbd5e1' }];
  const totalExpense = summary.total_expense || 0;

  // Process trend data for the bar chart
  const trendData = chartData.map((curr, idx, arr) => {
    const prev = idx > 0 ? arr[idx - 1] : { expense: 0 };
    return {
      name: curr.month,
      lastMonth: Number(prev.expense),
      thisMonth: Number(curr.expense)
    };
  });

  // Get recent expenses
  const topExpenses = recentActivity.filter(t => t.type === 'expense').slice(0, 5);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [newBudgetLimit, setNewBudgetLimit] = useState('');

  /**
   * Translates internal category names to display names.
   * @param {string} catName - The internal category name.
   * @returns {string} The translated display name.
   */
  const getTranslatedCategory = (catName) => {
    const translations = {
      'Operasional': 'Operasional',
      'Bahan Baku': 'Bahan Baku',
      'Penjualan': 'Penjualan',
      'Modal': 'Modal',
      'Lain-lain': 'Lain-lain',
      'Pemasaran': 'Pemasaran',
      'Gaji Pokok': 'Gaji Pokok',
      'Tagihan': 'Tagihan',
      'Sewa': 'Sewa'
    };
    return translations[catName] || catName;
  };

  /**
   * Handles adding a new budget category.
   * @param {Event} e - Form submission event.
   */
  const handleAddBudget = async (e) => {
    e.preventDefault();
    const finalCategory = isCustomCategory ? customCategoryName : newBudgetCategory;
    if (!finalCategory || !newBudgetLimit) return;
    
    const now = new Date();
    try {
      await addBudget({
        category_id: isCustomCategory ? null : finalCategory,
        amount: parseInt(newBudgetLimit),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });
      toast.success('Anggaran berhasil ditambahkan!');
    } catch (err) {
      toast.error(err.toString());
    }

    setIsModalOpen(false);
    setNewBudgetCategory('');
    setIsCustomCategory(false);
    setCustomCategoryName('');
    setNewBudgetLimit('');
  };

  /**
   * Handles PDF report generation and download.
   */
  const handleExportPDF = async () => {
    try {
      toast.loading("Generating PDF report...", { id: "export_pdf" });
      await reportService.downloadPDF();
      toast.success("PDF report downloaded successfully!", { id: "export_pdf" });
    } catch (err) {
      toast.error(err.toString(), { id: "export_pdf" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-10 space-y-8 animate-in fade-in zoom-in-95 duration-500 relative bg-background text-foreground transition-colors" id="snap-main-container">
      <AnimatedContent distance={30} delay={0.1} direction="vertical">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Insight</h1>
            <p className="text-sm text-muted-foreground mt-1">Deep analysis of your cash flow.</p>
          </div>
          {!isPersonal && (
            <button 
              onClick={handleExportPDF} 
              className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 border-none cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          )}
        </header>
      </AnimatedContent>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 flex flex-col h-full">
          <AnimatedContent distance={40} delay={0.2} direction="vertical">
            <Card className={`${themeBg} border-none shadow-sm`}>
              <CardContent className="p-5 flex gap-4 items-start">
                <Lightbulb className={`w-6 h-6 shrink-0 mt-0.5 ${themeColor}`} />
                <div>
                  <h3 className={`text-base font-bold ${themeColor} mb-2`}>Smart Insight</h3>
                  <p className="text-sm opacity-90 leading-relaxed text-foreground">
                    Your highest expense this month is in the <span className="font-bold">{getTranslatedCategory(activeData[0].name)}</span> category. 
                    {isPersonal 
                      ? " Try reducing outside dining to save more." 
                      : " Ensure your product pricing covers these costs."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </AnimatedContent>

          <AnimatedContent distance={40} delay={0.3} direction="vertical" className="flex flex-col flex-1 min-h-[350px]">
            <Card className="bg-card border-border shadow-sm overflow-hidden flex flex-col h-full w-full text-foreground">
              <CardHeader className="pb-0 shrink-0">
                <CardTitle className="text-base">Category Distribution</CardTitle>
                <CardDescription className="text-sm">Based on {formatIDR(totalExpense)} total expenses</CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex flex-col items-center flex-1 justify-center">
                <div className="h-[220px] w-full mt-4">
                  <DistributionPieChart data={activeData} />
                </div>
                <div className="w-full px-6 pb-6 space-y-3 mt-4">
                  {activeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm font-medium text-muted-foreground">{getTranslatedCategory(item.name)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold">{item.value}%</span>
                        <span className="text-xs text-muted-foreground font-bold w-12 text-right">
                          {item.value}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedContent>

          <AnimatedContent distance={40} delay={0.4} direction="vertical" className="shrink-0">
            <Card className="border-none shadow-sm relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 w-full text-foreground">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-400/20 rounded-full blur-2xl"></div>
              <CardContent className="p-5 flex flex-col gap-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">Financial Master</h3>
                      <p className="text-xs font-semibold text-amber-600 flex items-center gap-1">Level 4 <Sparkles className="w-3 h-3" /></p>
                    </div>
                  </div>
                  <div className="text-right text-muted-foreground">
                    <span className="text-xs font-bold text-foreground">850 XP</span>
                    <p className="text-[10px]">to Level 5</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner flex">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">Great job! Your expenses are 15% lower this month (+50 XP). Keep it up!</p>
                </div>
              </CardContent>
            </Card>
          </AnimatedContent>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedContent distance={40} delay={0.5} direction="vertical" className="flex flex-col h-full">
              <Card className="bg-card border-border shadow-sm flex flex-col h-full w-full text-foreground">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex justify-between items-center">
                    <span>Cash Flow Trend</span>
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-1 rounded-full">
                      <TrendingDown className="w-3.5 h-3.5" /> 15% More Efficient
                    </div>
                  </CardTitle>
                  <CardDescription className="text-sm">This month vs Last month</CardDescription>
                </CardHeader>
                <CardContent className="p-5 flex-1 flex flex-col justify-center">
                  <div className="h-[220px] w-full">
                      <TrendBarChart data={trendData} />
                  </div>
                </CardContent>
              </Card>
            </AnimatedContent>

            <AnimatedContent distance={40} delay={0.6} direction="vertical" className="flex flex-col h-full">
              {!isPersonal ? (
                <Card className="bg-slate-900 text-white shadow-lg border-none relative overflow-hidden flex flex-col justify-between h-full w-full dark:bg-slate-950">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                  <CardHeader className="pb-4 relative z-10">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" /> Monthly Report
                      </CardTitle>
                      <CardDescription className="text-xs font-medium text-slate-400">
                        {new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-6 relative z-10 flex-1 flex flex-col justify-between">
                    <div className="grid grid-cols-2 gap-4 border-b border-slate-700/50 pb-5">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 font-bold">INCOME</p>
                        <p className="text-lg font-black text-emerald-400">{formatIDR(summary.total_income)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 font-bold">EXPENSE</p>
                        <p className="text-lg font-black text-rose-400">{formatIDR(summary.total_expense)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Net Profit</p>
                      <p className="text-4xl font-black text-white">{formatIDR(summary.profit_loss)}</p>
                      <div className="inline-block bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full mt-4">Real-Time Statistics</div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-card border-border shadow-sm flex flex-col h-full w-full text-foreground">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="w-5 h-5 text-rose-500" /> Category Budget
                      </CardTitle>
                      <CardDescription className="text-sm">Monitor your spending against limits.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 gap-1 text-xs" onClick={() => setIsModalOpen(true)}>
                      <Plus className="w-3.5 h-3.5" /> Budget
                    </Button>
                  </CardHeader>
                  <CardContent className="p-5 space-y-6 overflow-y-auto max-h-[300px]">
                    {budgets.map((item, idx) => {
                      const spent = Number(item.spent || 0);
                      const limit = Number(item.amount || item.limit || 0);
                      const isOver = spent > limit;
                      const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
                      const catName = item.categories?.name || item.category || 'Lain-lain';
                      return (
                        <div key={item.id || idx} className="space-y-2">
                          <div className="flex justify-between text-sm font-bold">
                            <span>{getTranslatedCategory(catName)}</span>
                            <span className={isOver ? "text-rose-600" : "text-muted-foreground"}>
                              {formatIDR(spent)} <span className="opacity-40 font-normal">/ {formatIDR(limit)}</span>
                            </span>
                          </div>
                          <div className="w-full h-3 bg-muted rounded-full overflow-hidden shadow-inner flex shrink-0">
                            <div className={`h-full rounded-full transition-all ${isOver ? 'bg-rose-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }}></div>
                          </div>
                          {isOver && (
                            <p className="text-xs font-bold text-rose-500 flex items-center gap-1.5 mt-1">
                              <AlertCircle className="w-3.5 h-3.5" /> Warning: Budget exceeded!
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )}
            </AnimatedContent>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatedContent distance={40} delay={0.7} direction="vertical" className="flex flex-col h-full">
              <Card className="bg-card border-border shadow-sm flex flex-col w-full h-full text-foreground">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-muted-foreground" /> Top 5 Expenses
                  </CardTitle>
                  <CardDescription className="text-sm">Highest spending this month</CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-3 flex-1">
                  {topExpenses.map((trx, idx) => (
                    <div key={trx.id} className="bg-muted/50 border border-border p-4 rounded-xl shadow-sm flex items-center justify-between hover:bg-accent transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-card border border-border text-muted-foreground flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">{idx + 1}</div>
                        <div>
                          <p className="text-sm font-bold line-clamp-1">{getTranslatedCategory(trx.action || trx.name)}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{trx.date}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-rose-600 shrink-0">-{trx.amount}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </AnimatedContent>

            <AnimatedContent distance={40} delay={0.8} direction="vertical" className="flex flex-col h-full">
              {isPersonal ? (
                  <Card className="border-dashed border-2 bg-transparent border-border flex flex-col items-center justify-center p-8 text-center h-full min-h-[250px] shadow-none w-full text-foreground">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Target className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-sm font-bold">Watch Your Spending</h3>
                    <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">Stay within budget this month to reach your savings goals.</p>
                  </Card>
              ) : (
                <Card className="bg-card border-border shadow-sm flex flex-col h-full w-full text-foreground">
                  <CardHeader className="pb-4 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="w-5 h-5 text-rose-500" /> Category Budget
                      </CardTitle>
                      <CardDescription className="text-sm">Monitor your category limits.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 gap-1 text-xs" onClick={() => setIsModalOpen(true)}>
                      <Plus className="w-3.5 h-3.5" /> Budget
                    </Button>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-6 flex-1 overflow-y-auto max-h-[300px]">
                    {budgets.map((item, idx) => {
                      const isOver = item.spent > item.limit;
                      const pct = Math.min((item.spent / item.limit) * 100, 100);
                      return (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between text-sm font-bold">
                            <span>{getTranslatedCategory(item.category)}</span>
                            <span className={isOver ? "text-rose-600" : "text-muted-foreground"}>
                              {formatIDR(item.spent)} <span className="opacity-40 font-normal">/ {formatIDR(item.limit)}</span>
                            </span>
                          </div>
                          <div className="w-full h-3 bg-muted rounded-full overflow-hidden shadow-inner flex shrink-0">
                            <div className={`h-full rounded-full transition-all ${isOver ? 'bg-rose-500' : item.color}`} style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )}
            </AnimatedContent>
          </div>
        </div>
      </div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md bg-card border-border shadow-2xl animate-in zoom-in-95 duration-200 text-foreground">
            <CardHeader className="pb-4 border-b border-border flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Add New Budget</CardTitle>
                <CardDescription className="text-sm">Set a spending limit for an additional category.</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full -mr-2" onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleAddBudget} className="space-y-5">
                <div className="space-y-2.5">
                  <label className="text-sm font-bold">Select Category</label>
                  <select 
                    value={isCustomCategory ? 'custom' : newBudgetCategory}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setIsCustomCategory(true);
                      } else {
                        setIsCustomCategory(false);
                        setNewBudgetCategory(e.target.value);
                      }
                    }}
                    required={!isCustomCategory}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="" disabled>-- Select Category --</option>
                    {expenseCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                    <option value="custom" className="font-bold text-blue-600">+ Add Custom Category...</option>
                  </select>
                  {isCustomCategory && (
                    <div className="pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <Input 
                        type="text"
                        placeholder="Enter new category name..." 
                        required 
                        value={customCategoryName}
                        onChange={(e) => setCustomCategoryName(e.target.value)}
                        className="h-10 text-sm"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2.5">
                  <label className="text-sm font-bold">Amount (Rp)</label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 500000" 
                    required 
                    value={newBudgetLimit}
                    onChange={(e) => setNewBudgetLimit(e.target.value)}
                    className="text-base py-2 h-10 text-foreground"
                  />
                </div>
                <Button type="submit" className="w-full mt-4 font-bold text-sm bg-blue-600 hover:bg-blue-700 h-10 border-none text-white">Save Budget</Button>
              </form>
            </CardContent>
          </Card>
        </div>, document.body
      )}
    </div>
  );
}