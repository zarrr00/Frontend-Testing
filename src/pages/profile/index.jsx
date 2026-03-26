import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  User,
  Settings,
  Bell,
  CircleHelp,
  LogOut,
  ChevronRight,
  Shield,
  Store,
  Moon,
  Sun,
  Pencil
} from "lucide-react";
import { useMode } from "@/contexts/ModeContext";

export default function Profile() {
  const {
    mode,
    theme,
    notifications,
    toggleMode,
    toggleTheme,
    toggleNotifications
  } = useMode();

  const isPersonal = mode === "personal";
  const isDark = theme === "dark";

  const themeColor = isPersonal
    ? "text-purple-600"
    : "text-blue-600";

  const themeBg = isPersonal
    ? "bg-purple-100 dark:bg-purple-900/30"
    : "bg-blue-100 dark:bg-blue-900/30";

  return (
    /* FIX: Ganti bg-white jadi bg-background, text-slate-900 jadi text-foreground biar hitam pekat di dark mode */
    <div className="p-4 md:p-6 max-w-xl mx-auto w-full space-y-6 
    bg-background text-foreground
    transition-colors duration-300">

      {/* HEADER */}
      <header>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Profil & Pengaturan
        </h1>
      </header>

      {/* USER INFO */}
      {/* FIX: Ganti bg-white jadi bg-card, border-slate-200 jadi border-border */}
      <Card className="border-border bg-card shadow-sm overflow-hidden">
        <CardContent className="p-4 flex items-center gap-4">
          
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-extrabold ${themeBg} ${themeColor}`}>
            AN
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-bold text-foreground">
              Ahlun Najarrudin
            </h2>
            <p className="text-xs text-muted-foreground mb-1">
              ahlun.idcamp@gmail.com
            </p>

            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${themeBg} ${themeColor}`}>
              {isPersonal ? "Personal" : "UMKM"}
            </span>
          </div>

          <button className="p-2 rounded-lg hover:bg-accent transition text-muted-foreground">
            <Pencil className="w-4 h-4" />
          </button>
        </CardContent>
      </Card>

      {/* SETTINGS */}
      <div className="space-y-4">

        {/* PREFERENSI */}
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            Preferensi Aplikasi
          </h3>

          {/* FIX: Ganti bg-white jadi bg-card, border-slate-200 jadi border-border */}
          <Card className="border-border bg-card shadow-sm overflow-hidden">
            {/* FIX: Ganti divide-slate-100 jadi divide-border */}
            <div className="flex flex-col divide-y divide-border">

              {/* MODE */}
              {/* FIX: Ganti hover:bg-slate-50 jadi hover:bg-accent */}
              <button
                onClick={toggleMode}
                className="flex items-center justify-between p-4 hover:bg-accent transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${themeBg} ${themeColor}`}>
                    {isPersonal ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Store className="w-4 h-4" />
                    )}
                  </div>

                  <div className="text-left">
                    <p className="text-sm font-bold text-foreground">
                      Mode Aplikasi
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isPersonal ? "Personal" : "UMKM"}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* THEME */}
              {/* FIX: Ganti hover:bg-slate-50 jadi hover:bg-accent */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-between p-4 hover:bg-accent transition"
              >
                <div className="flex items-center gap-3">
                  {/* FIX: Ganti bg-slate-100 jadi bg-muted, text-slate-600 jadi text-foreground */}
                  <div className="p-2 rounded-lg bg-muted text-foreground">
                    {isDark ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                  </div>

                  <div className="text-left">
                    <p className="text-sm font-bold text-foreground">
                      Tema Aplikasi
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isDark ? "Dark Mode" : "Light Mode"}
                    </p>
                  </div>
                </div>

                {/* FIX: Ganti text-slate-400 jadi text-muted-foreground, dan ON jadi biru kalau aktif */}
                <span className={`text-xs font-bold ${isDark ? "text-blue-500" : "text-muted-foreground"}`}>
                  {isDark ? "ON" : "OFF"}
                </span>
              </button>

              {/* NOTIFICATIONS */}
              {/* FIX: Ganti hover:bg-slate-50 jadi hover:bg-accent */}
              <button
                onClick={toggleNotifications}
                className="flex items-center justify-between p-4 hover:bg-accent transition"
              >
                <div className="flex items-center gap-3">
                  {/* FIX: Ganti bg-slate-100 jadi bg-muted, text-slate-600 jadi text-foreground */}
                  <div className="p-2 rounded-lg bg-muted text-foreground">
                    <Bell className="w-4 h-4" />
                  </div>

                  <div className="text-left">
                    <p className="text-sm font-bold text-foreground">
                      Notifikasi
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notifications ? "Aktif" : "Nonaktif"}
                    </p>
                  </div>
                </div>

                {/* FIX: Ganti text-slate-400 jadi text-muted-foreground, dan ON jadi biru kalau aktif */}
                <span className={`text-xs font-bold ${notifications ? "text-blue-500" : "text-muted-foreground"}`}>
                  {notifications ? "ON" : "OFF"}
                </span>
              </button>
            </div>
          </Card>
        </div>

        {/* KEAMANAN */}
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            Akun & Keamanan
          </h3>

          {/* FIX: Ganti bg-white jadi bg-card, border-slate-200 jadi border-border */}
          <Card className="border-border bg-card shadow-sm overflow-hidden">
            {/* FIX: Ganti divide-slate-100 jadi divide-border */}
            <div className="flex flex-col divide-y divide-border text-foreground">

              {/* FIX: Ganti hover:bg-slate-50 jadi hover:bg-accent */}
              <button className="flex items-center justify-between p-4 hover:bg-accent transition text-left">
                <div className="flex items-center gap-3">
                  {/* FIX: Ganti bg-slate-100 jadi bg-muted */}
                  <div className="p-2 rounded-lg bg-muted">
                    <Shield className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-bold">
                    PIN & Keamanan
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* FIX: Ganti hover:bg-slate-50 jadi hover:bg-accent */}
              <button className="flex items-center justify-between p-4 hover:bg-accent transition text-left">
                <div className="flex items-center gap-3">
                  {/* FIX: Ganti bg-slate-100 jadi bg-muted */}
                  <div className="p-2 rounded-lg bg-muted">
                    <Settings className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-bold">
                    Pengaturan Akun
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </Card>
        </div>

        {/* BANTUAN */}
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">
            Bantuan
          </h3>

          {/* FIX: Ganti bg-white jadi bg-card, border-slate-200 jadi border-border */}
          <Card className="border-border bg-card shadow-sm overflow-hidden">
            {/* FIX: Ganti divide-slate-100 jadi divide-border */}
            <div className="flex flex-col divide-y divide-border text-foreground">

              {/* FIX: Ganti hover:bg-slate-50 jadi hover:bg-accent */}
              <button className="flex items-center justify-between p-4 hover:bg-accent transition text-left">
                <div className="flex items-center gap-3">
                  {/* FIX: Ganti bg-slate-100 jadi bg-muted */}
                  <div className="p-2 rounded-lg bg-muted">
                    <CircleHelp className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-bold">
                    Bantuan & FAQ
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* FIX: Ganti hover:bg-slate-50 jadi hover:bg-accent */}
              <button className="flex items-center justify-between p-4 hover:bg-accent transition text-left">
                <div className="flex items-center gap-3">
                  {/* FIX: Ganti bg-slate-100 jadi bg-muted */}
                  <div className="p-2 rounded-lg bg-muted">
                    <CircleHelp className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-bold">
                    Tentang Aplikasi
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* LOGOUT */}
      <Button
        variant="destructive"
        className="w-full h-12 mt-6 font-bold text-md gap-2"
      >
        <LogOut className="w-5 h-5" />
        Keluar Akun
      </Button>

      {/* VERSION */}
      <p className="text-center text-xs text-muted-foreground mt-8 mb-4">
        KasFlow v1.0.0
      </p>
    </div>
  );
}