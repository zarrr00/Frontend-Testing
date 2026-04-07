import { useDebts } from '../../../hooks/useDebts';
import { useMode } from '../../../contexts/ModeContext';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { formatIDR } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import AnimatedContent from '../../../components/ui/AnimatedContent';
import { HandCoins, ArrowUpCircle, ArrowDownCircle, Plus, Trash2, CreditCard, X } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

export default function DesktopDebts() {
  const { mode } = useMode();
  const { confirmDialog } = useConfirm();
  const { debts, loading, error, addDebt, removeDebt } = useDebts();
  const isPersonal = mode === 'personal';
  const accentColor = isPersonal ? 'purple' : 'blue';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', amount: '', type: 'payable', due_date: '' });
  const [submitting, setSubmitting] = useState(false);

  const payable = debts.filter(d => d.type === 'payable');
  const receivable = debts.filter(d => d.type === 'receivable');
  const totalPayable = payable.reduce((s, d) => s + Number(d.amount || 0), 0);
  const totalReceivable = receivable.reduce((s, d) => s + Number(d.amount || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;
    setSubmitting(true);
    try {
      await addDebt({
        ...formData,
        amount: Number(formData.amount),
        due_date: formData.due_date || null
      });
      toast.success('Pencatatan berhasil ditambahkan!');
      setIsModalOpen(false);
      setFormData({ name: '', amount: '', type: 'payable', due_date: '' });
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Gagal menambahkan data');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    confirmDialog({
      title: 'Hapus Pencatatan',
      description: 'Yakin ingin menghapus catatan ini?',
      onConfirm: async () => {
        try {
          await removeDebt(id);
          toast.success('Catatan dihapus');
        } catch (err) {
          toast.error('Gagal menghapus');
        }
      }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <AnimatedContent direction="vertical" delay={0}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HandCoins className={`w-8 h-8 text-${accentColor}-600`} />
            <h1 className="text-2xl font-bold">Hutang & Piutang</h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold bg-${accentColor}-600 hover:bg-${accentColor}-700 transition-colors shadow-lg`}
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>
      </AnimatedContent>

      {/* Summary Cards */}
      <AnimatedContent direction="vertical" delay={100}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <ArrowUpCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-muted-foreground">Total Hutang</span>
            </div>
            <p className="text-2xl font-bold text-red-500">{formatIDR(totalPayable)}</p>
            <p className="text-xs text-muted-foreground mt-1">{payable.length} catatan</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <ArrowDownCircle className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-medium text-muted-foreground">Total Piutang</span>
            </div>
            <p className="text-2xl font-bold text-emerald-500">{formatIDR(totalReceivable)}</p>
            <p className="text-xs text-muted-foreground mt-1">{receivable.length} catatan</p>
          </div>
        </div>
      </AnimatedContent>

      {/* Debt List */}
      <AnimatedContent direction="vertical" delay={200}>
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Daftar Hutang & Piutang</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Memuat data...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">Gagal memuat data</div>
          ) : debts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <HandCoins className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Belum ada data hutang/piutang</p>
              <p className="text-sm mt-1">Klik tombol "Tambah" untuk mencatat</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {debts.map(debt => (
                <div key={debt.id} className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${debt.type === 'payable' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
                      {debt.type === 'payable'
                        ? <ArrowUpCircle className="w-5 h-5 text-red-500" />
                        : <ArrowDownCircle className="w-5 h-5 text-emerald-500" />
                      }
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{debt.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {debt.type === 'payable' ? 'Hutang' : 'Piutang'}
                        {debt.due_date && ` • Jatuh tempo: ${formatDate(debt.due_date)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold text-sm ${debt.type === 'payable' ? 'text-red-500' : 'text-emerald-500'}`}>
                      {formatIDR(debt.amount)}
                    </span>
                    <button className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" title="Bayar">
                      <CreditCard className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(debt.id)} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors" title="Hapus">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AnimatedContent>

      {/* Add Debt Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div>
                <h2 className="text-lg font-bold">Catat Hutang/Piutang</h2>
                <p className="text-xs text-muted-foreground">Isi rincian transaksi baru</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-accent text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold">Tipe Pencatatan</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center gap-2 border rounded-xl py-2.5 cursor-pointer transition-colors ${formData.type === 'payable' ? 'bg-red-600 border-red-600 text-white shadow-md' : 'border-border hover:bg-accent text-muted-foreground'}`}>
                    <input type="radio" className="hidden" checked={formData.type === 'payable'} onChange={() => setFormData({...formData, type: 'payable'})} />
                    <ArrowUpCircle className="w-4 h-4" />
                    <span className="text-sm font-bold">Hutang (Bayar)</span>
                  </label>
                  <label className={`flex items-center justify-center gap-2 border rounded-xl py-2.5 cursor-pointer transition-colors ${formData.type === 'receivable' ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'border-border hover:bg-accent text-muted-foreground'}`}>
                    <input type="radio" className="hidden" checked={formData.type === 'receivable'} onChange={() => setFormData({...formData, type: 'receivable'})} />
                    <ArrowDownCircle className="w-4 h-4" />
                    <span className="text-sm font-bold">Piutang (Terima)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold">Sama Siapa (Nama)</label>
                <input 
                  type="text" 
                  required
                  placeholder={formData.type === 'payable' ? "Contoh: Budi (Saya pinjam ruangannya)" : "Contoh: Andi (Dia pinjam uang)"}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold">Jumlah Uang (Rp)</label>
                <input 
                  type="number" 
                  min="0"
                  required
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold">Tenggat Waktu <span className="text-muted-foreground font-normal">(Opsional)</span></label>
                <input 
                  type="date" 
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-bold hover:bg-accent transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={submitting} className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold bg-${accentColor}-600 hover:bg-${accentColor}-700 transition-colors shadow-lg disabled:opacity-50`}>
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
