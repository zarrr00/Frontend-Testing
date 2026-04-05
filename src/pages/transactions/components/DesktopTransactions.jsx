import { FileQuestion } from "lucide-react";
import AnimatedContent from "@/components/ui/AnimatedContent";
import TransactionCard from "@/components/transactions/TransactionCard";
import TransactionSearchBox from "@/components/transactions/TransactionSearchBox";
import TransactionExportMenu from "@/components/transactions/TransactionExportMenu";
import { handleExportPDF, handleExportCSV } from "@/utils/export";

export default function DesktopTransactions({ searchQuery, setSearchQuery, filteredTransactions, onDelete }) {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-10 space-y-8 animate-in fade-in zoom-in-95 duration-500 bg-background text-foreground transition-colors" id="snap-main-container">
      <div className="flex items-end justify-between">
        <AnimatedContent distance={30} delay={0.1} direction="vertical">
          <header>
            <h1 className="text-3xl font-bold tracking-tight">Transaksi</h1>
            <p className="text-sm text-muted-foreground mt-1 text-balance">
              Pantau riwayat lengkap sirkulasi keuangan KasFlow dalam satu layar lebar.
            </p>
          </header>
        </AnimatedContent>
        <AnimatedContent distance={30} delay={0.2} direction="vertical">
          <div className="flex flex-1 max-w-lg items-center justify-end gap-3 ml-8">
            <div className="flex-1">
              <TransactionSearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
            <TransactionExportMenu
              onExportPDF={() => handleExportPDF(filteredTransactions)}
              onExportCSV={() => handleExportCSV(filteredTransactions)}
            />
          </div>
        </AnimatedContent>
      </div>
      <AnimatedContent distance={40} delay={0.3} direction="vertical">
        {filteredTransactions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-10">
            {filteredTransactions.map((trx, i) => (
              <AnimatedContent key={trx.id} distance={20} delay={0.4 + (Math.min(i, 10) * 0.05)} direction="vertical">
                <TransactionCard trx={trx} onDelete={onDelete} />
              </AnimatedContent>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border-2 border-dashed border-border rounded-xl bg-card/50">
            <FileQuestion className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-xl font-bold tracking-tight text-foreground">
              Transaksi tidak ditemukan
            </p>
            <p className="text-sm mt-1 opacity-80">
              Tidak ada riwayat yang cocok dengan kata kunci Anda.
            </p>
          </div>
        )}
      </AnimatedContent>
    </div>
  );
}