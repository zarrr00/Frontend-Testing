import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useMode } from "@/contexts/ModeContext";
import { Lightbulb, TrendingDown, AlertCircle, FileText, Download, Target, Receipt } from "lucide-react";

// Mock Data untuk Distribusi Donat
const umkmData = [
  { name: "Bahan Baku", value: 3200000, color: "#3b82f6" }, 
  { name: "Operasional", value: 1500000, color: "#10b981" }, 
  { name: "Pemasaran", value: 400000, color: "#f59e0b" }, 
  { name: "Lain-lain", value: 150000, color: "#64748b" }, 
];

const personalData = [
  { name: "Makanan & Minuman", value: 850000, color: "#a855f7" }, 
  { name: "Tagihan & Cicilan", value: 600000, color: "#ec4899" }, 
  { name: "Transportasi", value: 300000, color: "#3b82f6" }, 
  { name: "Hiburan", value: 400000, color: "#f43f5e" }, 
];

// Data Analisis Tren (Idea 1)
const trendData = [
  { name: "Minggu 1", thisMonth: 1200000, lastMonth: 1500000 },
  { name: "Minggu 2", thisMonth: 2100000, lastMonth: 1800000 },
  { name: "Minggu 3", thisMonth: 800000, lastMonth: 1200000 },
  { name: "Minggu 4", thisMonth: 1500000, lastMonth: 1000000 },
];

// Data Budget (Idea 2)
const budgetData = [
  { category: "Operasional", spent: 1500000, limit: 2000000, color: "bg-blue-500" },
  { category: "Bahan Baku", spent: 3200000, limit: 3000000, color: "bg-rose-500" }, // Overbudget
  { category: "Pemasaran", spent: 400000, limit: 1000000, color: "bg-emerald-500" },
];

// Top Expenses (Idea 1)
const topExpenses = [
  { id: 1, name: "Sewa Tempat (Bulanan)", date: "01 Okt 2024", amount: 1500000 },
  { id: 2, name: "Biji Kopi Premium (10kg)", date: "05 Okt 2024", amount: 1250000 },
  { id: 3, name: "Peralatan Dapur Baru", date: "12 Okt 2024", amount: 800000 },
  { id: 4, name: "Iklan Instagram", date: "10 Okt 2024", amount: 400000 },
  { id: 5, name: "Listrik & Air", date: "15 Okt 2024", amount: 350000 },
];

// Format IDR
const formatIDR = (amount) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
};

export default function Insights() {
  const { mode } = useMode(); 
  
  const isPersonal = mode === 'personal';
  const activeData = isPersonal ? personalData : umkmData;
  const themeColor = isPersonal ? 'text-purple-600' : 'text-blue-600';
  const themeBg = isPersonal ? 'bg-purple-100' : 'bg-blue-100';

  const totalExpense = activeData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto w-full space-y-6 animate-in fade-in zoom-in-95 duration-300 pb-28">
      
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
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-rose-500" />
            Anggaran Kategori
          </CardTitle>
          <CardDescription className="text-xs">Pantau batas pengeluaranmu dari budget</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-5">
          {budgetData.map((item, idx) => {
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
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
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

    </div>
  );
}