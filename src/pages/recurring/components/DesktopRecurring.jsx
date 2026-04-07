import { useRecurring } from '../../../hooks/useRecurring';
import { useMode } from '../../../contexts/ModeContext';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { formatIDR } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import AnimatedContent from '../../../components/ui/AnimatedContent';
import { RefreshCw, Plus, Trash2, ArrowUpCircle, ArrowDownCircle, Calendar, X } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

const FREQ_LABEL = {
  daily: 'Harian',
  weekly: 'Mingguan',
  monthly: 'Bulanan',
  yearly: 'Tahunan',
};

export default function DesktopRecurring() {
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <AnimatedContent direction="vertical" delay={0}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RefreshCw className={`w-8 h-8 text-${accentColor}-600`} />
            <h1 className="text-2xl font-bold">Transaksi Berulang</h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold bg-${accentColor}-600 hover:bg-${accentColor}-700 transition-colors shadow-lg`}
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>
      </AnimatedContent>

      <AnimatedContent direction="vertical" delay={100}>
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Daftar Transaksi Otomatis</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Memuat data...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">Gagal memuat data</div>
          ) : recurring.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <RefreshCw className="w-14 h-14 mx-auto mb-3 opacity-30" />
              <p className="font-medium text-lg">Belum ada transaksi berulang</p>
              <p className="text-sm mt-1">Otomatiskan tagihan, langganan, atau cicilan bulananmu</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recurring.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                      {item.type === 'income'
                        ? <ArrowDownCircle className="w-5 h-5 text-emerald-500" />
                        : <ArrowUpCircle className="w-5 h-5 text-red-500" />
                      }
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
                          {item.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {FREQ_LABEL[item.frequency] || item.frequency}
                        </span>
                        {item.next_date && <span>• Berikutnya: {formatDate(item.next_date)}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold text-sm ${item.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {formatIDR(item.amount)}
                    </span>
                    <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors" title="Hapus">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AnimatedContent>

      {/* Add Recurring Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div>
                <h2 className="text-lg font-bold">Otomatisasi Baru</h2>
                <p className="text-xs text-muted-foreground">Catat transaksi yang berulang otomatis</p>
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
                  placeholder="Contoh: Netflix, Gaji Karyawan, Kost..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold">Siklus berulang</label>
                  <select 
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-bold hover:bg-accent transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={submitting} className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold bg-${accentColor}-600 hover:bg-${accentColor}-700 transition-colors shadow-lg disabled:opacity-50`}>
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
