import { useRecurring } from '../../../hooks/useRecurring';
import { useMode } from '../../../contexts/ModeContext';
import { formatIDR } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import AnimatedContent from '../../../components/ui/AnimatedContent';
import { RefreshCw, Plus, ArrowUpCircle, ArrowDownCircle, Calendar } from 'lucide-react';

const FREQ_LABEL = {
  daily: 'Harian',
  weekly: 'Mingguan',
  monthly: 'Bulanan',
  yearly: 'Tahunan',
};

export default function MobileRecurring() {
  const { mode } = useMode();
  const { recurring, loading, error } = useRecurring();
  const isPersonal = mode === 'personal';
  const accentColor = isPersonal ? 'purple' : 'blue';

  return (
    <div className="p-4 space-y-4">
      <AnimatedContent direction="vertical" delay={0}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className={`w-6 h-6 text-${accentColor}-600`} />
            <h1 className="text-xl font-bold">Transaksi Berulang</h1>
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
              </div>
            </AnimatedContent>
          ))}
        </div>
      )}
    </div>
  );
}
