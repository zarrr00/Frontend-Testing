import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Loader2, ArrowDownCircle, ArrowUpCircle, Camera, Sparkles } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { transactionService } from "@/services/transaction.service";
import { useCategories } from "@/hooks/useCategories";
import { useOCR } from "@/hooks/useOCR";

export default function AddTransaction() {
  const location = useLocation();
  const navigate = useNavigate();

  const [type, setType] = useState("expense");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch real categories from backend API
  const { incomeCategories, expenseCategories, loading: categoriesLoading } = useCategories();

  // OCR Hooks and Ref
  const fileInputRef = useRef(null);
  const { scanReceipt, isScanning } = useOCR();

  const handleScanClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await scanReceipt(file);
      const ocrData = result.data;
      if (ocrData.suggested_total) {
        setAmount(ocrData.suggested_total.toString());
      }
      if (ocrData.suggested_date) {
         setDate(ocrData.suggested_date);
      }
      if (ocrData.extracted_text) {
         setNotes(`[Hasil Scan Struk]:\n${ocrData.extracted_text}\n\nURL Bukti: ${ocrData.url}`);
      }
      toast.success("Berhasil memindai struk canggih!");
      setType("expense"); // Struk usually implies expense
      e.target.value = ''; // Reset input to allow scanning the same file again if needed
    } catch (err) {
      toast.error(err?.message || "Gagal memindai gambar.");
    }
  };

  // Sync form state with router navigation params (type from quick-action, amount from OCR)
  useEffect(() => {
    if (location.state?.type) {
      setType(location.state.type);
      setCategory("");
    }
    if (location.state?.amount) {
      setAmount(location.state.amount);
      if (location.state.description) setNotes(location.state.description);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Nama transaksi belum diisi!");
    if (!amount || amount <= 0) return toast.error("Nominal tidak boleh kosong!");
    if (!category.trim()) return toast.error("Kategori belum diisi!");

    setIsSubmitting(true);
    try {
      const payload = {
        type,
        amount: Number(amount),
        description: name,
        note: notes,
        date,
        category_id: category,
      };
      await transactionService.createTransaction(payload);
      toast.success(`Berhasil mencatat ${type === 'income' ? "Pemasukan" : "Pengeluaran"}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.toString() || "Gagal menyimpan transaksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCategories = type === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-xl mx-auto w-full animate-in fade-in zoom-in-95 duration-300 transition-colors">
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight">Catat Transaksi</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Masukkan nominal kas baru di sini.</p>
      </header>

      {/* Transaction type toggle */}
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

      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
      
      {/* OCR Magic Button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={handleScanClick}
          disabled={isScanning || isSubmitting}
          className="w-full relative overflow-hidden group flex items-center justify-between gap-3 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center gap-3 relative z-10 w-full">
            <div className={`p-2.5 bg-white/20 rounded-xl backdrop-blur-md border border-white/10 ${isScanning ? 'animate-pulse' : ''}`}>
              {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
            </div>
            <div className="text-left flex-1 min-w-0">
              <h3 className="font-bold text-[15px] tracking-wide">
                {isScanning ? 'Sedang Memindai...' : 'Pindai Struk dengan AI'}
              </h3>
              <p className="text-[11px] text-blue-50 font-medium opacity-90 line-clamp-1">
                {isScanning ? 'Membaca nominal dan data...' : 'Ambil foto struk untuk isi otomatis'}
              </p>
            </div>
          </div>
          {!isScanning && (
            <div className="flex-shrink-0 relative z-10 p-1.5 bg-indigo-800/30 rounded-full">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-shimmer" />
        </button>
      </div>

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
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Tanggal &amp; Waktu</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isSubmitting}
                className="bg-background h-12 rounded-xl border-border"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Nama Transaksi</label>
              <Input
                type="text"
                placeholder="Contoh: Beli Token Listrik, Gaji..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="bg-background h-12 rounded-xl border-border px-3"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting || categoriesLoading}
                className="w-full bg-background h-12 rounded-xl border border-border px-3 text-sm text-foreground outline-none focus-visible:ring-1 focus-visible:ring-primary transition-shadow"
              >
                <option value="" disabled className="bg-card">
                  {categoriesLoading ? "Memuat kategori..." : "Pilih Kategori"}
                </option>
                {activeCategories.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-card">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Catatan</label>
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
                `Simpan Transaksi ${type === 'income' ? "Pemasukan" : "Pengeluaran"}`
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}