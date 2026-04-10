import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Info, HelpCircle } from "lucide-react";
import { useMode } from "@/contexts/ModeContext";

export default function MobileAbout() {
  const { theme } = useMode();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  return (
    <div className="pb-24 p-4 md:p-6 max-w-xl mx-auto w-full space-y-6 bg-background text-foreground animate-in fade-in transition-colors duration-300 min-h-screen">
      {/* HEADER */}
      <header className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-accent transition text-foreground">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Tentang KasFlow
        </h1>
      </header>

      <p className="text-sm text-muted-foreground">
        Pelajari lebih lanjut tentang platform kami dan temukan jawaban atas pertanyaan umum.
      </p>

      {/* OVERVIEW COMPONENT */}
      <Card className="border-border bg-card shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border py-4 px-4 flex flex-row items-center gap-3 space-y-0">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <Info className="w-4 h-4" />
          </div>
          <CardTitle className="text-base font-bold">Apa itu KasFlow?</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">KasFlow</strong> adalah platform manajemen keuangan cerdas untuk individu maupun pelaku UMKM (Usaha Mikro Kecil dan Menengah).
          </p>
          <p>
            Dengan sistem <strong>Multi-Profile</strong>, kelola keuangan "Personal" dan "Bisnis" dalam satu akun secara aman dengan pemisahan data 100%.
          </p>
          <p>
            Nikmati alat Pencatatan, Utang Piutang (Debts), Tujuan (Goals), Transaksi Berulang, dan khusus profil UMKM, fitur Kasir (POS) gratis terbaik di kelasnya!
          </p>
        </CardContent>
      </Card>

      {/* FAQ COMPONENT */}
      <Card className="border-border bg-card shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border py-4 px-4 flex flex-row items-center gap-3 space-y-0">
           <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <CardTitle className="text-base font-bold">FAQ</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="w-full flex flex-col gap-3">
            <details className="group border-b border-border pb-2">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-sm hover:text-indigo-500 transition-colors">
                Bagaimana memisahkan keuangan?
                <span className="transition group-open:rotate-180">
                  <ChevronLeft className="w-4 h-4 -rotate-90" />
                </span>
              </summary>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2 p-1">
                Gunakan switcher profil di menu navigasi. Buat profil 'Personal' untuk pribadi dan 'Business' untuk UMKM. Datanya terpisah otomatis.
              </p>
            </details>
            <details className="group border-b border-border pb-2">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-sm hover:text-indigo-500 transition-colors">
                Apakah data aman?
                <span className="transition group-open:rotate-180">
                  <ChevronLeft className="w-4 h-4 -rotate-90" />
                </span>
              </summary>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2 p-1">
                Sangat aman. Kami menggunakan sistem cloud modern yang dienkripsi untuk privasi Anda seutuhnya.
              </p>
            </details>
            <details className="group border-b border-border pb-2">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-sm hover:text-indigo-500 transition-colors">
                Cara pakai Kasir (POS)?
                <span className="transition group-open:rotate-180">
                  <ChevronLeft className="w-4 h-4 -rotate-90" />
                 </span>
              </summary>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2 p-1">
                Ganti Profile Anda menjadi tipe Bisnis/UMKM terlebih dulu, lalu menu Kasir akan otomatis terbuka untuk memproses pembelian.
              </p>
            </details>
            <details className="group pb-1">
              <summary className="flex cursor-pointer items-center justify-between font-bold text-sm hover:text-indigo-500 transition-colors">
                Bisa buka dari perangkat lain?
                <span className="transition group-open:rotate-180">
                  <ChevronLeft className="w-4 h-4 -rotate-90" />
                </span>
              </summary>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2 p-1">
                Bisa. Semua aktivitas otomatis tersinkronisasi di server cloud, jadi buka dari manapun selalu update.
              </p>
            </details>
          </div>
        </CardContent>
      </Card>
      
      {/* VERSION */}
      <p className="text-center text-xs text-muted-foreground pt-4 mb-4">
        KasFlow v1.0.0 &copy; 2024
      </p>
    </div>
  );
}
