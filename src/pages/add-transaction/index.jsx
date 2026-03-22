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
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sinkronisasi dengan Router State
  useEffect(() => {
    // Ubah tipe berdasarkan state dari Dashboard
    if (location.state && location.state.type) {
      setType(location.state.type);
    }
  }, [location.state]); // Akan dijalankan ulang setiap kali lokasi/state router berubah

  // Fungsi Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) return toast.error("Nominal tidak boleh kosong!");
    if (!category.trim()) return toast.error("Kategori belum diisi!");

    setIsSubmitting(true);

    try {
      // Simulasi jeda API
      await new Promise((resolve) => setTimeout(resolve, 1500)); 

      toast.success(`Berhasil mencatat ${type === 'income' ? 'Pemasukan' : 'Pengeluaran'}!`);

      // Reset form
      setAmount("");
      setCategory("");
      setNotes("");
    } catch (error) {
      toast.error("Gagal menyimpan transaksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto w-full animate-in fade-in zoom-in-95 duration-300">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Catat Transaksi</h1>
        <p className="text-xs text-slate-500 mt-0.5">Masukkan nominal kas baru di sini.</p>
      </header>

      {/* Toggle Tipe Transaksi */}
      <div className="flex p-1.5 bg-slate-200/60 rounded-xl mb-6 shadow-inner">
        <button
          type="button"
          onClick={() => setType("expense")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
            type === "expense" 
              ? "bg-white text-rose-600 shadow-md transform scale-[1.02]" 
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
          }`}
        >
          <ArrowDownCircle className="w-4 h-4" /> Pengeluaran
        </button>
        
        <button
          type="button"
          onClick={() => setType("income")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${
            type === "income" 
              ? "bg-white text-emerald-600 shadow-md transform scale-[1.02]" 
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
          }`}
        >
          <ArrowUpCircle className="w-4 h-4" /> Pemasukan
        </button>
      </div>

      {/* FORM INPUT */}
      <form onSubmit={handleSubmit}>
        <Card className={`border-slate-200 shadow-sm overflow-hidden transition-colors duration-300 ${type === 'income' ? 'bg-emerald-50/30' : 'bg-rose-50/30'}`}>
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Nominal {type === "expense" ? "Pengeluaran" : "Pemasukan"}
            </CardTitle>
            <div className="flex items-center text-4xl font-extrabold tracking-tighter">
              <span className={`mr-2 ${type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>Rp</span>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-300"
                disabled={isSubmitting}
                autoFocus
              />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4 border-t border-slate-100/50 pt-4 bg-white">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Kategori</label>
              <Input 
                placeholder={type === 'income' ? "Contoh: Penjualan, Modal, dll" : "Contoh: Bahan Baku, Listrik, dll"} 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
                className="bg-slate-50 h-12 rounded-xl" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Catatan (Opsional)</label>
              <Input 
                placeholder="Tulis detail transaksi..." 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isSubmitting}
                className="bg-slate-50 h-12 rounded-xl" 
              />
            </div>

            <Button 
              type="submit" 
              className={`w-full mt-6 h-12 text-md font-bold rounded-xl transition-all ${
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