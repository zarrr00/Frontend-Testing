import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
export default function TransactionExportMenu({ onExportPDF, onExportCSV }) {
  return (
    <DropdownMenu>
      {/* FIX: Menggunakan bg-[#4f46e5] agar warna tetap Indigo biarpun Dark Mode */}
      <DropdownMenuTrigger className="flex items-center justify-center w-11 h-11 bg-[#4f46e5] text-white rounded-xl shadow-md hover:bg-[#4338ca] active:scale-95 transition-all outline-none">
        <Download className="w-5 h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 bg-card border-border shadow-lg">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
          Ekspor Data
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem onClick={onExportPDF} className="cursor-pointer gap-2 py-2 font-medium hover:bg-accent">
          <FileText className="w-4 h-4 text-rose-500" /> Unduh PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportCSV} className="cursor-pointer gap-2 py-2 font-medium hover:bg-accent">
          <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Unduh CSV (Excel)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
