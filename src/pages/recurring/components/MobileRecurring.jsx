import { useRecurring } from '../../../hooks/useRecurring';
import { useMode } from '../../../contexts/ModeContext';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { formatIDR } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import AnimatedContent from '../../../components/ui/AnimatedContent';
import { RefreshCw, Plus, ArrowUpCircle, ArrowDownCircle, Calendar, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

const FREQ_LABEL = {
  daily: 'Harian',
  weekly: 'Mingguan',
  monthly: 'Bulanan',
  yearly: 'Tahunan',
};

export default function MobileRecurring() {
  const { mode } = useMode();
  const { confirmDialog } = useConfirm();
  const { recurring, loading, error, addRecurring, removeRecurring } = useRecurring();
  const isPersonal = mode === 'personal';
  const accentColor = isPersonal ? 'purple' : 'blue';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ description: '', amount: '', type: 'expense', frequency: 'monthly', next_date: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.next_date) return;
    setSubmitting(true);
    try {
      await addRecurring({
        ...formData,
        amount: Number(formData.amount),
      });
      toast.success('Transaksi berulang berhasil ditambahkan!');
      setIsModalOpen(false);
      setFormData({ description: '', amount: '', type: 'expense', frequency: 'monthly', next_date: '' });
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Gagal menambahkan langganan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    confirmDialog({
      title: 'Hapus Otomatisasi',
      description: 'Yakin ingin menghapus otomatisasi ini?',
      onConfirm: async () => {
        try {
          await removeRecurring(id);
          toast.success('Dihapus');
        } catch (err) {
          toast.error('Gagal menghapus');
        }
      }
    });
  };

  return (
    <div className="p-4 space-y-4">
      <AnimatedContent direction="vertical" delay={0}>
        <div className="flex flex-col gap-4 mb-2">
          <div className="flex items-center gap-2 pr-24">
            <RefreshCw className={`w-6 h-6 text-${accentColor}-600`} />
            <h1 className="text-xl font-bold leading-tight">Transaksi Berulang</h1>
          </div>
          <button onClick={() => setIsModalOpen(true)} className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl text-white bg-${accentColor}-600 shadow-lg font-bold`}>
            <Plus className="w-5 h-5" /> Tambah Transaksi
          </button>
        </div>
      </AnimatedContent>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground text-sm">Memuat...</div>
      ) : error ? (
        <div className="p-8 text-center text-red-500 text-sm">Gagal memuat data</div>
      ) : recurring.length === 0 ? (
        <AnimatedContent direction="vertical" delay={100}>
          <div className="p-8 text-center text-muted-foreground">
            <RefreshCw className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">Belum ada transaksi berulang</p>
          </div>
        </AnimatedContent>
      ) : (
        <div className="space-y-3">
          {recurring.map((item, i) => (
            <AnimatedContent key={item.id} direction="vertical" delay={100 + i * 60}>
              <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                      {item.type === 'income'
                        ? <ArrowDownCircle className="w-4 h-4 text-emerald-500" />
                        : <ArrowUpCircle className="w-4 h-4 text-red-500" />
                      }
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.description}</p>
                      <p className={`text-xs font-bold ${item.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {formatIDR(item.amount)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${item.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
                      {FREQ_LABEL[item.frequency] || item.frequency}
                    </span>
                    {item.next_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formatDate(item.next_date)}
                      </span>
                    )}
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>
      )}

      {/* Add Recurring Modal (Mobile) */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center sm:p-4 animate-in fade-in duration-200">
          <div className="w-full sm:max-w-md bg-card border-t sm:border border-border shadow-2xl rounded-t-3xl sm:rounded-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-card/90 backdrop-blur-md p-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Otomatisasi Baru</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-accent text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold">Tipe Transaksi</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center gap-2 border rounded-xl py-2.5 cursor-pointer transition-colors ${formData.type === 'expense' ? 'bg-red-600 border-red-600 text-white shadow-md' : 'border-border hover:bg-accent text-muted-foreground'}`}>
                    <input type="radio" className="hidden" checked={formData.type === 'expense'} onChange={() => setFormData({...formData, type: 'expense'})} />
                    <ArrowUpCircle className="w-4 h-4" />
                    <span className="text-sm font-bold">Pengeluaran</span>
                  </label>
                  <label className={`flex items-center justify-center gap-2 border rounded-xl py-2.5 cursor-pointer transition-colors ${formData.type === 'income' ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'border-border hover:bg-accent text-muted-foreground'}`}>
                    <input type="radio" className="hidden" checked={formData.type === 'income'} onChange={() => setFormData({...formData, type: 'income'})} />
                    <ArrowDownCircle className="w-4 h-4" />
                    <span className="text-sm font-bold">Pemasukan</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold">Nama Tagihan/Langganan</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Netflix, Kost..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                  className="w-full px-3 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold">Siklus berulang</label>
                  <select 
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    className="w-full px-3 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="daily">Harian</option>
                    <option value="weekly">Mingguan</option>
                    <option value="monthly">Bulanan</option>
                    <option value="yearly">Tahunan</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold">Tanggal Tagihan</label>
                  <input 
                    type="date" 
                    required
                    value={formData.next_date}
                    onChange={(e) => setFormData({...formData, next_date: e.target.value})}
                    className="w-full px-3 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="pt-4 pb-2">
                <button type="submit" disabled={submitting} className={`w-full py-3.5 rounded-xl text-white text-sm font-bold bg-${accentColor}-600 active:bg-${accentColor}-700 transition-colors shadow-lg disabled:opacity-50`}>
                  {submitting ? 'Menyimpan...' : 'Simpan Otomatisasi'}
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
