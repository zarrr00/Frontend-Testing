import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { formatDate } from "./date";
import { formatIDR } from "./currency";
export const handleExportCSV = (filteredTransactions) => {
  if (!filteredTransactions || filteredTransactions.length === 0) {
    return toast.error("Tidak ada data untuk diekspor!");
  }
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
export const handleExportPDF = (filteredTransactions) => {
  if (!filteredTransactions || filteredTransactions.length === 0) {
    return toast.error("Tidak ada data untuk diekspor!");
  }
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
