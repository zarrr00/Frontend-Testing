import { useGoals } from '../../../hooks/useGoals';
import { useMode } from '../../../contexts/ModeContext';
import { formatIDR } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import AnimatedContent from '../../../components/ui/AnimatedContent';
import { Target, Plus, Trash2, TrendingUp } from 'lucide-react';

export default function DesktopGoals() {
  const { mode } = useMode();
  const { goals, loading, error } = useGoals();
  const isPersonal = mode === 'personal';
  const accentColor = isPersonal ? 'purple' : 'blue';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <AnimatedContent direction="vertical" delay={0}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className={`w-8 h-8 text-${accentColor}-600`} />
            <h1 className="text-2xl font-bold">Tujuan Keuangan</h1>
          </div>
          <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold bg-${accentColor}-600 hover:bg-${accentColor}-700 transition-colors shadow-lg`}>
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
                    <button className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors">
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
    </div>
  );
}
