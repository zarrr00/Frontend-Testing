import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
export default function TransactionSearchBox({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input 
        placeholder="Cari kategori atau catatan..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9 bg-card border-border shadow-sm rounded-xl h-11 focus-visible:ring-indigo-600"
      />
    </div>
  );
}
