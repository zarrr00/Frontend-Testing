import { useDebts } from '../../../hooks/useDebts';
import { useMode } from '../../../contexts/ModeContext';
import { formatIDR } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import AnimatedContent from '../../../components/ui/AnimatedContent';
import { HandCoins, ArrowUpCircle, ArrowDownCircle, Plus, CreditCard } from 'lucide-react';

export default function MobileDebts() {
  const { mode } = useMode();
  const { debts, loading, error } = useDebts();
  const isPersonal = mode === 'personal';
  const accentColor = isPersonal ? 'purple' : 'blue';

  const payable = debts.filter(d => d.type === 'payable');
  const receivable = debts.filter(d => d.type === 'receivable');
  const totalPayable = payable.reduce((s, d) => s + Number(d.amount || 0), 0);
  const totalReceivable = receivable.reduce((s, d) => s + Number(d.amount || 0), 0);

  return (
    <div className="p-4 space-y-4">
      <AnimatedContent direction="vertical" delay={0}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HandCoins className={`w-6 h-6 text-${accentColor}-600`} />
            <h1 className="text-xl font-bold">Hutang & Piutang</h1>
          </div>
          <button className={`p-2 rounded-xl text-white bg-${accentColor}-600 shadow-lg`}>
            <Plus className="w-5 h-5" />
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
                  <button className="mt-1 text-[10px] text-muted-foreground flex items-center gap-1 ml-auto">
                    <CreditCard className="w-3 h-3" /> Bayar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </AnimatedContent>
    </div>
  );
}
