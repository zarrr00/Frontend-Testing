import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Scan, 
  Calendar, 
  ChevronRight 
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { useMode } from "@/contexts/ModeContext";
import { mainChartData, recentActivity } from "../data/mockData";

const formatIDR = (amount) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });

export default function MobileDashboard() {
  const { mode } = useMode();
  // Gunakan 7 data pertama biar gak penuh di layar HP
  const chartData = mainChartData.slice(0, 7);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 max-w-xl mx-auto w-full space-y-5 animate-in fade-in zoom-in-95 duration-300 pb-32 transition-colors">
      
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Halo, Devoryn! 👋</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Ringkasan kas {mode === 'umkm' ? 'UMKM' : 'Personal'}-mu hari ini.</p>
        </div>
      </header>

      {/* Kartu Saldo Utama - Tetap Gelap Mewah */}
      <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden rounded-2xl relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <CardContent className="p-5 relative z-10">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Wallet className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Total Saldo Aktif</span>
          </div>
          <div className="text-3xl font-extrabold tracking-tight mb-5">Rp 12.450.000</div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 mb-1">
                <div className="bg-emerald-500/20 p-1 rounded-full"><ArrowUpRight className="w-3 h-3 text-emerald-400" /></div>
                PEMASUKAN
              </div>
              <div className="text-sm font-bold text-slate-100">Rp 5.200.000</div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 mb-1">
                <div className="bg-rose-500/20 p-1 rounded-full"><ArrowDownRight className="w-3 h-3 text-rose-400" /></div>
                PENGELUARAN
              </div>
              <div className="text-sm font-bold text-slate-100">Rp 2.250.000</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aksi Cepat (Quick Actions) */}
      <div className="grid grid-cols-3 gap-3">
        <Link to="/add" state={{ type: 'income' }} className="flex flex-col items-center justify-center p-3 bg-card border border-border rounded-2xl shadow-sm hover:bg-accent active:scale-95 transition-all group">
          <div className="bg-emerald-500/10 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-[10px] font-bold">Pemasukan</span>
        </Link>

        <Link to="/add" state={{ type: 'expense' }} className="flex flex-col items-center justify-center p-3 bg-card border border-border rounded-2xl shadow-sm hover:bg-accent active:scale-95 transition-all group">
          <div className="bg-rose-500/10 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
            <ArrowDownRight className="w-5 h-5 text-rose-600" />
          </div>
          <span className="text-[10px] font-bold">Pengeluaran</span>
        </Link>

        {/* Tombol Scan Tetap Berwarna */}
        <button className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-md shadow-blue-500/30 active:scale-95 transition-all group relative overflow-hidden border-none">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-b-full"></div>
          <div className="bg-white/20 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform relative z-10">
            <Scan className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-bold text-white relative z-10">Scan Struk</span>
        </button>
      </div>

      {/* Grafik Arus Kas */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold px-1">Statistik Arus Kas</h2>
        <Card className="bg-card border-border shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-0 pt-4 pb-0 px-0">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -5, bottom: 15 }}>
                  <defs>
                    <linearGradient id="fillIncomeMobile" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="fillExpenseMobile" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: 'currentColor', fontSize: 10}} className="opacity-50" dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'currentColor', fontSize: 10}} className="opacity-50" dx={0} tickFormatter={(val) => `${val/1000000}M`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#fillIncomeMobile)" />
                  <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#fillExpenseMobile)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaksi Terakhir */}
      <div className="pt-2 pb-6">
        <div className="flex justify-between items-center mb-3 px-1">
          <h2 className="text-sm font-bold">Transaksi Terakhir</h2>
          <Link to="/transactions" className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center">
            Lihat Semua <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
        
        <div className="space-y-2">
          {recentActivity.map((trx) => (
            <div key={trx.id} className="bg-card border border-border p-3 rounded-xl shadow-sm flex items-center justify-between hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${trx.type === 'income' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                  {trx.type === 'income' ? <ArrowUpRight className="w-4 h-4 text-emerald-600" /> : <ArrowDownRight className="w-4 h-4 text-rose-600" />}
                </div>
                <div>
                  <p className="text-xs font-bold">{trx.action}</p>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                    <Calendar className="w-3 h-3" /> {formatDate(trx.dateISO)}
                  </div>
                </div>
              </div>
              <p className={`text-xs font-bold ${trx.type === 'income' ? 'text-emerald-600' : 'text-foreground'}`}>
                {trx.type === 'income' ? '+' : '-'}{formatIDR(trx.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}