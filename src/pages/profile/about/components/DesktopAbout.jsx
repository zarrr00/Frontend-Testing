import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronLeft, Info, HelpCircle } from "lucide-react";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { useMode } from "@/contexts/ModeContext";

export default function DesktopAbout() {
  const { theme } = useMode();
  const isDark = theme === "dark";

  return (
    <div className="w-full max-w-5xl mx-auto px-8 py-10 space-y-8 animate-in fade-in zoom-in-95 duration-500 bg-background text-foreground transition-colors">
      <AnimatedContent distance={30} delay={0.1} direction="vertical">
        <header className="flex items-center gap-4 mb-4">
          <Link to="/profile" className="p-2 -ml-2 rounded-lg hover:bg-accent transition text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tentang KasFlow</h1>
            <p className="text-sm text-muted-foreground mt-1 text-balance">
              Pelajari lebih lanjut tentang KasFlow dan temukan jawaban dari pertanyaan umum.
            </p>
          </div>
        </header>
      </AnimatedContent>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatedContent distance={40} delay={0.2} direction="horizontal" className="space-y-6">
          <Card className="border-border bg-card shadow-sm overflow-hidden h-full">
            <CardHeader className="bg-muted/30 border-b border-border py-4 px-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Info className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg font-bold">Apa itu KasFlow?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">KasFlow</strong> adalah platform manajemen keuangan cerdas yang dirancang khusus untuk memenuhi kebutuhan individu maupun pelaku UMKM (Usaha Mikro Kecil dan Menengah) di Indonesia.
              </p>
              <p>
                KasFlow mengusung sistem <strong>Multi-Profile</strong>, yang memungkinkan Anda mengelola keuangan "Personal" dan "Bisnis" dalam satu akun yang sama, tanpa perlu repot mendaftar berulang kali. Data pada setiap profil 100% diisolasi, sehingga laporan dan transaksi Anda tidak akan pernah bercampur.
              </p>
              <p>
                Kami menyediakan fitur Pencatatan Transaksi, Manajemen Utang Piutang (Debts), Tujuan Keuangan (Goals), Transaksi Berulang, Laporan Analitik, hingga fitur Kasir (POS) khusus untuk mode bisnis.
              </p>
              <div className="pt-6 mt-auto flex flex-col gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <p>Versi: KasFlow v1.0.0</p>
                <p>&copy; 2024 Capstone Project CC26-PS090</p>
              </div>
            </CardContent>
          </Card>
        </AnimatedContent>

        <AnimatedContent distance={40} delay={0.3} direction="vertical" className="space-y-6">
          <Card className="border-border bg-card shadow-sm overflow-hidden h-full">
            <CardHeader className="bg-muted/30 border-b border-border py-4 px-6 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg font-bold">FAQ</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="w-full flex flex-col gap-3">
                <details className="group border-b border-border pb-3">
                  <summary className="flex cursor-pointer items-center justify-between font-bold text-base hover:text-indigo-500 transition-colors">
                    Bagaimana memisahkan keuangan?
                    <span className="transition group-open:rotate-180">
                      <ChevronLeft className="w-4 h-4 -rotate-90" />
                    </span>
                  </summary>
                  <p className="text-muted-foreground leading-relaxed mt-2 text-sm">
                    Saat mendaftar, KasFlow membuatkan profil <strong>Personal</strong> untuk Anda. Anda bisa menuju menu pengaturan untuk membuat profil baru bertipe <strong>Business</strong>. Data keduanya terpisah otomatis.
                  </p>
                </details>
                <details className="group border-b border-border pb-3">
                  <summary className="flex cursor-pointer items-center justify-between font-bold text-base hover:text-indigo-500 transition-colors">
                    Apakah data aman?
                    <span className="transition group-open:rotate-180">
                      <ChevronLeft className="w-4 h-4 -rotate-90" />
                    </span>
                  </summary>
                  <p className="text-muted-foreground leading-relaxed mt-2 text-sm">
                    Ya! KasFlow mematuhi standar keamanan, menggunakan enkripsi data terpusat dari Supabase dan sistem autentikasi modern. Hanya Anda yang memiliki akses.
                  </p>
                </details>
                <details className="group border-b border-border pb-3">
                  <summary className="flex cursor-pointer items-center justify-between font-bold text-base hover:text-indigo-500 transition-colors">
                    Cara menggunakan fitur Kasir (POS)?
                    <span className="transition group-open:rotate-180">
                      <ChevronLeft className="w-4 h-4 -rotate-90" />
                    </span>
                  </summary>
                  <p className="text-muted-foreground leading-relaxed mt-2 text-sm">
                    Fitur POS eksklusif untuk <strong>Mode UMKM/Bisnis</strong>. Setelah beralih profil, Anda dapat menambah produk di menu Katalog dan mulai mencatat penjualan.
                  </p>
                </details>
                <details className="group border-b border-border pb-3">
                  <summary className="flex cursor-pointer items-center justify-between font-bold text-base hover:text-indigo-500 transition-colors">
                    Bisa digunakan di banyak perangkat?
                    <span className="transition group-open:rotate-180">
                      <ChevronLeft className="w-4 h-4 -rotate-90" />
                    </span>
                  </summary>
                  <p className="text-muted-foreground leading-relaxed mt-2 text-sm">
                    Tentu! Data Anda disinkronisasi ke cloud otomatis. Cukup login dengan akun yang sama di perangkat manapun.
                  </p>
                </details>
                <details className="group pb-1">
                  <summary className="flex cursor-pointer items-center justify-between font-bold text-base hover:text-indigo-500 transition-colors">
                    Bisakah berkolaborasi (Anggota Tim)?
                    <span className="transition group-open:rotate-180">
                      <ChevronLeft className="w-4 h-4 -rotate-90" />
                    </span>
                  </summary>
                  <p className="text-muted-foreground leading-relaxed mt-2 text-sm">
                    Bisa! Melalui menu "Anggota Tim", Anda bisa mengundang rekan/kasir dengan role Owner, Editor, atau Viewer untuk bekerja di dalam profil bisnis yang sama.
                  </p>
                </details>
              </div>
            </CardContent>
          </Card>
        </AnimatedContent>
      </div>
    </div>
  );
}
