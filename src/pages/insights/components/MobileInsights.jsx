import React, { useState } from 'react';
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
import BorderGlow from "@/components/ui/BorderGlow";

const GLOW = {
  edgeSensitivity: 30,
  glowColor: '40 80 80',
  backgroundColor: '#060010',
  borderRadius: 20,
  glowRadius: 80,
  glowIntensity: 3,
  coneSpread: 45,
  animated: false,
  colors: ['#c084fc', '#f472b6', '#38bdf8'],
};

export default function MobileInsights() {
  const { mode } = useMode(); 
  const { summary, chartData, categoryData, recentActivity, loading } = useDashboardData();
  const isPersonal = mode === 'personal';
  const activeData = categoryData.length > 0 ? categoryData : [{ name: 'Belum ada data', value: 100, color: '#cbd5e1' }];
  const totalExpense = summary.total_expense || 0;
  // Trend Data
  const trendData = chartData.map((curr, idx, arr) => {
    const prev = idx > 0 ? arr[idx - 1] : { expense: 0 };
    return {
      name: curr.month,
      lastMonth: Number(prev.expense),
      thisMonth: Number(curr.expense)
    };
  });
  // Top Expenses
  const topExpenses = recentActivity.filter(t => t.type === 'expense').slice(0, 5);
  // Budget States
  const { budgets, addBudget } = useBudgets();
  const { expenseCategories } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [newBudgetLimit, setNewBudgetLimit] = useState('');
  // Category Translator
  const getTranslatedCategory = (catName) => {
    if (catName === 'Operasional') return "Operasional";
    if (catName === 'Bahan Baku') return "Bahan Baku";
    if (catName === 'Penjualan') return "Penjualan";
    if (catName === 'Modal') return "Modal";
    if (catName === 'Lain-lain') return "Lain-lain";
    if (catName === 'Pemasaran') return "Pemasaran";
    if (catName === 'Gaji Pokok') return "Gaji Pokok";
    if (catName === 'Tagihan') return "Tagihan";
    if (catName === 'Sewa') return "Sewa";
    return catName;
  };
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
  const handleExportPDF = async () => {
    try {
      toast.loading("Membuat laporan PDF...", { id: "export_pdf" });
      await reportService.downloadPDF();
      toast.success("Laporan PDF berhasil diunduh!", { id: "export_pdf" });
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
      {/* Header Halaman */}
      <AnimatedContent distance={30} delay={0.1} direction="vertical">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {"Insight"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {"Analisis mendalam seputar arus kasmu."}
            </p>
          </div>
          {!isPersonal && (
            <button onClick={handleExportPDF} className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 border-none cursor-pointer">
              <Download className="w-4 h-4" /> {"Unduh PDF"}
            </button>
          )}
        </header>
      </AnimatedContent>
      {/* Grid Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri */}
        <div className="space-y-6 flex flex-col h-full">
          {/* Insight Card */}
          <AnimatedContent distance={40} delay={0.2} direction="vertical">
            <BorderGlow {...GLOW} colors={isPersonal ? ['#a855f7', '#c084fc', '#e879f9'] : ['#3b82f6', '#6366f1', '#38bdf8']}>
              <div className="p-5 flex gap-4 items-start">
                <Lightbulb className={`w-6 h-6 shrink-0 mt-0.5 ${isPersonal ? 'text-purple-400' : 'text-blue-400'}`} />
                <div>
                  <h3 className={`text-base font-bold ${isPersonal ? 'text-purple-400' : 'text-blue-400'} mb-2`}>{"Insight Cerdas"}</h3>
                  <p className="text-sm opacity-90 leading-relaxed text-slate-300">
                    {"Pengeluaran terbesarmu bulan ini ada di kategori"} <span className="font-bold text-white">{getTranslatedCategory(activeData[0].name)}</span>. 
                    {isPersonal ? ` ${"Coba kurangi jajan di luar untuk berhemat."}` : ` ${"Pastikan harga jual produkmu sudah menutupi modal ini."}`}
                  </p>
                </div>
              </div>
            </BorderGlow>
          </AnimatedContent>
          {/* Donut Chart */}
          <AnimatedContent distance={40} delay={0.3} direction="vertical" className="flex flex-col flex-1 min-h-[350px]">
            <BorderGlow {...GLOW} className="flex-1">
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-base font-bold">{"Distribusi Kategori"}</h3>
                <p className="text-sm text-slate-400 mt-1">
                  {"Berdasarkan pengeluaran"} Rp{(totalExpense/1000000).toFixed(1)} Juta
                </p>
                <div className="h-[220px] w-full mt-4">
                  <DistributionPieChart data={activeData} />
                </div>
                <div className="w-full space-y-3 mt-4">
                  {activeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm font-medium text-slate-400">{getTranslatedCategory(item.name)}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold">{formatIDR(item.value)}</span>
                        <span className="text-xs text-slate-500 font-bold w-12 text-right">
                          {Math.round((item.value / totalExpense) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </BorderGlow>
          </AnimatedContent>
          {/* Gamification Card */}
          <AnimatedContent distance={40} delay={0.4} direction="vertical" className="shrink-0">
            <BorderGlow {...GLOW} colors={['#f59e0b', '#f97316', '#fbbf24']}>
              <div className="p-5 flex flex-col gap-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">{"Master Finansial"}</h3>
                      <p className="text-xs font-semibold text-amber-400 flex items-center gap-1">Level 4 <Sparkles className="w-3 h-3" /></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold">850 XP</span>
                    <p className="text-[10px] text-slate-400">{"ke Level 5"}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden shadow-inner flex">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{"Hebat! Pengeluaranmu 15% lebih irit bulan ini (+50 XP). Terus pertahankan!"}</p>
                </div>
              </div>
            </BorderGlow>
          </AnimatedContent>
        </div>
        {/* Kolom Kanan */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trend Chart */}
            <AnimatedContent distance={40} delay={0.5} direction="vertical" className="flex flex-col h-full">
              <BorderGlow {...GLOW} className="flex-1">
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-base font-bold">{"Tren Arus Kas"}</h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      <TrendingDown className="w-3.5 h-3.5" /> 15% {"Lebih Hemat"}
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">{"Bulan ini vs Bulan lalu"}</p>
                  <div className="h-[220px] w-full flex-1">
                    <TrendBarChart data={trendData} />
                  </div>
                </div>
              </BorderGlow>
            </AnimatedContent>
            {/* Monthly Report Card */}
            <AnimatedContent distance={40} delay={0.6} direction="vertical" className="flex flex-col h-full">
              <BorderGlow {...GLOW} colors={['#3b82f6', '#6366f1', '#8b5cf6']} className="flex-1">
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      {"Laporan Bulanan"}
                    </h3>
                    <span className="text-xs font-medium text-slate-400">
                      {new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-5">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 font-bold">{"Pemasukan"}</p>
                      <p className="text-lg font-black text-emerald-400">{formatIDR(summary.total_income)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 font-bold">{"Pengeluaran"}</p>
                      <p className="text-lg font-black text-rose-400">{formatIDR(summary.total_expense)}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">{"Laba Bersih"}</p>
                    <p className="text-4xl font-black">{formatIDR(summary.profit_loss)}</p>
                    <div className="inline-block bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full mt-4">Statistik Real-Time</div>
                  </div>
                </div>
              </BorderGlow>
            </AnimatedContent>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Expenses */}
            <AnimatedContent distance={40} delay={0.7} direction="vertical" className="flex flex-col h-full">
              <BorderGlow {...GLOW} className="flex-1">
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-1">
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-slate-400" />
                      {"Top 5 Pengeluaran"}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">{"Pengeluaran terbesar bulan ini"}</p>
                  </div>
                  <div className="space-y-3 mt-4 flex-1">
                    {topExpenses.map((trx, idx) => (
                      <div key={trx.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center text-sm font-bold shrink-0">{idx + 1}</div>
                          <div>
                            <p className="text-sm font-bold line-clamp-1">{getTranslatedCategory(trx.action || trx.name)}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{trx.date}</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-rose-400 shrink-0">-{trx.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </BorderGlow>
            </AnimatedContent>
            {/* Tracker */}
            <AnimatedContent distance={40} delay={0.8} direction="vertical" className="flex flex-col h-full">
              <BorderGlow {...GLOW} className="flex-1">
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold flex items-center gap-2">
                        <Target className="w-5 h-5 text-rose-500" />
                        {"Anggaran Kategori"}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1">{"Pantau batas pengeluaranmu dari budget"}</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 gap-1 text-xs border-white/20 hover:bg-white/10" onClick={() => setIsModalOpen(true)}>
                      <Plus className="w-3.5 h-3.5" /> Budget
                    </Button>
                  </div>
                  <div className="space-y-6 overflow-y-auto max-h-[300px] flex-1">
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
                            <span className={isOver ? "text-rose-400" : "text-slate-400"}>
                              {formatIDR(spent)} <span className="opacity-40 font-normal">/ {formatIDR(limit)}</span>
                            </span>
                          </div>
                          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden shadow-inner flex shrink-0">
                            <div className={`h-full rounded-full transition-all ${isOver ? 'bg-rose-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }}></div>
                          </div>
                          {isOver && (
                            <p className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mt-1">
                              <AlertCircle className="w-3.5 h-3.5" /> {"Peringatan: Anggaran berlebih!"}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </BorderGlow>
            </AnimatedContent>
          </div>
        </div>
      </div>
      {/* Add Budget Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md bg-card border-border shadow-2xl animate-in zoom-in-95 duration-200 text-foreground">
            <CardHeader className="pb-4 border-b border-border flex flex-row items-center justify-between text-foreground">
              <div>
                <CardTitle className="text-lg">{"Tambah Anggaran Baru"}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{"Atur batas anggaran belanja untuk kategori tambahan."}</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full -mr-2 text-muted-foreground" onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleAddBudget} className="space-y-5">
                <div className="space-y-2.5">
                  <label className="text-sm font-bold text-foreground">{"Pilih Kategori"}</label>
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
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                  >
                    <option value="" disabled>-- {"Pilih Kategori"} --</option>
                    {expenseCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                    <option value="custom" className="font-bold text-blue-600">+ {"Kategori Custom Baru..."}</option>
                  </select>
                  {isCustomCategory && (
                    <div className="pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <Input 
                        type="text"
                        placeholder="Ketik nama kategori baru..." 
                        required 
                        value={customCategoryName}
                        onChange={(e) => setCustomCategoryName(e.target.value)}
                        className="h-10 text-sm text-foreground"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2.5">
                  <label className="text-sm font-bold text-foreground">{"Nominal"} (Rp)</label>
                  <Input 
                    type="number" 
                    placeholder="Misal: 500000" 
                    required 
                    value={newBudgetLimit}
                    onChange={(e) => setNewBudgetLimit(e.target.value)}
                    className="text-base py-2 h-10 text-foreground"
                  />
                </div>
                <Button type="submit" className="w-full mt-4 font-bold text-sm bg-blue-600 hover:bg-blue-700 h-10 border-none text-white transition-colors">{"Simpan Transaksi"}</Button>
              </form>
            </CardContent>
          </Card>
        </div>, document.body
      )}
    </div>
  );
}