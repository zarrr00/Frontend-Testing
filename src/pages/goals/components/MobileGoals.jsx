import { useGoals } from '../../../hooks/useGoals';
import { useMode } from '../../../contexts/ModeContext';
import { formatIDR } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import AnimatedContent from '../../../components/ui/AnimatedContent';
import { Target, Plus, TrendingUp } from 'lucide-react';

export default function MobileGoals() {
  const { mode } = useMode();
  const { goals, loading, error } = useGoals();
  const isPersonal = mode === 'personal';
  const accentColor = isPersonal ? 'purple' : 'blue';

  return (
    <div className="p-4 space-y-4">
      <AnimatedContent direction="vertical" delay={0}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className={`w-6 h-6 text-${accentColor}-600`} />
            <h1 className="text-xl font-bold">Tujuan Keuangan</h1>
          </div>
          <button className={`p-2 rounded-xl text-white bg-${accentColor}-600 shadow-lg`}>
            <Plus className="w-5 h-5" />
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
                    <div className="flex items-center gap-1 text-xs font-semibold">
                      <TrendingUp className="w-3 h-3" /> {progress}%
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
    </div>
  );
}
