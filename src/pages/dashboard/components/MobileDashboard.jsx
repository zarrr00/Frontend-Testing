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
import BorderGlow from "@/components/ui/BorderGlow";

const GLOW = {
  edgeSensitivity: 30,
  glowColor: '40 80 80',
  backgroundColor: '#060010',
  borderRadius: 16,
  glowRadius: 60,
  glowIntensity: 3,
  coneSpread: 45,
  animated: false,
  colors: ['#c084fc', '#f472b6', '#38bdf8'],
};

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
        <BorderGlow {...GLOW}>
          <div className="p-5 relative z-10">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Wallet className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Total Saldo Aktif</span>
            </div>
            <div className="text-3xl font-extrabold tracking-tight mb-5">{formatIDR(summary.balance)}</div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 mb-1">
                  <div className="bg-emerald-500/20 p-1 rounded-full"><ArrowUpRight className="w-3 h-3 text-emerald-400" /></div>
                  PEMASUKAN
                </div>
                <div className="text-sm font-bold">{formatIDR(summary.total_income)}</div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 mb-1">
                  <div className="bg-rose-500/20 p-1 rounded-full"><ArrowDownRight className="w-3 h-3 text-rose-400" /></div>
                  PENGELUARAN
                </div>
                <div className="text-sm font-bold">{formatIDR(summary.total_expense)}</div>
              </div>
            </div>
          </div>
        </BorderGlow>
      </AnimatedContent>

      {/* Quick Actions */}
      <AnimatedContent distance={40} delay={0.3} direction="vertical">
        <div className="grid grid-cols-3 gap-3">
          <BorderGlow {...GLOW} borderRadius={16}>
            <Link to="/add" state={{ type: 'income' }} className="flex flex-col items-center justify-center p-3 group">
              <div className="bg-emerald-500/10 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <ArrowUpRight className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-[10px] font-bold">Pemasukan</span>
            </Link>
          </BorderGlow>
          <BorderGlow {...GLOW} borderRadius={16}>
            <Link to="/add" state={{ type: 'expense' }} className="flex flex-col items-center justify-center p-3 group">
              <div className="bg-rose-500/10 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <ArrowDownRight className="w-5 h-5 text-rose-400" />
              </div>
              <span className="text-[10px] font-bold">Pengeluaran</span>
            </Link>
          </BorderGlow>
          <BorderGlow {...GLOW} borderRadius={16} colors={['#3b82f6', '#6366f1', '#8b5cf6']}>
            <button className="flex flex-col items-center justify-center p-3 group w-full">
              <div className="bg-blue-500/20 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <Scan className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-[10px] font-bold">Scan Struk</span>
            </button>
          </BorderGlow>
        </div>
      </AnimatedContent>

      {/* Cash Flow Chart */}
      <AnimatedContent distance={40} delay={0.4} direction="vertical">
        <div className="space-y-3">
          <h2 className="text-sm font-bold px-1">Tren Arus Kas</h2>
          <BorderGlow {...GLOW}>
            <div className="pt-4">
              <div className="h-[200px] w-full">
                <CashFlowAreaChart data={mobileChartData} isMobile={true} />
              </div>
            </div>
          </BorderGlow>
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
                <BorderGlow {...GLOW}>
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${trx.type === 'income' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                        {trx.type === 'income' ? <ArrowUpRight className="w-4 h-4 text-emerald-400" /> : <ArrowDownRight className="w-4 h-4 text-rose-400" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold">{trx.category_name || trx.description || trx.action}</p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                          <Calendar className="w-3 h-3" /> {formatDate(trx.date || trx.dateISO)}
                        </div>
                      </div>
                    </div>
                    <p className={`text-xs font-bold ${trx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                      {trx.type === 'income' ? '+' : '-'}{formatIDR(trx.amount)}
                    </p>
                  </div>
                </BorderGlow>
              </AnimatedContent>
            ))}
          </div>
        </div>
      </AnimatedContent>
    </div>
  );
}