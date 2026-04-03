import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Bell, Lock, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMode } from "@/contexts/ModeContext";
export default function MobileSettings() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background text-foreground p-4 pb-24 relative z-[9999] animate-in slide-in-from-right duration-300">
      {/* Header - Tombol Kembali */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate("/profile")} 
          className="p-2 active:bg-accent rounded-full border border-border cursor-pointer transition-transform active:scale-90"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-foreground">{"Pengaturan"}</h1>
      </div>
      <div className="space-y-6 pb-20">
        {/* GRUP UMUM */}
        <section className="space-y-3">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">{"Preferensi Umum"}</p>
          <Card className="border-border bg-card overflow-hidden divide-y divide-border shadow-sm">
            {/* NOTIFIKASI */}
            <button className="w-full flex items-center justify-between p-5 active:bg-accent transition-colors text-left group cursor-pointer">
              <div className="flex items-center gap-4 pointer-events-none">
                <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500">
                  <Bell className="w-5 h-5" />
                </div>
                <p className="font-bold text-sm">{"Notifikasi Push"}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </Card>
        </section>
        {/* GRUP KEAMANAN */}
        <section className="space-y-3">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">{"Akun & Keamanan"}</p>
          <Card className="border-border bg-card overflow-hidden divide-y divide-border shadow-sm">
            {/* PRIVASI */}
            <button className="w-full flex items-center justify-between p-5 active:bg-accent transition-colors text-left group cursor-pointer">
              <div className="flex items-center gap-4 pointer-events-none">
                <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-500">
                  <Lock className="w-5 h-5" />
                </div>
                <p className="font-bold text-sm">{"Ubah PIN & Sandi"}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            {/* TOMBOL GANTI AKUN */}
            <button 
              onClick={() => alert("Fitur Ganti Akun segera hadir!")}
              className="w-full flex items-center justify-between p-5 active:bg-accent transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-4 pointer-events-none">
                <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-500">
                  <UserPlus className="w-5 h-5" />
                </div>
                <p className="font-bold text-sm">{"Ganti / Tambah Akun"}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </Card>
        </section>
      </div>
    </div>
  );
}