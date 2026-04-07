import { useGoals } from '../../../hooks/useGoals';
import { useMode } from '../../../contexts/ModeContext';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { formatIDR } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import AnimatedContent from '../../../components/ui/AnimatedContent';
import { Target, Plus, Trash2, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

export default function DesktopGoals() {
  const { mode } = useMode();
  const { confirmDialog } = useConfirm();
  const { goals, loading, error, addGoal, removeGoal } = useGoals();
  const isPersonal = mode === 'personal';
  const accentColor = isPersonal ? 'purple' : 'blue';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', target_amount: '', deadline: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.target_amount) return;
    setSubmitting(true);
    try {
      await addGoal({
        ...formData,
        target_amount: Number(formData.target_amount),
        current_amount: 0,
        deadline: formData.deadline || null
      });
      toast.success('Target tabungan berhasil dibuat!');
      setIsModalOpen(false);
      setFormData({ name: '', target_amount: '', deadline: '' });
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Gagal membuat target');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    confirmDialog({
      title: 'Hapus Target',
      description: 'Yakin ingin menghapus tujuan menabung ini?',
      onConfirm: async () => {
        try {
          await removeGoal(id);
          toast.success('Tujuan dihapus');
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
            <Target className={`w-8 h-8 text-${accentColor}-600`} />
            <h1 className="text-2xl font-bold">Tujuan Keuangan</h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold bg-${accentColor}-600 hover:bg-${accentColor}-700 transition-colors shadow-lg`}
          >
            <Plus className="w-4 h-4" /> Buat Target
          </button>
        </div>
      </AnimatedContent>

      {loading ? (
        <div className="p-12 text-center text-muted-foreground">Memuat data...</div>
      ) : error ? (
        <div className="p-12 text-center text-red-500">Gagal memuat data</div>
      ) : goals.length === 0 ? (
        <AnimatedContent direction="vertical" delay={100}>
          <div className="p-12 text-center text-muted-foreground bg-card border border-border rounded-2xl shadow-sm">
            <Target className="w-14 h-14 mx-auto mb-3 opacity-30" />
            <p className="font-medium text-lg">Belum ada tujuan keuangan</p>
            <p className="text-sm mt-1">Mulai dengan membuat target tabungan pertamamu!</p>
          </div>
        </AnimatedContent>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal, i) => {
            const progress = goal.target_amount > 0
              ? Math.min(100, Math.round((Number(goal.current_amount || 0) / Number(goal.target_amount)) * 100))
              : 0;

            return (
              <AnimatedContent key={goal.id} direction="vertical" delay={100 + i * 80}>
                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${accentColor}-100 dark:bg-${accentColor}-900/30`}>
                        <Target className={`w-5 h-5 text-${accentColor}-600`} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{goal.name}</p>
                        {goal.deadline && (
                          <p className="text-[11px] text-muted-foreground">Target: {formatDate(goal.deadline)}</p>
                        )}
                      </div>
                    </div>
                    <button onClick={() => handleDelete(goal.id)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{formatIDR(goal.current_amount || 0)}</span>
                      <span className="font-semibold">{formatIDR(goal.target_amount)}</span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${isPersonal ? 'from-purple-500 to-pink-500' : 'from-blue-500 to-cyan-400'} transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{progress}% tercapai</span>
                    </div>
                  </div>
                </div>
              </AnimatedContent>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card border border-border shadow-2xl rounded-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div>
                <h2 className="text-lg font-bold">Target Tabungan Baru</h2>
                <p className="text-xs text-muted-foreground">Tentukan tujuan keuanganmu</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-accent text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold">Nama Tujuan</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Beli Laptop Baru, Liburan..."
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold">Target Jumlah (Rp)</label>
                <input 
                  type="number" 
                  min="0"
                  required
                  placeholder="0"
                  value={formData.target_amount}
                  onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold">Tenggat Waktu <span className="text-muted-foreground font-normal">(Opsional)</span></label>
                <input 
                  type="date" 
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
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
