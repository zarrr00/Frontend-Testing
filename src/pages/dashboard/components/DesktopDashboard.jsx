import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Scan, Plus, Search, Bell, Settings, TrendingUp, Wallet, ChevronRight } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Link } from "react-router-dom";
import { mainChartData, sparklineBalance, sparklineIncome, sparklineExpense, categoryData, recentActivity } from "../data/mockData";

export default function DesktopDashboard() {
  return (
    <div className="min-h-full bg-transparent text-slate-800 p-8 font-sans w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <header className="flex justify-between items-center mb-8 gap-4 px-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Halo, Devoryn 👋</h1>
          <p className="text-sm text-slate-500 mt-1">Sabtu, 26 Okt 2024 | 10:30 AM</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Cari transaksi..." className="bg-white border border-slate-200 shadow-sm rounded-full pl-9 pr-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all w-64" />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 shadow-sm rounded-full hover:bg-slate-50 transition-colors">
            <Bell className="w-4 h-4 text-slate-500" />
          </button>
          
          {/* User Profile */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-full py-1.5 px-3 cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-inner">
              D
            </div>
            <span className="text-sm font-bold text-slate-700">Devoryn</span>
            <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
          </div>
        </div>
      </header>

      {/* Main Grid Wrapper splits layout cleanly into Left Column (75%) and Right Column (25%) */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 px-2 pb-10">
        
        {/* LEFT COLUMN: Contains Top Cards and Charts */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          
          {/* Top 3 Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Card className="bg-white border-slate-200 shadow-sm relative overflow-hidden group">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Saldo Aktif</span>
                  <Wallet className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Rp 12.450.000</h2>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold bg-emerald-100/80 text-emerald-600 px-2 py-1 rounded-full w-max mt-1">
                      <ArrowUpRight className="w-3 h-3" />
                      <span>+8.5% bulan ini</span>
                    </div>
                  </div>
                  <div className="w-24 h-12 ml-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparklineBalance}>
                        <Line type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm relative overflow-hidden group">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Pemasukan</span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Rp 5.200.000</h2>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold bg-emerald-100/80 text-emerald-600 px-2 py-1 rounded-full w-max mt-1">
                      <ArrowUpRight className="w-3 h-3" />
                      <span>+12.0% bulan ini</span>
                    </div>
                  </div>
                  <div className="w-24 h-12 ml-2">
                     <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparklineIncome}>
                        <Line type="monotone" dataKey="v" stroke="#059669" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm relative overflow-hidden group">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Pengeluaran</span>
                  <ArrowDownRight className="w-4 h-4 text-rose-600" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Rp 2.250.000</h2>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold bg-rose-100/80 text-rose-600 px-2 py-1 rounded-full w-max mt-1">
                      <ArrowDownRight className="w-3 h-3" />
                      <span>-5.2% bulan ini</span>
                    </div>
                  </div>
                  <div className="w-24 h-12 ml-2">
                     <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sparklineExpense}>
                        <Line type="monotone" dataKey="v" stroke="#e11d48" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            <Card className="bg-white border-slate-200 shadow-sm lg:col-span-2 flex flex-col">
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-center mb-6 shrink-0">
                  <h3 className="text-sm font-bold text-slate-800">Trend Arus Kas</h3>
                  <div className="flex gap-4 text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm"></div>Pemasukan</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500 shadow-sm"></div>Pengeluaran</span>
                  </div>
                </div>
                <div className="w-full flex-1 min-h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mainChartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}} dx={-5} tickFormatter={(val) => `Rp${val/1000}k`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                      <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm lg:col-span-1 flex flex-col">
              <CardContent className="p-6 flex flex-col flex-1">
                <h3 className="text-sm font-bold text-slate-800 mb-6 shrink-0">Distribusi Kategori</h3>
                <div className="w-full relative flex-1 min-h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Inner text for donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <Scan className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Kategori</span>
                  </div>
                </div>
                <div className="mt-auto flex flex-col justify-end gap-2.5 shrink-0">
                  {categoryData.map((cat, i) => (
                    <div key={i} className="flex items-center justify-between text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                         <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{backgroundColor: cat.color}}></div>
                         <span>{cat.name}</span>
                      </div>
                      <span className="font-bold text-slate-800">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RIGHT COLUMN: Quick Actions & Gamification */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          {/* Quick Actions Panel */}
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden shrink-0">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Aksi Cepat</span>
              <Settings className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
            </div>
            <CardContent className="p-4 flex flex-col gap-3">
              <Link to="/add" state={{type: 'income'}} className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 shadow-sm rounded-xl hover:bg-slate-50 hover:border-emerald-200 transition-colors group cursor-pointer">
                 <div className="bg-emerald-100 p-2 rounded-lg group-hover:bg-emerald-200 transition-colors">
                    <Plus className="w-4 h-4 text-emerald-600" />
                 </div>
                 <span className="text-sm font-bold text-slate-700">Tambah Pemasukan</span>
              </Link>
              
              <Link to="/add" state={{type: 'expense'}} className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 shadow-sm rounded-xl hover:bg-slate-50 hover:border-rose-200 transition-colors group cursor-pointer">
                 <div className="bg-rose-100 p-2 rounded-lg group-hover:bg-rose-200 transition-colors">
                    <ArrowDownRight className="w-4 h-4 text-rose-600" />
                 </div>
                 <span className="text-sm font-bold text-slate-700">Tambah Pengeluaran</span>
              </Link>
              
              <button className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 shadow-sm rounded-xl hover:bg-slate-50 hover:border-blue-200 transition-colors group cursor-pointer w-full text-left">
                 <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Scan className="w-4 h-4 text-blue-600" />
                 </div>
                 <span className="text-sm font-bold text-slate-700">Scan Struk / Nota</span>
              </button>
            </CardContent>
          </Card>

          {/* Gamification: Financial Health - Stretches to fill available space aligning with Left Column */}
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col min-h-[220px]">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Kesehatan Finansial</span>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </div>
            <CardContent className="p-5 flex flex-col justify-center flex-1 gap-4">
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="text-sm font-black text-slate-800">Sangat Sehat</h4>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">Pengeluaran terkendali</p>
                </div>
                <span className="text-3xl font-black text-emerald-500 tracking-tighter">85<span className="text-xl">%</span></span>
              </div>
              
              <div className="relative w-full h-3.5 bg-slate-100 rounded-full overflow-hidden shadow-inner mt-2">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 rounded-full transition-all duration-1000 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]" 
                  style={{ width: '85%' }}
                ></div>
              </div>
              
              <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1 uppercase tracking-wider mt-1">
                <span>Kritis</span>
                <span>Waspada</span>
                <span>Aman</span>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* BOTTOM ROW: Recent Activity Log - Spanning FULL WIDTH */}
        <div className="xl:col-span-4 mt-2">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-sm font-bold text-slate-800">Riwayat Transaksi Terbaru</h3>
                 <span className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer">Lihat Semua Transaksi</span>
              </div>
              <div className="overflow-x-auto w-full">
                <table className="w-full text-sm text-left">
                  <thead className="text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="pb-3 font-bold px-4">Tipe Transaksi</th>
                      <th className="pb-3 font-bold px-4">Kategori / Aksi</th>
                      <th className="pb-3 font-bold px-4">Tanggal & Waktu</th>
                      <th className="pb-3 font-bold px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 w-1/4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${item.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                              {item.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            </div>
                            <span className="text-slate-800 font-bold">{item.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium w-1/3">{item.action}</td>
                        <td className="py-3.5 px-4 text-slate-500 text-xs font-medium w-1/4">{item.date}</td>
                        <td className="py-3.5 px-4 text-right">
                          <span className={`px-2.5 py-1.5 rounded-full text-[10px] font-bold tracking-wide shadow-sm ${item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
