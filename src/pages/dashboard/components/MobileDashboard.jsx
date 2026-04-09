import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Scan,
  Calendar,
  ChevronRight,
} from "lucide-react";
import CashFlowAreaChart from "@/components/charts/CashFlowAreaChart";
import { Link } from "react-router-dom";
import { useMode } from "@/contexts/ModeContext";
import { useDashboardData } from "../hooks/useDashboardData";
import { formatIDR } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedContent from "@/components/ui/AnimatedContent";

export default function MobileDashboard() {
  const { mode } = useMode();
  const { user } = useAuth();
  const { summary, chartData, recentActivity, loading } = useDashboardData();
  const userName = user?.full_name?.split(' ')[0] || 'User';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Only show last 7 days for compact mobile chart
  const mobileChartData = chartData.slice(0, 7);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 max-w-xl mx-auto w-full space-y-5 animate-in fade-in zoom-in-95 duration-300 pb-32 transition-colors" id="snap-main-container">
      <AnimatedContent distance={30} delay={0.1} direction="vertical">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Halo, {userName}! 👋</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ringkasan kas {mode === 'umkm' ? "UMKM" : "Personal"} hari ini.
            </p>
          </div>
        </header>
      </AnimatedContent>

      {/* Balance Card */}
      <AnimatedContent distance={40} delay={0.2} direction="vertical">
        <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden rounded-2xl relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <CardContent className="p-5 relative z-10">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Wallet className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Total Saldo Aktif</span>
            </div>
            <div className="text-3xl font-extrabold tracking-tight mb-5">{formatIDR(summary.balance)}</div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 mb-1">
                  <div className="bg-emerald-500/20 p-1 rounded-full"><ArrowUpRight className="w-3 h-3 text-emerald-400" /></div>
                  PEMASUKAN
                </div>
                <div className="text-sm font-bold text-slate-100">{formatIDR(summary.total_income)}</div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 mb-1">
                  <div className="bg-rose-500/20 p-1 rounded-full"><ArrowDownRight className="w-3 h-3 text-rose-400" /></div>
                  PENGELUARAN
                </div>
                <div className="text-sm font-bold text-slate-100">{formatIDR(summary.total_expense)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedContent>

      {/* Quick Actions */}
      <AnimatedContent distance={40} delay={0.3} direction="vertical">
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
          <button className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-md shadow-blue-500/30 active:scale-95 transition-all group relative overflow-hidden border-none">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-b-full"></div>
            <div className="bg-white/20 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform relative z-10">
              <Scan className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-bold text-white relative z-10">Scan Struk / Nota</span>
          </button>
        </div>
      </AnimatedContent>

      {/* Cash Flow Chart */}
      <AnimatedContent distance={40} delay={0.4} direction="vertical">
        <div className="space-y-3">
          <h2 className="text-sm font-bold px-1">Tren Arus Kas</h2>
          <Card className="bg-card border-border shadow-sm rounded-xl overflow-hidden">
            <CardContent className="p-0 pt-4 pb-0 px-0">
              <div className="h-[200px] w-full">
                <CashFlowAreaChart data={mobileChartData} isMobile={true} />
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedContent>

      {/* Recent Transactions */}
      <AnimatedContent distance={30} delay={0.5} direction="vertical">
        <div className="pt-2 pb-6">
          <div className="flex justify-between items-center mb-3 px-1">
            <h2 className="text-sm font-bold">Riwayat Transaksi Terbaru</h2>
            <Link to="/transactions" className="px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg text-xs font-bold shadow-sm flex items-center">
              Lihat Semua <ChevronRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentActivity.map((trx, i) => (
              <AnimatedContent key={trx.id} distance={20} delay={0.5 + (i * 0.1)} direction="vertical">
                <div className="bg-card border border-border p-3 rounded-xl shadow-sm flex items-center justify-between hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${trx.type === 'income' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                      {trx.type === 'income' ? <ArrowUpRight className="w-4 h-4 text-emerald-600" /> : <ArrowDownRight className="w-4 h-4 text-rose-600" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{trx.category_name || trx.description || trx.action}</p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                        <Calendar className="w-3 h-3" /> {formatDate(trx.date || trx.dateISO)}
                      </div>
                    </div>
                  </div>
                  <p className={`text-xs font-bold ${trx.type === 'income' ? 'text-emerald-600' : 'text-foreground'}`}>
                    {trx.type === 'income' ? '+' : '-'}{formatIDR(trx.amount)}
                  </p>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </AnimatedContent>
    </div>
  );
}