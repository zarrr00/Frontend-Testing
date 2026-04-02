import { useRecurring } from '../../../hooks/useRecurring';
import { useMode } from '../../../contexts/ModeContext';
import { formatIDR } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import AnimatedContent from '../../../components/ui/AnimatedContent';
import { RefreshCw, Plus, Trash2, ArrowUpCircle, ArrowDownCircle, Calendar } from 'lucide-react';

const FREQ_LABEL = {
  daily: 'Harian',
  weekly: 'Mingguan',
  monthly: 'Bulanan',
  yearly: 'Tahunan',
};

export default function DesktopRecurring() {
  const { mode } = useMode();
  const { recurring, loading, error } = useRecurring();
  const isPersonal = mode === 'personal';
  const accentColor = isPersonal ? 'purple' : 'blue';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <AnimatedContent direction="vertical" delay={0}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RefreshCw className={`w-8 h-8 text-${accentColor}-600`} />
            <h1 className="text-2xl font-bold">Transaksi Berulang</h1>
          </div>
          <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold bg-${accentColor}-600 hover:bg-${accentColor}-700 transition-colors shadow-lg`}>
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
                    <button className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors" title="Hapus">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AnimatedContent>
    </div>
  );
}
