import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useMode } from "@/contexts/ModeContext";
import { Lightbulb, TrendingDown, AlertCircle } from "lucide-react";

// Data Mode UMKM
const umkmData = [
  { name: "Bahan Baku", value: 1250000, color: "#3b82f6" }, // Blue
  { name: "Gaji Karyawan", value: 800000, color: "#f59e0b" }, // Amber
  { name: "Operasional", value: 450000, color: "#10b981" }, // Emerald
  { name: "Lain-lain", value: 150000, color: "#64748b" }, // Slate
];

// Data Mode Personal
const personalData = [
  { name: "Makanan & Minuman", value: 850000, color: "#a855f7" }, // Purple
  { name: "Tagihan & Cicilan", value: 600000, color: "#ec4899" }, // Pink
  { name: "Transportasi", value: 300000, color: "#3b82f6" }, // Blue
  { name: "Hiburan", value: 400000, color: "#f43f5e" }, // Rose
];

// Helper untuk format Rupiah
const formatIDR = (amount) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
};

export default function Insights() {
  const { mode } = useMode(); // Ambil state mode saat ini dari Context
  
  const isPersonal = mode === 'personal';
  const activeData = isPersonal ? personalData : umkmData;
  const themeColor = isPersonal ? 'text-purple-600' : 'text-blue-600';
  const themeBg = isPersonal ? 'bg-purple-100' : 'bg-blue-100';

  // Hitung total pengeluaran untuk ditampilkan di tengah Donat
  const totalExpense = activeData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto w-full space-y-5 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header Halaman */}
      <header>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Analisis Pengeluaran</h1>
        <p className="text-xs text-slate-500 mt-0.5">Ke mana perginya uangmu bulan ini?</p>
      </header>

      {/* Kartu Saran / Insight */}
      <Card className={`${themeBg} border-none shadow-sm`}>
        <CardContent className="p-4 flex gap-3 items-start">
          <Lightbulb className={`w-5 h-5 shrink-0 mt-0.5 ${themeColor}`} />
          <div>
            <h3 className={`text-sm font-bold ${themeColor} mb-1`}>Insight Cerdas</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Pengeluaran terbesarmu bulan ini ada di kategori <span className="font-bold">{activeData[0].name}</span>. 
              {isPersonal ? " Coba kurangi jajan di luar untuk berhemat." : " Pastikan harga jual produkmu sudah menutup modal ini."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Kartu Grafik Donut */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm">Distribusi Kategori</CardTitle>
          <CardDescription className="text-xs">Berdasarkan total pengeluaran {formatIDR(totalExpense)}</CardDescription>
        </CardHeader>
        <CardContent className="p-0 flex flex-col items-center">
          
          {/* Render Grafik */}
          <div className="h-[220px] w-full mt-4">
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
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legenda dan Persentase */}
          <div className="w-full px-5 pb-5 space-y-3">
            {activeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-medium text-slate-700">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-900">{formatIDR(item.value)}</span>
                  <span className="text-[10px] text-slate-400 font-medium w-8 text-right">
                    {Math.round((item.value / totalExpense) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

        </CardContent>
      </Card>

    </div>
  );
}