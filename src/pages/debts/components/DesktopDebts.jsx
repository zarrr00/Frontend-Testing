import { useDebts } from '../../../hooks/useDebts';
import { useMode } from '../../../contexts/ModeContext';
import { formatIDR } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import AnimatedContent from '../../../components/ui/AnimatedContent';
import { HandCoins, ArrowUpCircle, ArrowDownCircle, Plus, Trash2, CreditCard } from 'lucide-react';

export default function DesktopDebts() {
  const { mode } = useMode();
  const { debts, loading, error } = useDebts();
  const isPersonal = mode === 'personal';
  const accentColor = isPersonal ? 'purple' : 'blue';

  const payable = debts.filter(d => d.type === 'payable');
  const receivable = debts.filter(d => d.type === 'receivable');
  const totalPayable = payable.reduce((s, d) => s + Number(d.amount || 0), 0);
  const totalReceivable = receivable.reduce((s, d) => s + Number(d.amount || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <AnimatedContent direction="vertical" delay={0}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HandCoins className={`w-8 h-8 text-${accentColor}-600`} />
            <h1 className="text-2xl font-bold">Hutang & Piutang</h1>
          </div>
          <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold bg-${accentColor}-600 hover:bg-${accentColor}-700 transition-colors shadow-lg`}>
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
