import { useState, useRef } from 'react';
import { ArrowUpRight, ArrowDownRight, Scan, Plus, Search, Bell, Settings, TrendingUp, Wallet, ChevronRight } from "lucide-react";
import SparklineChart from "@/components/charts/SparklineChart";
import CashFlowAreaChart from "@/components/charts/CashFlowAreaChart";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import { Link, useNavigate } from "react-router-dom";
import { useDashboardData } from "../hooks/useDashboardData";
import { formatIDR } from "@/utils/currency";
import { transactionService } from "@/services/transaction.service";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedContent from "@/components/ui/AnimatedContent";
import BorderGlow from "@/components/ui/BorderGlow";
import { toast } from "sonner";

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

export default function DesktopDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const { user } = useAuth();
  const { summary, chartData, sparklineBalance, sparklineIncome, sparklineExpense, categoryData, recentActivity, loading, incomeChange, expenseChange, balanceChange, healthScore, healthLabel } = useDashboardData();
  const currentLocale = "id-ID";
  const userName = user?.full_name?.split(' ')[0] || 'User';

  /** Map API action names to display-friendly category labels. */
  const getTranslatedAction = (action) => {
    if (!action) return "";
    if (action.includes("Bahan Baku")) return "Bahan Baku";
    if (action.includes("Operasional")) return "Operasional";
    if (action.includes("Penjualan")) return "Penjualan";
    if (action.includes("Servis") || action.includes("Jasa")) return "Pendapatan Jasa";
    if (action.includes("Wi-Fi") || action.includes("Listrik")) return "Lain-lain";
    return action;
  };

  const handleScanClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsScanning(true);
    try {
      const result = await transactionService.scanReceipt(file);
      navigate("/add", {
        state: {
          amount: result.suggested_total || result.amount,
          description: result.extracted_text || result.description,
          type: "expense",
        },
      });
    } catch (err) {
      console.error("OCR scan failed:", err);
      toast.error("Gagal scan struk: " + (err.message || err));
    } finally {
      setIsScanning(false);
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
    <div className="min-h-full bg-background text-foreground p-8 font-sans w-full animate-in fade-in duration-300 transition-colors" id="snap-main-container">
      <AnimatedContent distance={30} delay={0.1} direction="vertical">
        <header className="flex justify-between items-center mb-8 gap-4 px-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Halo, {userName} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1 text-capitalize">
              {new Intl.DateTimeFormat(currentLocale, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }).format(new Date())} | 10:30 AM
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Cari riwayat transaksi..." className="bg-card border border-border shadow-sm rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all w-64" />
            </div>
            <button className="p-2.5 bg-card border border-border shadow-sm rounded-full hover:bg-accent transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2 bg-card border border-border shadow-sm rounded-full py-1.5 px-3 cursor-pointer hover:bg-accent transition-colors">
              <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold shadow-inner">{userName.charAt(0).toUpperCase()}</div>
              <span className="text-sm font-bold">{userName}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90" />
            </div>
          </div>
        </header>
      </AnimatedContent>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 px-2 pb-10">
        <div className="xl:col-span-3 flex flex-col gap-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatedContent distance={40} delay={0.2}>
              <BorderGlow {...GLOW}>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Saldo Aktif</span>
                    <Wallet className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-2xl font-black mb-2">{formatIDR(summary.balance)}</h2>
                      <div className={`flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-full w-max mt-1 ${balanceChange >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {balanceChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        <span>{balanceChange >= 0 ? '+' : ''}{balanceChange}% bulan ini</span>
                      </div>
                    </div>
                    <div className="w-24 h-12 ml-2">
                      <SparklineChart data={sparklineBalance} color="var(--primary)" />
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </AnimatedContent>
            <AnimatedContent distance={40} delay={0.3}>
              <BorderGlow {...GLOW}>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pemasukan</span>
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-2xl font-black mb-2">{formatIDR(summary.total_income)}</h2>
                      <div className={`flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-full w-max mt-1 ${incomeChange >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {incomeChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        <span>{incomeChange >= 0 ? '+' : ''}{incomeChange}% bulan ini</span>
                      </div>
                    </div>
                    <div className="w-24 h-12 ml-2">
                       <SparklineChart data={sparklineIncome} color="#10b981" />
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </AnimatedContent>
            <AnimatedContent distance={40} delay={0.4}>
              <BorderGlow {...GLOW}>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pengeluaran</span>
                    <ArrowDownRight className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-2xl font-black mb-2">{formatIDR(summary.total_expense)}</h2>
                      <div className={`flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-full w-max mt-1 ${expenseChange <= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {expenseChange <= 0 ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        <span>{expenseChange >= 0 ? '+' : ''}{expenseChange}% bulan ini</span>
                      </div>
                    </div>
                    <div className="w-24 h-12 ml-2">
                       <SparklineChart data={sparklineExpense} color="#f43f5e" />
                    </div>
                  </div>
                </div>
              </BorderGlow>
            </AnimatedContent>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            <AnimatedContent distance={40} delay={0.5} className="lg:col-span-2 flex flex-col h-full">
              <BorderGlow {...GLOW} className="flex-1">
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-6 shrink-0">
                    <h3 className="text-sm font-bold">Tren Arus Kas</h3>
                    <div className="flex gap-4 text-xs font-bold text-slate-400">
                      <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm"></div>Pemasukan</span>
                      <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500 shadow-sm"></div>Pengeluaran</span>
                    </div>
                  </div>
                  <div className="w-full flex-1 min-h-[220px]">
                      <CashFlowAreaChart data={chartData} />
                  </div>
                </div>
              </BorderGlow>
            </AnimatedContent>
            <AnimatedContent distance={40} delay={0.6} className="lg:col-span-1 flex flex-col h-full">
              <BorderGlow {...GLOW} className="flex-1">
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-sm font-bold mb-6 shrink-0">Distribusi Kategori</h3>
                  <div className="w-full relative flex-1 min-h-[160px]">
                      <CategoryPieChart data={categoryData} />
                  </div>
                  <div className="mt-auto flex flex-col justify-end gap-2.5 shrink-0">
                    {categoryData.map((cat, i) => (
                      <div key={i} className="flex items-center justify-between text-xs font-medium">
                        <div className="flex items-center gap-2">
                           <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{backgroundColor: cat.color}}></div>
                           <span>{cat.name}</span>
                        </div>
                        <span className="font-bold">{cat.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </BorderGlow>
            </AnimatedContent>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <AnimatedContent distance={40} delay={0.3} direction="vertical">
            <BorderGlow {...GLOW}>
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Aksi Cepat</span>
                <Settings className="w-4 h-4 text-slate-400 cursor-pointer hover:text-white transition-colors" />
              </div>
              <div className="p-4 flex flex-col gap-3">
                <Link to="/add" state={{type: 'income'}} className="flex items-center gap-3 p-3.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer">
                   <div className="bg-emerald-500/10 p-2 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                      <Plus className="w-4 h-4 text-emerald-500" />
                   </div>
                   <span className="text-sm font-bold">Tambah Pemasukan</span>
                </Link>
                <Link to="/add" state={{type: 'expense'}} className="flex items-center gap-3 p-3.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer">
                   <div className="bg-rose-500/10 p-2 rounded-lg group-hover:bg-rose-500/20 transition-colors">
                      <ArrowDownRight className="w-4 h-4 text-rose-500" />
                   </div>
                   <span className="text-sm font-bold">Tambah Pengeluaran</span>
                </Link>
                <button onClick={handleScanClick} disabled={isScanning} className="flex items-center gap-3 p-3.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer w-full text-left">
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                   <div className="bg-blue-500/10 p-2 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                      <Scan className={`w-4 h-4 text-blue-500 ${isScanning ? "animate-spin" : ""}`} />
                   </div>
                   <span className="text-sm font-bold">{isScanning ? "Memindai..." : "Scan Struk / Nota"}</span>
                </button>
              </div>
            </BorderGlow>
          </AnimatedContent>
          <AnimatedContent distance={40} delay={0.5} direction="vertical" className="flex-1 flex flex-col min-h-[220px]">
            <BorderGlow {...GLOW} className="flex-1">
              <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Kesehatan Finansial</span>
                <TrendingUp className="w-4 h-4 text-slate-400" />
              </div>
              <div className="p-5 flex flex-col justify-center flex-1 gap-4">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-sm font-black">{healthLabel}</h4>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">{healthScore >= 50 ? 'Pengeluaran terkendali' : 'Perlu perhatian'}</p>
                  </div>
                  <span className={`text-3xl font-black tracking-tighter ${healthScore >= 75 ? 'text-emerald-500' : healthScore >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>{healthScore}<span className="text-xl">%</span></span>
                </div>
                <div className="relative w-full h-3.5 bg-white/10 rounded-full overflow-hidden shadow-inner mt-2">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${healthScore}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 px-1 uppercase tracking-wider mt-1">
                  <span>Kritis</span>
                  <span>Waspada</span>
                  <span>Aman</span>
                </div>
              </div>
            </BorderGlow>
          </AnimatedContent>
        </div>

        {/* Recent Transactions Table */}
        <div className="xl:col-span-4 mt-2">
          <AnimatedContent distance={30} delay={0.7} direction="vertical">
            <BorderGlow {...GLOW}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-sm font-bold">Riwayat Transaksi Terbaru</h3>
                   <Link to="/transactions" className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-500 transition-colors rounded-lg text-xs font-bold shadow-sm">Lihat Semua</Link>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-sm text-left">
                    <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10">
                      <tr>
                        <th className="pb-3 font-bold px-4">Tipe Transaksi</th>
                        <th className="pb-3 font-bold px-4">Kategori &amp; Aktivitas</th>
                        <th className="pb-3 font-bold px-4">Tanggal &amp; Waktu</th>
                        <th className="pb-3 font-bold px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((item) => (
                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-4 w-1/4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${item.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {item.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                              </div>
                              <span className="font-bold">{item.type === 'income' ? "Pemasukan" : "Pengeluaran"}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 font-medium w-1/3">
                            {item.category_name || item.description || getTranslatedAction(item.action)}
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 text-xs font-medium w-1/4">{item.date ? new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</td>
                          <td className="py-3.5 px-4 text-right">
                            <span className={`px-2.5 py-1.5 rounded-full text-[10px] font-bold tracking-wide shadow-sm ${(!item.status || item.status === 'Selesai') ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                              {(!item.status || item.status === 'Selesai') ? "Selesai" : "Tertunda"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </BorderGlow>
          </AnimatedContent>
        </div>
      </div>
    </div>
  );
}