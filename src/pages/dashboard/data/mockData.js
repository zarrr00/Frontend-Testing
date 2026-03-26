export const mainChartData = [
  { day: "Sen", income: 2000, expense: 1200, month: "Jan" },
  { day: "Sel", income: 3500, expense: 1800, month: "Feb" },
  { day: "Rab", income: 2800, expense: 2100, month: "Mar" },
  { day: "Kam", income: 4500, expense: 2500, month: "Apr" },
  { day: "Jum", income: 5200, expense: 3200, month: "May" },
  { day: "Sab", income: 4800, expense: 3800, month: "Jun" },
  { day: "Min", income: 6100, expense: 4200, month: "Jul" },
  { month: "Aug", income: 7500, expense: 5100 },
  { month: "Sep", income: 8200, expense: 5800 },
  { month: "Oct", income: 9500, expense: 6200 },
];

export const sparklineBalance = [ {v:10}, {v:15}, {v:12}, {v:20}, {v:18}, {v:25}, {v:22} ];
export const sparklineIncome = [ {v:5}, {v:10}, {v:8}, {v:15}, {v:12}, {v:20}, {v:25} ];
export const sparklineExpense = [ {v:20}, {v:15}, {v:18}, {v:12}, {v:10}, {v:8}, {v:5} ];

export const categoryData = [
  { name: "Operasional", value: 45, color: "#3b82f6" }, // Blue
  { name: "Bahan Baku", value: 35, color: "#8b5cf6" }, // Purple
  { name: "Lainnya", value: 20, color: "#10b981" }, // Emerald
];

export const recentActivity = [
  { id: 1, action: "Pembelian Bahan Baku", category: "Bahan Baku", amount: 150000, date: "Okt 26, 10:15 AM", dateISO: "2026-03-16T08:00:00", status: "Selesai", type:"expense" },
  { id: 2, action: "Penjualan Produk B", category: "Penjualan", amount: 500000, date: "Okt 26, 09:45 AM", dateISO: "2026-03-15T14:30:00", status: "Tertunda", type:"income" },
  { id: 3, action: "Biaya Operasional", category: "Operasional", amount: 50000, date: "Okt 26, 09:00 AM", dateISO: "2026-03-15T09:15:00", status: "Selesai", type:"expense" },
  { id: 4, action: "Pembayaran Wi-Fi", category: "Internet", amount: 350000, date: "Okt 25, 08:30 AM", dateISO: "2026-03-14T08:00:00", status: "Selesai", type:"expense" },
  { id: 5, action: "Pendapatan Servis", category: "Layanan", amount: 200000, date: "Okt 25, 02:15 PM", dateISO: "2026-03-14T14:00:00", status: "Selesai", type:"income" },
];
