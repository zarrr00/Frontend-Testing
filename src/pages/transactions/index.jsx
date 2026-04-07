import { useState, useEffect } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import DesktopTransactions from "./components/DesktopTransactions";
import MobileTransactions from "./components/MobileTransactions";
import { transactionService } from "@/services/transaction.service";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Transactions() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await transactionService.getTransactions({ limit: 100 });
        const mappedData = data.map(t => ({
          id: t.id,
          type: t.type,
          name: t.description,
          amount: t.amount,
          category: t.category_name || 'Lain-lain',
          notes: t.note || '',
          date: t.date,
        }));
        setTransactions(mappedData);
      } catch (err) {
        console.error('Failed to load transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((trx) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (trx.name && trx.name.toLowerCase().includes(searchLower)) ||
      trx.category.toLowerCase().includes(searchLower) ||
      (trx.notes && trx.notes.toLowerCase().includes(searchLower))
    );
  });

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await transactionService.deleteTransaction(deleteId);
      setTransactions((prev) => prev.filter((trx) => trx.id !== deleteId));
      toast.success("Transaksi berhasil dihapus");
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      toast.error('Gagal menghapus transaksi: ' + err);
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {isDesktop ? (
        <DesktopTransactions
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredTransactions={filteredTransactions}
          onDelete={handleDelete}
        />
      ) : (
        <MobileTransactions
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredTransactions={filteredTransactions}
          onDelete={handleDelete}
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Transaksi?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-rose-500 hover:bg-rose-600 text-white">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}