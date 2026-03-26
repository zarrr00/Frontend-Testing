import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useMode } from "@/contexts/ModeContext";
import { Lightbulb, TrendingDown, AlertCircle, FileText, Download, Target, Receipt, Plus, X, Trophy, Sparkles } from "lucide-react";
import { umkmData, personalData, trendData, budgetData, topExpenses, formatIDR } from '../data/mockData';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DesktopInsights() {
  const { mode } = useMode(); 
  
  const isPersonal = mode === 'personal';
  const activeData = isPersonal ? personalData : umkmData;
  const themeColor = isPersonal ? 'text-purple-600' : 'text-blue-600';
  // Modifikasi sedikit themeBg agar tidak terlalu terang saat dark mode
  const themeBg = isPersonal ? 'bg-purple-100 dark:bg-purple-900/20' : 'bg-blue-100 dark:bg-blue-900/20';

  const totalExpense = activeData.reduce((acc, curr) => acc + curr.value, 0);

  // States for Budgets
  const [budgets, setBudgets] = useState(budgetData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [newBudgetLimit, setNewBudgetLimit] = useState('');

  const handleAddBudget = (e) => {
    e.preventDefault();
    const finalCategory = isCustomCategory ? customCategoryName : newBudgetCategory;
    if (!finalCategory || !newBudgetLimit) return;
    
    const newBudget = {
      category: finalCategory,
      spent: 0, 
      limit: parseInt(newBudgetLimit),
      color: "bg-indigo-500" 
    };

    setBudgets([...budgets, newBudget]);
    setIsModalOpen(false);
    setNewBudgetCategory('');
    setIsCustomCategory(false);
    setCustomCategoryName('');
    setNewBudgetLimit('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-10 space-y-8 animate-in fade-in zoom-in-95 duration-500 relative bg-background text-foreground transition-colors">
      {/* Header Halaman */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Insight Keuangan</h1>
          <p className="text-sm text-muted-foreground mt-1">Analisis mendalam seputar arus kasmu.</p>
        </div>
        {!isPersonal && (
          <button className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 border-none">
            <Download className="w-4 h-4" /> Export Laporan (PDF)
          </button>
        )}
      </header>

      {/* Grid Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri */}
        <div className="space-y-6 flex flex-col h-full">
          
          {/* Kartu Saran / Insight Cerdas */}
          <Card className={`${themeBg} border-none shadow-sm`}>
            <CardContent className="p-5 flex gap-4 items-start">
              <Lightbulb className={`w-6 h-6 shrink-0 mt-0.5 ${themeColor}`} />
              <div>
                <h3 className={`text-base font-bold ${themeColor} mb-2`}>Insight Cerdas</h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  Pengeluaran terbesarmu bulan ini ada di kategori <span className="font-bold">{activeData[0].name}</span>. 
                  {isPersonal ? " Coba kurangi jajan di luar untuk berhemat." : " Pastikan harga jual produkmu sudah menutupi modal ini."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Kartu Grafik Donut */}
          <Card className="bg-card border-border shadow-sm overflow-hidden flex flex-col flex-1 min-h-[350px]">
            <CardHeader className="pb-0 shrink-0">
              <CardTitle className="text-base">Distribusi Kategori</CardTitle>
              <CardDescription className="text-sm">Berdasarkan pengeluaran Rp{totalExpense/1000000} Juta</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex flex-col items-center flex-1 justify-center">
              <div className="h-[220px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {activeData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value) => formatIDR(value)}
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: '8px', fontSize: '13px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full px-6 pb-6 space-y-3 mt-4">
                {activeData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm font-medium text-muted-foreground">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold">{formatIDR(item.value)}</span>
                      <span className="text-xs text-muted-foreground font-bold w-8 text-right">
                        {Math.round((item.value / totalExpense) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gamification Card */}
          <Card className="border-none shadow-sm relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 shrink-0">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-400/20 rounded-full blur-2xl"></div>
            <CardContent className="p-5 flex flex-col gap-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Master Finansial</h3>
                    <p className="text-xs font-semibold text-amber-600 flex items-center gap-1">Level 4 <Sparkles className="w-3 h-3" /></p>
                  </div>
                </div>
                <div className="text-right text-muted-foreground">
                  <span className="text-xs font-bold text-foreground">850 XP</span>
                  <p className="text-[10px]">ke Level 5</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner flex">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">Hebat! Pengeluaranmu 15% lebih irit bulan ini (+50 XP). Terus pertahankan!</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Analisis Tren */}
            <Card className="bg-card border-border shadow-sm flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex justify-between items-center">
                  <span>Perbandingan Tren</span>
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-1 rounded-full">
                    <TrendingDown className="w-3.5 h-3.5" /> 15% Lebih Hemat
                  </div>
                </CardTitle>
                <CardDescription className="text-sm">Bulan ini vs Bulan lalu</CardDescription>
              </CardHeader>
              <CardContent className="p-5 flex-1 flex flex-col justify-center">
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'currentColor', fontSize: 12}} className="opacity-50" dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: 'currentColor', fontSize: 12}} className="opacity-50" dx={0} tickFormatter={(val) => `${val/1000000}M`} />
                      <RechartsTooltip cursor={{fill: 'currentColor', opacity: 0.1}} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: '8px', fontSize: '13px' }} />
                      <Bar dataKey="lastMonth" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Bulan Lalu" className="opacity-40" />
                      <Bar dataKey="thisMonth" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Bulan Ini" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Profit & Loss / Budgeting */}
            {!isPersonal ? (
              <Card className="bg-slate-900 text-white shadow-lg border-none relative overflow-hidden flex flex-col justify-between dark:bg-slate-950">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <CardHeader className="pb-4 relative z-10">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      Laporan Laba Rugi
                    </CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-400">Okt 2024</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-6 relative z-10 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-4 border-b border-slate-700/50 pb-5">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 font-bold">Pendapatan Kotor</p>
                      <p className="text-lg font-black text-emerald-400">{formatIDR(15500000)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 font-bold">Total Biaya</p>
                      <p className="text-lg font-black text-rose-400">{formatIDR(8200000)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Laba Bersih (Net Profit)</p>
                    <p className="text-4xl font-black text-white">{formatIDR(7300000)}</p>
                    <div className="inline-block bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full mt-4">Margin Laba: 47%</div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card border-border shadow-sm flex flex-col h-full">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="w-5 h-5 text-rose-500" />
                      Anggaran Kategori
                    </CardTitle>
                    <CardDescription className="text-sm">Pantau batas pengeluaranmu dari budget</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 gap-1 text-xs" onClick={() => setIsModalOpen(true)}>
                    <Plus className="w-3.5 h-3.5" /> Budget
                  </Button>
                </CardHeader>
                <CardContent className="p-5 space-y-6 overflow-y-auto max-h-[300px]">
                  {budgets.map((item, idx) => {
                    const isOver = item.spent > item.limit;
                    const pct = Math.min((item.spent / item.limit) * 100, 100);
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm font-bold">
                          <span>{item.category}</span>
                          <span className={isOver ? "text-rose-600" : "text-muted-foreground"}>
                            {formatIDR(item.spent)} <span className="opacity-40 font-normal">/ {formatIDR(item.limit)}</span>
                          </span>
                        </div>
                        <div className="w-full h-3 bg-muted rounded-full overflow-hidden shadow-inner flex shrink-0">
                          <div className={`h-full rounded-full transition-all ${isOver ? 'bg-rose-500' : item.color}`} style={{ width: `${pct}%` }}></div>
                        </div>
                        {isOver && (
                          <p className="text-xs font-bold text-rose-500 flex items-center gap-1.5 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Peringatan: Anggaran berlebih!
                          </p>
                        )}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top 5 Pengeluaran */}
            <Card className="bg-card border-border shadow-sm flex flex-col h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-muted-foreground" />
                  Top 5 Pengeluaran
                </CardTitle>
                <CardDescription className="text-sm">Pengeluaran terbesar bulan ini</CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3 flex-1">
                {topExpenses.map((trx, idx) => (
                  <div key={trx.id} className="bg-muted/50 border border-border p-4 rounded-xl shadow-sm flex items-center justify-between hover:bg-accent transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-card border border-border text-muted-foreground flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">{idx + 1}</div>
                      <div>
                        <p className="text-sm font-bold line-clamp-1">{trx.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{trx.date}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-rose-600 shrink-0">-{formatIDR(trx.amount)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Empty State / Tracker Placeholder */}
            {isPersonal ? (
               <Card className="border-dashed border-2 bg-transparent border-border flex flex-col items-center justify-center p-8 text-center h-full min-h-[250px] shadow-none">
                 <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                   <Target className="w-8 h-8 text-muted-foreground" />
                 </div>
                 <h3 className="text-sm font-bold text-foreground">Jaga Pengeluaran Anda</h3>
                 <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">Tetap berada dalam anggaran bulan ini untuk mencapai target tabungan liburan Anda.</p>
               </Card>
            ) : (
              <Card className="bg-card border-border shadow-sm flex flex-col h-full">
                <CardHeader className="pb-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-5 h-5 text-rose-500" />
                    Anggaran Kategori
                  </CardTitle>
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
                          <span>{item.category}</span>
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
          </div>
        </div>
      </div>

      {/* Modal / Dialog Tambah Anggaran */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md bg-card border-border shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="pb-4 border-b border-border flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Tambah Anggaran Baru</CardTitle>
                <CardDescription className="text-sm">Atur batas anggaran belanja untuk kategori tambahan.</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full -mr-2" onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleAddBudget} className="space-y-5">
                <div className="space-y-2.5">
                  <label className="text-sm font-bold">Pilih Kategori</label>
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
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="" disabled>-- Pilih Kategori --</option>
                    {isPersonal ? (
                      <>
                        <option value="Belanja Bulanan">Belanja Bulanan</option>
                        <option value="Kesehatan">Kesehatan</option>
                        <option value="Edukasi & Kursus">Edukasi & Kursus</option>
                        <option value="Investasi">Investasi</option>
                      </>
                    ) : (
                      <>
                        <option value="Gaji Karyawan">Gaji Karyawan</option>
                        <option value="Sewa Tempat">Sewa Tempat</option>
                        <option value="Inventaris Baru">Inventaris Baru</option>
                        <option value="Biaya Admin / Pajak">Biaya Admin / Pajak</option>
                      </>
                    )}
                    <option value="custom" className="font-bold text-blue-600">+ Kategori Custom Baru...</option>
                  </select>
                  {isCustomCategory && (
                    <div className="pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <Input 
                        type="text"
                        placeholder="Ketik nama kategori baru..." 
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
                  <label className="text-sm font-bold">Batas Anggaran (Rp)</label>
                  <Input 
                    type="number" 
                    placeholder="Misal: 500000" 
                    required 
                    value={newBudgetLimit}
                    onChange={(e) => setNewBudgetLimit(e.target.value)}
                    className="text-base py-2 h-10"
                  />
                </div>
                <Button type="submit" className="w-full mt-4 font-bold text-sm bg-blue-600 hover:bg-blue-700 h-10 border-none text-white">Simpan Anggaran</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}