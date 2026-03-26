import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function AddTransaction() {
  const location = useLocation();

  // State Formulir
  const [type, setType] = useState("expense"); 
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const incomeCategories = ["Penjualan", "Pendapatan Jasa", "Modal", "Lain-lain"];
  const expenseCategories = ["Bahan Baku", "Operasional", "Pemasaran", "Gaji Pokok", "Tagihan", "Sewa", "Lain-lain"];

  // Sinkronisasi dengan Router State
  useEffect(() => {
    if (location.state && location.state.type) {
      setType(location.state.type);
      setCategory(""); 
    }
    // Jika ada data dari OCR (Scan Struk)
    if (location.state && location.state.amount) {
      setAmount(location.state.amount);
      if (location.state.description) setNotes(location.state.description);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return toast.error("Nominal tidak boleh kosong!");
    if (!category.trim()) return toast.error("Kategori belum diisi!");

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); 
      toast.success(`Berhasil mencatat ${type === 'income' ? 'Pemasukan' : 'Pengeluaran'}!`);
      setAmount("");
      setCategory("");
      setNotes("");
      setDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      toast.error("Gagal menyimpan transaksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-xl mx-auto w-full animate-in fade-in zoom-in-95 duration-300 transition-colors">
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight">Catat Transaksi</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Masukkan nominal kas baru di sini.</p>
      </header>

      {/* Toggle Tipe Transaksi */}
      <div className="flex p-1.5 bg-muted rounded-xl mb-6 shadow-inner">
        <button
          type="button"
          onClick={() => { setType("expense"); setCategory(""); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
            type === "expense" 
              ? "bg-card text-rose-500 shadow-md transform scale-[1.02]" 
              : "text-muted-foreground hover:bg-background/50"
          }`}
        >
          <ArrowDownCircle className="w-4 h-4" /> Pengeluaran
        </button>
        
        <button
          type="button"
          onClick={() => { setType("income"); setCategory(""); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
            type === "income" 
              ? "bg-card text-emerald-500 shadow-md transform scale-[1.02]" 
              : "text-muted-foreground hover:bg-background/50"
          }`}
        >
          <ArrowUpCircle className="w-4 h-4" /> Pemasukan
        </button>
      </div>

      {/* FORM INPUT */}
      <form onSubmit={handleSubmit}>
        <Card className={`border-border shadow-sm overflow-hidden transition-colors duration-500 ${type === 'income' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Nominal {type === "expense" ? "Pengeluaran" : "Pemasukan"}
            </CardTitle>
            <div className="flex items-center text-4xl font-extrabold tracking-tighter">
              <span className={`mr-2 ${type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>Rp</span>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/30"
                disabled={isSubmitting}
                autoFocus
              />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4 border-t border-border/50 pt-4 bg-card">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Tanggal</label>
              <Input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isSubmitting}
                className="bg-background h-12 rounded-xl border-border" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-background h-12 rounded-xl border border-border px-3 text-sm text-foreground outline-none focus-visible:ring-1 focus-visible:ring-primary transition-shadow"
              >
                <option value="" disabled className="bg-card">Pilih Kategori</option>
                {type === 'income' 
                  ? incomeCategories.map(cat => <option key={cat} value={cat} className="bg-card">{cat}</option>)
                  : expenseCategories.map(cat => <option key={cat} value={cat} className="bg-card">{cat}</option>)
                }
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Catatan (Opsional)</label>
              <textarea 
                rows={2}
                placeholder="Tulis detail transaksi..." 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-background rounded-xl border border-border p-3 text-sm text-foreground outline-none focus-visible:ring-1 focus-visible:ring-primary transition-shadow resize-none" 
              />
            </div>

            <Button 
              type="submit" 
              className={`w-full mt-6 h-12 text-md font-bold rounded-xl transition-all border-none text-white ${
                type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`} 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                `Simpan ${type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}