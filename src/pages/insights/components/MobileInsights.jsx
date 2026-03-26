import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useMode } from "@/contexts/ModeContext";
import { Lightbulb, TrendingDown, AlertCircle, FileText, Download, Target, Receipt, Plus, X } from "lucide-react";
import { umkmData, personalData, trendData, budgetData, topExpenses, formatIDR } from '../data/mockData';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MobileInsights() {
  const { mode } = useMode(); 
  
  const isPersonal = mode === 'personal';
  const activeData = isPersonal ? personalData : umkmData;
  const themeColor = isPersonal ? 'text-purple-600' : 'text-blue-600';
  const themeBg = isPersonal ? 'bg-purple-100' : 'bg-blue-100';

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
    
    // Create new budget object
    const newBudget = {
      category: finalCategory,
      spent: 0, // Initially 0 spent
      limit: parseInt(newBudgetLimit),
      color: "bg-indigo-500" // A designated color for new custom budgets
    };

    setBudgets([...budgets, newBudget]);
    setIsModalOpen(false);
    setNewBudgetCategory('');
    setIsCustomCategory(false);
    setCustomCategoryName('');
    setNewBudgetLimit('');
  };

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto w-full space-y-6 animate-in fade-in zoom-in-95 duration-300 pb-28 relative">
      
      {/* Header Halaman */}
      <header>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Insight Keuangan</h1>
        <p className="text-xs text-slate-500 mt-0.5">Analisis mendalam seputar arus kasmu.</p>
      </header>

      {/* Kartu Saran / Insight Cerdas */}
      <Card className={`${themeBg} border-none shadow-sm`}>
        <CardContent className="p-4 flex gap-3 items-start">
          <Lightbulb className={`w-5 h-5 shrink-0 mt-0.5 ${themeColor}`} />
          <div>
            <h3 className={`text-sm font-bold ${themeColor} mb-1`}>Insight Cerdas</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Pengeluaran terbesarmu bulan ini ada di kategori <span className="font-bold">{activeData[0].name}</span>. 
              {isPersonal ? " Coba kurangi jajan di luar untuk berhemat." : " Pastikan harga jual produkmu sudah menutupi modal ini."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* IDEA 1: Analisis Tren & Perbandingan */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex justify-between items-center">
            <span>Perbandingan Pengeluaran</span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
              <TrendingDown className="w-3 h-3" /> 15% Lebih Hemat
            </div>
          </CardTitle>
          <CardDescription className="text-xs">Bulan ini vs Bulan lalu</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dx={-5} tickFormatter={(val) => `${val/1000000}M`} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                <Bar dataKey="lastMonth" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Bulan Lalu" />
                <Bar dataKey="thisMonth" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Bulan Ini" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* IDEA 2: Smart Budgeting Trackers */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-500" />
              Anggaran Kategori
            </CardTitle>
            <CardDescription className="text-xs">Pantau batas pengeluaran dari budget</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1 text-xs" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-3.5 h-3.5" /> Budget
          </Button>
        </CardHeader>
        <CardContent className="p-4 space-y-5">
          {budgets.map((item, idx) => {
            const isOver = item.spent > item.limit;
            const pct = Math.min((item.spent / item.limit) * 100, 100);
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{item.category}</span>
                  <span className={isOver ? "text-rose-600" : "text-slate-600"}>
                    {formatIDR(item.spent)} <span className="text-slate-400 font-normal">/ {formatIDR(item.limit)}</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner flex shrink-0">
                  <div className={`h-full rounded-full transition-all ${isOver ? 'bg-rose-500' : item.color}`} style={{ width: `${pct}%` }}></div>
                </div>
                {isOver && (
                  <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> Peringatan: Anggaran berlebih!
                  </p>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Kartu Grafik Donut (Eksisting) */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm">Distribusi Kategori</CardTitle>
          <CardDescription className="text-xs">Berdasarkan pengeluaran Rp{totalExpense/1000000} Juta</CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex flex-col items-center">
          <div className="h-[200px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {activeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatIDR(value)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full px-5 pb-5 space-y-2">
            {activeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-medium text-slate-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-900">{formatIDR(item.value)}</span>
                  <span className="text-[10px] text-slate-400 font-bold w-6 text-right">
                    {Math.round((item.value / totalExpense) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* IDEA 1 Part 2: Top 5 Pengeluaran */}
      <div className="space-y-3 pt-2">
        <h2 className="text-sm font-bold text-slate-800 px-1 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-slate-500" /> Top 5 Pengeluaran Terbesar
        </h2>
        <div className="space-y-2">
          {topExpenses.map((trx, idx) => (
            <div key={trx.id} className="bg-white border border-slate-100 p-3 rounded-xl shadow-sm flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                 <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</div>
                 <div>
                   <p className="text-xs font-bold text-slate-900 line-clamp-1">{trx.name}</p>
                   <p className="text-[10px] text-slate-500 mt-0.5">{trx.date}</p>
                 </div>
              </div>
              <p className="text-xs font-bold text-rose-600 shrink-0">-{formatIDR(trx.amount)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* IDEA 4: Profit & Loss Statement (Hanya untuk UMKM) */}
      {!isPersonal && (
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg border-none relative overflow-hidden mt-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <CardHeader className="pb-3 relative z-10">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Laporan Laba Rugi
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">Okt 2024</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4 relative z-10">
            <div className="grid grid-cols-2 gap-4 border-b border-slate-700/50 pb-4">
              <div>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Pendapatan Kotor</p>
                <p className="text-sm font-black text-emerald-400">{formatIDR(15500000)}</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Total Biaya</p>
                <p className="text-sm font-black text-rose-400">{formatIDR(8200000)}</p>
              </div>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1 font-bold">Laba Bersih (Net Profit)</p>
              <p className="text-2xl font-black text-white">{formatIDR(7300000)}</p>
              <div className="inline-block bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full mt-2">Margin Laba: 47%</div>
            </div>
            
            <button className="w-full mt-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Unduh Laporan PDF
            </button>
          </CardContent>
        </Card>
      )}

      {/* Modal / Dialog Tambah Anggaran */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Tambah Anggaran</CardTitle>
                <CardDescription className="text-xs">Tetapkan batas anggaran untuk kategori baru.</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full -mr-2" onClick={() => setIsModalOpen(false)}>
                <X className="w-4 h-4 text-slate-500" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-5">
              <form onSubmit={handleAddBudget} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Pilih Kategori</label>
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
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
                        className="h-9 text-sm"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Batas Anggaran (Rp)</label>
                  <Input 
                    type="number" 
                    placeholder="Misal: 500000" 
                    required 
                    value={newBudgetLimit}
                    onChange={(e) => setNewBudgetLimit(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <Button type="submit" className="w-full mt-2 font-bold text-sm bg-blue-600 hover:bg-blue-700">Simpan Anggaran</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}
