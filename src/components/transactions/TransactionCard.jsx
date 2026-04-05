import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, Calendar, Trash2 } from "lucide-react";
import { formatIDR } from "@/utils/currency";
import { formatDate } from "@/utils/date";

export default function TransactionCard({ trx, onDelete }) {
  const isIncome = trx.type === 'income';
  return (
    <Card className="bg-card border-border shadow-sm overflow-hidden hover:bg-accent transition-colors cursor-pointer group">
      <CardContent className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${isIncome ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
            {isIncome ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-sm font-bold">{trx.name}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
              <span className="bg-muted px-1.5 py-0.5 rounded font-medium">{trx.category}</span>
              <Calendar className="w-3 h-3 ml-1" />
              {formatDate(trx.date)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right flex flex-col items-end">
            <p className={`text-sm font-bold ${isIncome ? 'text-emerald-500' : 'text-foreground'}`}>
              {isIncome ? '+' : '-'}{formatIDR(trx.amount)}
            </p>
            <p className="text-[10px] text-muted-foreground line-clamp-1 max-w-[120px] mt-0.5 ml-auto">
              {trx.notes || "-"}
            </p>
          </div>
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(trx.id); }}
              className="p-1.5 text-muted-foreground/40 hover:bg-rose-500/10 hover:text-rose-500 rounded-md transition-colors"
              title="Hapus Transaksi"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
