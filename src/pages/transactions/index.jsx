import { useState, useEffect } from "react";
import DesktopTransactions from "./components/DesktopTransactions";
import MobileTransactions from "./components/MobileTransactions";
import { transactionService } from "@/services/transaction.service";
export default function Transactions() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
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
          date: t.date 
        }));
        setTransactions(mappedData);
      } catch (err) {
        console.error("Failed to load transactions", err);
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
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return isDesktop ? (
    <DesktopTransactions
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      filteredTransactions={filteredTransactions}
    />
  ) : (
    <MobileTransactions
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      filteredTransactions={filteredTransactions}
    />
  );
}