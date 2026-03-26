import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  ArrowDownRight, ArrowUpRight, Search, Calendar, FileQuestion, 
  Download, FileSpreadsheet, FileText 
} from "lucide-react";
import { toast } from "sonner";

// Import Pustaka Ekspor PDF
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Komponen UI Dropdown
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Data Transaksi
const transactions = [
  { id: 1, type: "expense", amount: 150000, category: "Bahan Baku", notes: "Beli tepung dan telur", date: "2026-03-16T08:00:00" },
  { id: 2, type: "income", amount: 500000, category: "Penjualan", notes: "Pesanan katering", date: "2026-03-15T14:30:00" },
  { id: 3, type: "expense", amount: 50000, category: "Operasional", notes: "Bensin motor", date: "2026-03-15T09:15:00" },
  { id: 4, type: "expense", amount: 200000, category: "Listrik", notes: "Token PLN", date: "2026-03-14T18:00:00" },
  { id: 5, type: "income", amount: 1200000, category: "Penjualan", notes: "Bazar sekolah", date: "2026-03-13T16:00:00" },
];

const formatIDR = (amount) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter((trx) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      trx.category.toLowerCase().includes(searchLower) ||
      trx.notes.toLowerCase().includes(searchLower)
    );
  });

  // Fungsi Ekspor CSV
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return toast.error("Tidak ada data untuk diekspor!");
    const headers = ["Tanggal", "Tipe", "Kategori", "Nominal (Rp)", "Catatan"];
    const csvRows = filteredTransactions.map(trx => {
      return `"${formatDate(trx.date)}","${trx.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}","${trx.category}","${trx.amount}","${trx.notes}"`;
    });
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Laporan_KasFlow_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Laporan CSV berhasil diunduh!");
  };

  // Fungsi Ekspor PDF
  const handleExportPDF = () => {
    if (filteredTransactions.length === 0) return toast.error("Tidak ada data untuk diekspor!");
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Laporan Transaksi KasFlow", 14, 20);
      doc.setFontSize(10);
      doc.text(`Dicetak pada: ${formatDate(new Date().toISOString())}`, 14, 28);
      const tableColumn = ["Tanggal", "Tipe", "Kategori", "Nominal", "Catatan"];
      const tableRows = filteredTransactions.map(trx => [
        formatDate(trx.date),
        trx.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        trx.category,
        formatIDR(trx.amount),
        trx.notes
      ]);
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] },
      });
      doc.save(`Laporan_KasFlow_${Date.now()}.pdf`);
      toast.success("Laporan PDF berhasil diunduh!");
    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      toast.error("Gagal membuat laporan PDF. Coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-xl mx-auto w-full space-y-4 animate-in fade-in zoom-in-95 duration-300 transition-colors">
      
      <header className="mb-4">
        <h1 className="text-xl font-bold tracking-tight">Riwayat Transaksi</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Pantau semua pengeluaran dan pemasukanmu.</p>
      </header>

      {/* Area Pencarian dan Ekspor */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Cari kategori atau catatan..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card border-border shadow-sm rounded-xl h-11 focus-visible:ring-indigo-600"
          />
        </div>

        {/* Menu Ekspor */}
        <DropdownMenu>
          {/* FIX: Menggunakan bg-[#4f46e5] agar warna tetap Indigo biarpun Dark Mode */}
          <DropdownMenuTrigger className="flex items-center justify-center w-11 h-11 bg-[#4f46e5] text-white rounded-xl shadow-md hover:bg-[#4338ca] active:scale-95 transition-all outline-none">
            <Download className="w-5 h-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 bg-card border-border shadow-lg">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Ekspor Data</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer gap-2 py-2 font-medium hover:bg-accent">
              <FileText className="w-4 h-4 text-rose-500" /> Unduh PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportCSV} className="cursor-pointer gap-2 py-2 font-medium hover:bg-accent">
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Unduh CSV (Excel)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Daftar Transaksi */}
      <div className="space-y-3 pb-6">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((trx) => (
            <Card key={trx.id} className="bg-card border-border shadow-sm overflow-hidden hover:bg-accent transition-colors cursor-pointer">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${trx.type === 'income' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                    {trx.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{trx.category}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {formatDate(trx.date)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${trx.type === 'income' ? 'text-emerald-500' : 'text-foreground'}`}>
                    {trx.type === 'income' ? '+' : '-'}{formatIDR(trx.amount)}
                  </p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1 max-w-[100px] mt-0.5 ml-auto">
                    {trx.notes || "-"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <FileQuestion className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-sm font-medium">Transaksi tidak ditemukan</p>
          </div>
        )}
      </div>

    </div>
  );
}