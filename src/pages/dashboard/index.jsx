import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Wallet, Scan, Calendar, ChevronRight } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Link } from "react-router-dom";

// ✅ TAMBAHAN
import { useEffect, useState } from "react";
import axios from "axios";

// Data Grafik (tetap)
const chartData = [
  { day: "Sen", income: 450, expense: 200 },
  { day: "Sel", income: 600, expense: 350 },
  { day: "Rab", income: 500, expense: 150 },
  { day: "Kam", income: 800, expense: 400 },
  { day: "Jum", income: 750, expense: 300 },
  { day: "Sab", income: 1200, expense: 600 },
  { day: "Min", income: 900, expense: 250 },
];

const chartConfig = {
  income: { label: "Pemasukan", color: "#10b981" },
  expense: { label: "Pengeluaran", color: "#f43f5e" },
};

// Data Transaksi (fallback)
const recentTransactions = [
  { id: 1, type: "expense", amount: 150000, category: "Bahan Baku", date: "2026-03-16T08:00:00" },
  { id: 2, type: "income", amount: 500000, category: "Penjualan", date: "2026-03-15T14:30:00" },
  { id: 3, type: "expense", amount: 50000, category: "Operasional", date: "2026-03-15T09:15:00" },
];

const formatIDR = (amount) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });

export default function Dashboard() {

  // ✅ STATE
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/transactions");
        setTransactions(res.data.data || []);
      } catch (err) {
        console.error("Error fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // ✅ AUTO CALCULATION (tanpa ganggu UI)
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // ✅ DATA YANG DIPAKAI
  const displayedTransactions =
    transactions.length > 0 ? transactions.slice(0, 3) : recentTransactions;

  // ✅ OPTIONAL LOADING
  if (loading) {
    return <div className="p-4 text-sm text-slate-500">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto w-full space-y-5 animate-in fade-in zoom-in-95 duration-300">
      
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Halo, Ahlun! 👋</h1>
          <p className="text-xs text-slate-500 mt-0.5">Ringkasan kas UMKM-mu hari ini.</p>
        </div>
      </header>

      {/* Kartu Saldo */}
      <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden rounded-2xl relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <CardContent className="p-5 relative z-10">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Wallet className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Total Saldo Aktif</span>
          </div>

          {/* ✅ DINAMIS */}
          <div className="text-3xl font-extrabold tracking-tight mb-5">
            {formatIDR(balance || 5200000)}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 mb-1">
                <div className="bg-emerald-500/20 p-1 rounded-full">
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                </div>
                PEMASUKAN
              </div>

              <div className="text-sm font-bold text-slate-100">
                {formatIDR(totalIncome || 5200000)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 mb-1">
                <div className="bg-rose-500/20 p-1 rounded-full">
                  <ArrowDownRight className="w-3 h-3 text-rose-400" />
                </div>
                PENGELUARAN
              </div>

              <div className="text-sm font-bold text-slate-100">
                {formatIDR(totalExpense || 2250000)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions (TIDAK DIUBAH) */}
      <div className="grid grid-cols-3 gap-3">
        <Link to="/add" state={{ type: 'income' }} className="flex flex-col items-center justify-center p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all group">
          <div className="bg-emerald-100 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-[10px] font-bold text-slate-700">Pemasukan</span>
        </Link>

        <Link to="/add" state={{ type: 'expense' }} className="flex flex-col items-center justify-center p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all group">
          <div className="bg-rose-100 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
            <ArrowDownRight className="w-5 h-5 text-rose-600" />
          </div>
          <span className="text-[10px] font-bold text-slate-700">Pengeluaran</span>
        </Link>

        <button className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-md shadow-blue-500/30 active:scale-95 transition-all group relative overflow-hidden">
          <div className="bg-white/20 p-2 rounded-full mb-2">
            <Scan className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] font-bold text-white">Scan Struk</span>
        </button>
      </div>

      {/* Grafik (TIDAK DIUBAH) */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-800 px-1">Statistik Arus Kas</h2>
        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-0 pt-4">
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <AreaChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="day" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="income" stroke="var(--color-income)" fill="url(#fillIncome)" />
                <Area type="monotone" dataKey="expense" stroke="var(--color-expense)" fill="url(#fillExpense)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transaksi */}
      <div className="pt-2 pb-6">
        <div className="space-y-2">
          {displayedTransactions.map((trx) => (
            <div key={trx.id} className="bg-white border p-3 rounded-xl flex justify-between">
              <div>
                <p className="text-xs font-bold">
                  {trx.category_name || trx.category}
                </p>
                <p className="text-[10px] text-slate-500">
                  {formatDate(trx.date)}
                </p>
              </div>

              <p className="text-xs font-bold">
                {trx.type === "income" ? "+" : "-"}
                {formatIDR(trx.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}