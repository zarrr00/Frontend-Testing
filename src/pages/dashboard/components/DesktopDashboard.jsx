import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Scan, Plus, Search, Bell, Settings, TrendingUp, Wallet, ChevronRight } from "lucide-react";
import SparklineChart from "@/components/charts/SparklineChart";
import CashFlowAreaChart from "@/components/charts/CashFlowAreaChart";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDashboardData } from "../hooks/useDashboardData";
import { formatIDR } from "@/utils/currency";
import { transactionService } from "@/services/transaction.service";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { useMode } from "@/contexts/ModeContext";
export default function DesktopDashboard() {
  const { t } = useMode();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const { summary, chartData, sparklineBalance, sparklineIncome, sparklineExpense, categoryData, recentActivity, loading } = useDashboardData();
  const currentLocale = "id-ID";
  // Translator
  const getTranslatedAction = (action) => {
    if (!action) return "";
    if (action.includes("Bahan Baku")) return "Bahan Baku";
    if (action.includes("Operasional")) return "Operasional";
    if (action.includes("Penjualan")) return "Penjualan";
    if (action.includes("Servis") || action.includes("Jasa")) return "Pendapatan Jasa";
    if (action.includes("Wi-Fi") || action.includes("Listrik")) return "Lain-lain";
    return action; // Fallback
  };
  // OCR Scan
  const handleScanClick = () => fileInputRef.current.click();
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsScanning(true);
    try {
      const result = await transactionService.scanReceipt(file);
      navigate("/add", { 
        state: { 
          amount: result.suggested_total || result.amount, 
          description: result.extracted_text || result.description,
          type: "expense" 
        } 
      });
    } catch (err) {
      console.error("OCR Error:", err);
      alert("Gagal scan struk: " + err);
    } finally {
      setIsScanning(false);
    }
  };
  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="min-h-full bg-background text-foreground p-8 font-sans w-full animate-in fade-in duration-300 transition-colors" id="snap-main-container">
      {/* Header */}
      <AnimatedContent distance={30} delay={0.1} direction="vertical">
        <header className="flex justify-between items-center mb-8 gap-4 px-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {"Halo"}, Lelouch 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1 text-capitalize">
              {new Intl.DateTimeFormat(currentLocale, { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              }).format(new Date())} | 10:30 AM
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder={"Cari riwayat transaksi..."} className="bg-card border border-border shadow-sm rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all w-64" />
            </div>
            <button className="p-2.5 bg-card border border-border shadow-sm rounded-full hover:bg-accent transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2 bg-card border border-border shadow-sm rounded-full py-1.5 px-3 cursor-pointer hover:bg-accent transition-colors">
              <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground font-bold shadow-inner">L</div>
              <span className="text-sm font-bold">Lelouch</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90" />
            </div>
          </div>
        </header>
      </AnimatedContent>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 px-2 pb-10">
        <div className="xl:col-span-3 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatedContent distance={40} delay={0.2}>
              <Card className="bg-card border-border shadow-sm relative overflow-hidden group">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{"Total Saldo Aktif"}</span>
                    <Wallet className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-2xl font-black mb-2">{formatIDR(summary.balance)}</h2>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full w-max mt-1">
                        <ArrowUpRight className="w-3 h-3" />
                        <span>+8.5% {"bulan ini"} (Real-time)</span>
                      </div>
                    </div>
                    <div className="w-24 h-12 ml-2">
                      <SparklineChart data={sparklineBalance} color="var(--primary)" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContent>
            <AnimatedContent distance={40} delay={0.3}>
              <Card className="bg-card border-border shadow-sm relative overflow-hidden group">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{"Pemasukan"}</span>
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-2xl font-black mb-2">{formatIDR(summary.total_income)}</h2>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full w-max mt-1">
                        <ArrowUpRight className="w-3 h-3" />
                        <span>+12.0% {"bulan ini"} (Real-time)</span>
                      </div>
                    </div>
                    <div className="w-24 h-12 ml-2">
                       <SparklineChart data={sparklineIncome} color="#10b981" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContent>
            <AnimatedContent distance={40} delay={0.4}>
              <Card className="bg-card border-border shadow-sm relative overflow-hidden group">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{"Pengeluaran"}</span>
                    <ArrowDownRight className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-2xl font-black mb-2">{formatIDR(summary.total_expense)}</h2>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold bg-rose-500/10 text-rose-500 px-2 py-1 rounded-full w-max mt-1">
                        <ArrowDownRight className="w-3 h-3" />
                        <span>-5.2% {"bulan ini"} (Real-time)</span>
                      </div>
                    </div>
                    <div className="w-24 h-12 ml-2">
                       <SparklineChart data={sparklineExpense} color="#f43f5e" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContent>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            <AnimatedContent distance={40} delay={0.5} className="lg:col-span-2 flex flex-col h-full">
              <Card className="bg-card border-border shadow-sm lg:col-span-2 flex flex-col w-full h-full">
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-6 shrink-0">
                    <h3 className="text-sm font-bold text-foreground">{"Tren Arus Kas"}</h3>
                    <div className="flex gap-4 text-xs font-bold text-muted-foreground">
                      <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm"></div>{"Pemasukan"}</span>
                      <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500 shadow-sm"></div>{"Pengeluaran"}</span>
                    </div>
                  </div>
                  <div className="w-full flex-1 min-h-[220px]">
                      <CashFlowAreaChart data={chartData} />
                  </div>
                </CardContent>
              </Card>
            </AnimatedContent>
            <AnimatedContent distance={40} delay={0.6} className="lg:col-span-1 flex flex-col h-full">
              <Card className="bg-card border-border shadow-sm lg:col-span-1 flex flex-col w-full h-full">
                <CardContent className="p-6 flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-foreground mb-6 shrink-0">{"Distribusi Kategori"}</h3>
                  <div className="w-full relative flex-1 min-h-[160px]">
                      <CategoryPieChart data={categoryData} />
                  </div>
                  <div className="mt-auto flex flex-col justify-end gap-2.5 shrink-0">
                    {categoryData.map((cat, i) => (
                      <div key={i} className="flex items-center justify-between text-xs font-medium">
                        <div className="flex items-center gap-2">
                           <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{backgroundColor: cat.color}}></div>
                           <span className="text-foreground">
                             {cat.name === 'Operasional' ? "Operasional" : 
                              cat.name === 'Bahan Baku' ? "Bahan Baku" : "Lain-lain"}
                           </span>
                        </div>
                        <span className="font-bold text-foreground">{cat.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedContent>
          </div>
        </div>
        <div className="xl:col-span-1 flex flex-col gap-6">
          <AnimatedContent distance={40} delay={0.3} direction="vertical">
            <Card className="bg-card border-border shadow-sm overflow-hidden shrink-0">
              <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{"Aksi Cepat"}</span>
                <Settings className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
              </div>
              <CardContent className="p-4 flex flex-col gap-3">
                <Link to="/add" state={{type: 'income'}} className="flex items-center gap-3 p-3.5 bg-background border border-border shadow-sm rounded-xl hover:bg-accent transition-colors group cursor-pointer">
                   <div className="bg-emerald-500/10 p-2 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                      <Plus className="w-4 h-4 text-emerald-500" />
                   </div>
                   <span className="text-sm font-bold text-foreground">{"Tambah Pemasukan"}</span>
                </Link>
                <Link to="/add" state={{type: 'expense'}} className="flex items-center gap-3 p-3.5 bg-background border border-border shadow-sm rounded-xl hover:bg-accent transition-colors group cursor-pointer">
                   <div className="bg-rose-500/10 p-2 rounded-lg group-hover:bg-rose-500/20 transition-colors">
                      <ArrowDownRight className="w-4 h-4 text-rose-500" />
                   </div>
                   <span className="text-sm font-bold text-foreground">{"Tambah Pengeluaran"}</span>
                </Link>
                <button onClick={handleScanClick} disabled={isScanning} className="flex items-center gap-3 p-3.5 bg-background border border-border shadow-sm rounded-xl hover:bg-accent transition-colors group cursor-pointer w-full text-left">
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                   <div className="bg-blue-500/10 p-2 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                      <Scan className={`w-4 h-4 text-blue-500 ${isScanning ? "animate-spin" : ""}`} />
                   </div>
                   <span className="text-sm font-bold text-foreground">{isScanning ? "Memindai..." : "Scan Struk / Nota"}</span>
                </button>
              </CardContent>
            </Card>
          </AnimatedContent>
          <AnimatedContent distance={40} delay={0.5} direction="vertical" className="flex-1 flex flex-col min-h-[220px]">
            <Card className="bg-card border-border shadow-sm overflow-hidden flex-1 flex flex-col h-full w-full">
              <div className="p-4 bg-muted/30 border-b border-border flex items-center justify-between shrink-0">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{"Kesehatan Finansial"}</span>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <CardContent className="p-5 flex flex-col justify-center flex-1 gap-4">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-sm font-black text-foreground">{"Sangat Sehat"}</h4>
                    <p className="text-[11px] font-medium text-muted-foreground mt-0.5">{"Pengeluaran terkendali"}</p>
                  </div>
                  <span className="text-3xl font-black text-emerald-500 tracking-tighter">85<span className="text-xl">%</span></span>
                </div>
                <div className="relative w-full h-3.5 bg-muted rounded-full overflow-hidden shadow-inner mt-2">
                  <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground px-1 uppercase tracking-wider mt-1">
                  <span>{"Kritis"}</span>
                  <span>{"Waspada"}</span>
                  <span>{"Aman"}</span>
                </div>
              </CardContent>
            </Card>
          </AnimatedContent>
        </div>
        <div className="xl:col-span-4 mt-2">
          <AnimatedContent distance={30} delay={0.7} direction="vertical">
            <Card className="bg-card border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-sm font-bold text-foreground">{"Riwayat Transaksi Terbaru"}</h3>
                   <span className="text-[11px] font-bold text-primary hover:underline cursor-pointer">{"Lihat Semua"}</span>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-sm text-left">
                    <thead className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                      <tr>
                        <th className="pb-3 font-bold px-4">{"Tipe Transaksi"}</th>
                        <th className="pb-3 font-bold px-4">{"Kategori & Aktivitas"}</th>
                        <th className="pb-3 font-bold px-4">{"Tanggal & Waktu"}</th>
                        <th className="pb-3 font-bold px-4 text-right">{"Status"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((item) => (
                        <tr key={item.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                          <td className="py-3.5 px-4 w-1/4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${item.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {item.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                              </div>
                              <span className="text-foreground font-bold">{item.type === 'income' ? "Pemasukan" : "Pengeluaran"}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-muted-foreground font-medium w-1/3">
                            {getTranslatedAction(item.action)}
                          </td>
                          <td className="py-3.5 px-4 text-muted-foreground text-xs font-medium w-1/4">{item.date}</td>
                          <td className="py-3.5 px-4 text-right">
                            <span className={`px-2.5 py-1.5 rounded-full text-[10px] font-bold tracking-wide shadow-sm ${item.status === 'Selesai' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                              {item.status === 'Selesai' ? "Selesai" : "Tertunda"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </AnimatedContent>
        </div>
      </div>
    </div>
  );
}