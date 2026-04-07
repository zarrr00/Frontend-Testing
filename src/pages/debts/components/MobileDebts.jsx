import { useDebts } from '../../../hooks/useDebts';
import { useMode } from '../../../contexts/ModeContext';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { formatIDR } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import AnimatedContent from '../../../components/ui/AnimatedContent';
import { HandCoins, ArrowUpCircle, ArrowDownCircle, Plus, CreditCard, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

export default function MobileDebts() {
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
    <div className="p-4 space-y-4">
      <AnimatedContent direction="vertical" delay={0}>
        <div className="flex flex-col gap-4 mb-2">
          <div className="flex items-center gap-2 pr-24">
            <HandCoins className={`w-6 h-6 text-${accentColor}-600`} />
            <h1 className="text-xl font-bold">Hutang & Piutang</h1>
          </div>
          <button onClick={() => setIsModalOpen(true)} className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl text-white bg-${accentColor}-600 shadow-lg font-bold`}>
            <Plus className="w-5 h-5" /> Catat Hutang / Piutang
          </button>
        </div>
      </AnimatedContent>

      {/* Summary */}
      <AnimatedContent direction="vertical" delay={100}>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <ArrowUpCircle className="w-5 h-5 text-red-500 mb-1" />
            <p className="text-xs text-muted-foreground">Hutang</p>
            <p className="text-lg font-bold text-red-500">{formatIDR(totalPayable)}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <ArrowDownCircle className="w-5 h-5 text-emerald-500 mb-1" />
            <p className="text-xs text-muted-foreground">Piutang</p>
            <p className="text-lg font-bold text-emerald-500">{formatIDR(totalReceivable)}</p>
          </div>
        </div>
      </AnimatedContent>

      {/* List */}
      <AnimatedContent direction="vertical" delay={200}>
        <div className="space-y-3">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Memuat...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500 text-sm">Gagal memuat data</div>
          ) : debts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <HandCoins className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">Belum ada data</p>
            </div>
          ) : (
            debts.map(debt => (
              <div key={debt.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${debt.type === 'payable' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
                    {debt.type === 'payable'
                      ? <ArrowUpCircle className="w-4 h-4 text-red-500" />
                      : <ArrowDownCircle className="w-4 h-4 text-emerald-500" />
                    }
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{debt.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {debt.type === 'payable' ? 'Hutang' : 'Piutang'}
                      {debt.due_date && ` • ${formatDate(debt.due_date)}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${debt.type === 'payable' ? 'text-red-500' : 'text-emerald-500'}`}>
                    {formatIDR(debt.amount)}
                  </p>
                  <div className="flex items-center gap-2 mt-1 justify-end">
                    <button className="text-[10px] text-muted-foreground flex items-center gap-1 p-1 hover:bg-accent rounded">
                      <CreditCard className="w-3 h-3" /> Bayar
                    </button>
                    <button onClick={() => handleDelete(debt.id)} className="text-[10px] text-red-500 flex items-center gap-1 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </AnimatedContent>

      {/* Add Debt Modal (Mobile) */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center sm:p-4 animate-in fade-in duration-200">
          <div className="w-full sm:max-w-md bg-card border-t sm:border border-border shadow-2xl rounded-t-3xl sm:rounded-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-card/90 backdrop-blur-md p-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Catat Hutang/Piutang</h2>
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
                    <span className="text-xs font-bold whitespace-nowrap">Hutang (Bayar)</span>
                  </label>
                  <label className={`flex items-center justify-center gap-2 border rounded-xl py-2.5 cursor-pointer transition-colors ${formData.type === 'receivable' ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'border-border hover:bg-accent text-muted-foreground'}`}>
                    <input type="radio" className="hidden" checked={formData.type === 'receivable'} onChange={() => setFormData({...formData, type: 'receivable'})} />
                    <ArrowDownCircle className="w-4 h-4" />
                    <span className="text-xs font-bold whitespace-nowrap">Piutang (Terima)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold">Nama / Keterangan</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Teman, Saudara, dsb..."
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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

              <div className="space-y-1.5">
                <label className="text-sm font-bold">Tenggat Waktu <span className="text-muted-foreground font-normal">(Opsional)</span></label>
                <input 
                  type="date" 
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  className="w-full px-3 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="pt-4 pb-2">
                <button type="submit" disabled={submitting} className={`w-full py-3.5 rounded-xl text-white text-sm font-bold bg-${accentColor}-600 active:bg-${accentColor}-700 transition-colors shadow-lg disabled:opacity-50`}>
                  {submitting ? 'Menyimpan...' : 'Simpan Pencatatan'}
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
