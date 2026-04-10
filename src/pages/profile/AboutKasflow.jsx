import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronLeft, Info, HelpCircle } from "lucide-react";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useMode } from "@/contexts/ModeContext";

export default function AboutKasflow() {
  const { theme } = useMode();
  const isDark = theme === "dark";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in zoom-in-95 duration-500 bg-background text-foreground transition-colors min-h-screen pb-24">
      <AnimatedContent distance={30} delay={0.1} direction="vertical">
        <header className="flex items-center gap-4 mb-4">
          <Link to="/profile" className="p-2 -ml-2 rounded-lg hover:bg-accent transition text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tentang KasFlow</h1>
            <p className="text-sm text-muted-foreground mt-1 text-balance">
              Pelajari lebih lanjut tentang KasFlow dan temukan jawaban dari pertanyaan umum.
            </p>
          </div>
        </header>
      </AnimatedContent>

      <AnimatedContent distance={40} delay={0.2} direction="vertical">
        <Card className="border-border bg-card shadow-sm overflow-hidden mb-8">
          <CardHeader className="bg-muted/30 border-b border-border py-4 px-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <Info className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-bold">Apa itu KasFlow?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">KasFlow</strong> adalah platform manajemen keuangan cerdas yang dirancang khusus untuk memenuhi kebutuhan individu maupun pelaku UMKM (Usaha Mikro Kecil dan Menengah) di Indonesia.
            </p>
            <p>
              KasFlow mengusung sistem **Multi-Profile**, yang memungkinkan Anda mengelola keuangan "Personal" dan "Bisnis" dalam satu akun yang sama, tanpa perlu repot mendaftar berulang kali. Data pada setiap profil 100% diisolasi, sehingga laporan dan transaksi Anda tidak akan pernah bercampur.
            </p>
            <p>
              Kami menyediakan fitur Pencatatan Transaksi, Manajemen Utang Piutang (Debts), Tujuan Keuangan (Goals), Transaksi Berulang, Laporan Analitik, hingga fitur Kasir (POS) khusus untuk mode bisnis.
            </p>
            <div className="pt-4 flex items-center justify-center gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>KasFlow v1.0.0</span>
              <span>&bull;</span>
              <span>2024</span>
              <span>&bull;</span>
              <span>Capstone Project CC26-PS090</span>
            </div>
          </CardContent>
        </Card>
      </AnimatedContent>

      <AnimatedContent distance={40} delay={0.3} direction="vertical">
        <Card className="border-border bg-card shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border py-4 px-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                <HelpCircle className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-bold">Pertanyaan yang Sering Diajukan (FAQ)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-bold text-base hover:no-underline">Bagaimana cara memisahkan keuangan pribadi dan bisnis?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Secara default, saat Anda mendaftar, KasFlow membuatkan profil <strong>Personal</strong> untuk Anda. Anda bisa menuju ke menu pengaturan atau switcher profil (tombol di pojok/sidebar) untuk membuat profil baru bertipe <strong>Business</strong>. Anda bisa dengan mudah beralih (switch) antara mode Personal dan Bisnis kapan saja.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-bold text-base hover:no-underline">Apakah aman menyimpan data keuangan di KasFlow?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Ya! KasFlow menggunakan standar keamanan terkini untuk mengenkripsi data Anda dan memastikan hanya Anda yang memiliki akses ke informasi keuangan yang tersimpan. 
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-bold text-base hover:no-underline">Bagaimana cara menggunakan fitur Kasir (POS)?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Fitur Kasir atau Point of Sale (POS) eksklusif hanya tersedia ketika Anda mengaktifkan <strong>Mode UMKM/Bisnis</strong>. Setelah beralih ke Mode Bisnis, Anda dapat menambahkan produk pada Katalog, mengatur stok, dan mulai mencatat penjualan serta mencetak struk untuk pelanggan Anda.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-bold text-base hover:no-underline">Apakah saya bisa menggunakan KasFlow di banyak perangkat?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Tentu! Data KasFlow disinkronisasi ke cloud decara real-time, jadi Anda dapat membuka akun KasFlow Anda dari smartphone, tablet, maupun komputer. Semuanya akan ter-update seketika.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left font-bold text-base hover:no-underline">Bisakah saya berkolaborasi dengan tim saya?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Sangat bisa! Tersedia fitur "Anggota Tim" yang memungkinkan Anda mengundang partner bisnis atau pegawai kasir Anda untuk masuk ke profil bisnis tertentu, dengan batasan peran <i>(Role: Owner, Editor, atau Viewer)</i>.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </AnimatedContent>
    </div>
  );
}
