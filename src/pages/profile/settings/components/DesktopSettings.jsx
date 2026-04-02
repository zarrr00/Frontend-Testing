import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { 
  Bell, Lock, UserPlus, ChevronRight, 
  ChevronLeft 
} from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { useMode } from "@/contexts/ModeContext";
export default function DesktopSettings() {
  const navigate = useNavigate();
  return (
    <div className="p-10 space-y-8 max-w-4xl relative z-[100] animate-in fade-in duration-500 bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center gap-4 mb-10">
        <button 
          onClick={() => navigate("/profile")} 
          className="p-2 hover:bg-accent rounded-full border border-border cursor-pointer active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{"Pengaturan"}</h1> 
          <p className="text-sm text-muted-foreground mt-1">{"Profil & Pengaturan"}</p>
        </div>
      </header>
      <div className="space-y-8">
        {/* GRUP UMUM */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2">{"Preferensi Umum"}</h3>
          <Card className="border-border bg-card shadow-sm divide-y divide-border overflow-hidden">
            <button className="w-full flex items-center justify-between p-6 hover:bg-accent/50 transition-all text-left group cursor-pointer">
              <div className="flex items-center gap-5">
                <div className="p-4 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-base font-bold">{"Notifikasi Push"}</p>
                  <p className="text-xs text-muted-foreground">{"Atur peringatan transaksi dan promo"}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>
        </div>
        {/* GRUP KEAMANAN */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2">{"Akun & Keamanan"}</h3>
          <Card className="border-border bg-card shadow-sm divide-y divide-border overflow-hidden">
            <button className="w-full flex items-center justify-between p-6 hover:bg-accent/50 transition-all text-left group cursor-pointer">
              <div className="flex items-center gap-5">
                <div className="p-4 rounded-xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-base font-bold">{"Ubah PIN & Sandi"}</p>
                  <p className="text-xs text-muted-foreground">{"Ubah PIN transaksi atau kata sandi Anda"}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button 
              onClick={() => alert("Fitur Ganti Akun segera hadir jirr!")}
              className="w-full flex items-center justify-between p-6 hover:bg-accent/50 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <div className="p-4 rounded-xl bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-base font-bold">{"Ganti / Tambah Akun"}</p>
                  <p className="text-xs text-muted-foreground">{"Pindah ke akun KasFlow lain tanpa logout"}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}