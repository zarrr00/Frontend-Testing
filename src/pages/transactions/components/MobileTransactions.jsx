import { FileQuestion } from "lucide-react";
import AnimatedContent from "@/components/ui/AnimatedContent";
import TransactionCard from "@/components/transactions/TransactionCard";
import TransactionSearchBox from "@/components/transactions/TransactionSearchBox";
import TransactionExportMenu from "@/components/transactions/TransactionExportMenu";
import { handleExportPDF, handleExportCSV } from "@/utils/export";

export default function MobileTransactions({ searchQuery, setSearchQuery, filteredTransactions, onDelete }) {
  return (
    <div className="pb-24 bg-background text-foreground p-4 space-y-4 animate-in fade-in zoom-in-95 duration-300 transition-colors w-full" id="snap-main-container">
      <AnimatedContent distance={30} delay={0.1} direction="vertical">
        <header className="mb-4">
          <h1 className="text-xl font-bold tracking-tight">Transaksi</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pantau semua pengeluaran dan pemasukanmu.
          </p>
        </header>
      </AnimatedContent>
      <AnimatedContent distance={40} delay={0.2} direction="vertical">
        <div className="flex gap-2 mb-6">
          <TransactionSearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <TransactionExportMenu
            onExportPDF={() => handleExportPDF(filteredTransactions)}
            onExportCSV={() => handleExportCSV(filteredTransactions)}
          />
        </div>
      </AnimatedContent>
      <AnimatedContent distance={40} delay={0.3} direction="vertical">
        <div className="space-y-3 pb-6">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((trx, i) => (
              <AnimatedContent key={trx.id} distance={20} delay={0.4 + (i * 0.1)} direction="vertical">
                <TransactionCard trx={trx} onDelete={onDelete} />
              </AnimatedContent>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <FileQuestion className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm font-medium">Transaksi tidak ditemukan</p>
            </div>
          )}
        </div>
      </AnimatedContent>
    </div>
  );
}