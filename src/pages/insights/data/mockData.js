// src/pages/insights/data/mockData.js

export const umkmData = [
  { name: "Bahan Baku", value: 3200000, color: "#3b82f6" }, 
  { name: "Operasional", value: 1500000, color: "#10b981" }, 
  { name: "Pemasaran", value: 400000, color: "#f59e0b" }, 
  { name: "Lain-lain", value: 150000, color: "#64748b" }, 
];

export const personalData = [
  { name: "Makanan & Minuman", value: 850000, color: "#a855f7" }, 
  { name: "Tagihan & Cicilan", value: 600000, color: "#ec4899" }, 
  { name: "Transportasi", value: 300000, color: "#3b82f6" }, 
  { name: "Hiburan", value: 400000, color: "#f43f5e" }, 
];

export const trendData = [
  { name: "Minggu 1", thisMonth: 1200000, lastMonth: 1500000 },
  { name: "Minggu 2", thisMonth: 2100000, lastMonth: 1800000 },
  { name: "Minggu 3", thisMonth: 800000, lastMonth: 1200000 },
  { name: "Minggu 4", thisMonth: 1500000, lastMonth: 1000000 },
];

export const budgetData = [
  { category: "Operasional", spent: 1500000, limit: 2000000, color: "bg-blue-500" },
  { category: "Bahan Baku", spent: 3200000, limit: 3000000, color: "bg-rose-500" }, // Overbudget
  { category: "Pemasaran", spent: 400000, limit: 1000000, color: "bg-emerald-500" },
];

export const topExpenses = [
  { id: 1, name: "Sewa Tempat (Bulanan)", date: "01 Okt 2024", amount: 1500000 },
  { id: 2, name: "Biji Kopi Premium (10kg)", date: "05 Okt 2024", amount: 1250000 },
  { id: 3, name: "Peralatan Dapur Baru", date: "12 Okt 2024", amount: 800000 },
  { id: 4, name: "Iklan Instagram", date: "10 Okt 2024", amount: 400000 },
  { id: 5, name: "Listrik & Air", date: "15 Okt 2024", amount: 350000 },
];

export const formatIDR = (amount) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
};
