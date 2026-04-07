import { useGoals } from '../../../hooks/useGoals';
import { useMode } from '../../../contexts/ModeContext';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { formatIDR } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import AnimatedContent from '../../../components/ui/AnimatedContent';
import { Target, Plus, TrendingUp, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

export default function MobileGoals() {
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
    <div className="p-4 space-y-4">
      <AnimatedContent direction="vertical" delay={0}>
        <div className="flex flex-col gap-4 mb-2">
          <div className="flex items-center gap-2 pr-24">
            <Target className={`w-6 h-6 text-${accentColor}-600`} />
            <h1 className="text-xl font-bold">Tujuan Keuangan</h1>
          </div>
          <button onClick={() => setIsModalOpen(true)} className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl text-white bg-${accentColor}-600 shadow-lg font-bold`}>
            <Plus className="w-5 h-5" /> Buat Target Baru
          </button>
        </div>
      </AnimatedContent>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground text-sm">Memuat...</div>
      ) : error ? (
        <div className="p-8 text-center text-red-500 text-sm">Gagal memuat data</div>
      ) : goals.length === 0 ? (
        <AnimatedContent direction="vertical" delay={100}>
          <div className="p-8 text-center text-muted-foreground">
            <Target className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">Belum ada target</p>
          </div>
        </AnimatedContent>
      ) : (
        <div className="space-y-3">
          {goals.map((goal, i) => {
            const progress = goal.target_amount > 0
              ? Math.min(100, Math.round((Number(goal.current_amount || 0) / Number(goal.target_amount)) * 100))
              : 0;

            return (
              <AnimatedContent key={goal.id} direction="vertical" delay={100 + i * 60}>
                <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-${accentColor}-100 dark:bg-${accentColor}-900/30`}>
                      <Target className={`w-4 h-4 text-${accentColor}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{goal.name}</p>
                      {goal.deadline && (
                        <p className="text-[11px] text-muted-foreground">{formatDate(goal.deadline)}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-[10px] font-semibold bg-accent px-1.5 py-0.5 rounded text-muted-foreground mr-1">
                        <TrendingUp className="w-3 h-3" /> {progress}%
                      </div>
                      <button onClick={() => handleDelete(goal.id)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${isPersonal ? 'from-purple-500 to-pink-500' : 'from-blue-500 to-cyan-400'} transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>{formatIDR(goal.current_amount || 0)}</span>
                    <span className="font-semibold text-foreground">{formatIDR(goal.target_amount)}</span>
                  </div>
                </div>
              </AnimatedContent>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal (Mobile) */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center sm:p-4 animate-in fade-in duration-200">
          <div className="w-full sm:max-w-md bg-card border-t sm:border border-border shadow-2xl rounded-t-3xl sm:rounded-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-card/90 backdrop-blur-md p-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Target Baru</h2>
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
                  placeholder="Contoh: Dana Darurat..."
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                  className="w-full px-3 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold">Tenggat Waktu <span className="text-muted-foreground font-normal">(Opsional)</span></label>
                <input 
                  type="date" 
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  className="w-full px-3 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="pt-4 pb-2">
                <button type="submit" disabled={submitting} className={`w-full py-3.5 rounded-xl text-white text-sm font-bold bg-${accentColor}-600 active:bg-${accentColor}-700 transition-colors shadow-lg disabled:opacity-50`}>
                  {submitting ? 'Menyimpan...' : 'Buat Target'}
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
