import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, Bell, CircleHelp, LogOut, ChevronRight, Shield, Store } from "lucide-react";
import { useMode } from "@/contexts/ModeContext";

export default function Profile() {
  const { mode, toggleMode } = useMode();
  
  const isPersonal = mode === 'personal';
  const themeColor = isPersonal ? 'text-purple-600' : 'text-blue-600';
  const themeBg = isPersonal ? 'bg-purple-100' : 'bg-blue-100';

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto w-full space-y-6 animate-in fade-in zoom-in-95 duration-300">
      
      <header>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Profil Akun</h1>
      </header>

      {/* Identitas Pengguna */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-4 flex items-center gap-4">
          {/* Avatar User */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-extrabold ${themeBg} ${themeColor}`}>
            AN
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-900">Ahlun Najarrudin</h2>
            <p className="text-xs text-slate-500 mb-1">ahlun.idcamp@gmail.com</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${themeBg} ${themeColor}`}>
              KasFlow Member
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Menu Pengaturan */}
      <div className="space-y-4">
        
        {/* Kategori Preferensi Aplikasi */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Preferensi Aplikasi</h3>
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <div className="flex flex-col divide-y divide-slate-100">
              
              {/* Tombol Toggle Mode */}
              <button onClick={toggleMode} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors active:bg-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${themeBg} ${themeColor}`}>
                    {isPersonal ? <User className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">Mode Aplikasi</p>
                    <p className="text-xs text-slate-500">Saat ini: {isPersonal ? 'Personal' : 'UMKM'}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors active:bg-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">Notifikasi</p>
                    <p className="text-xs text-slate-500">Atur pengingat pencatatan harian</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </Card>
        </div>

        {/* Kategori Keamanan dan Bantuan */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Akun & Keamanan</h3>
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <div className="flex flex-col divide-y divide-slate-100">
              
              <button className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors active:bg-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                    <Shield className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">Keamanan Akun & PIN</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors active:bg-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                    <CircleHelp className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">Bantuan & FAQ</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </Card>
        </div>

      </div>

      {/* Tombol Keluar (Logout) */}
      <Button variant="destructive" className="w-full h-12 mt-6 font-bold text-md gap-2" size="lg">
        <LogOut className="w-5 h-5" />
        Keluar Akun
      </Button>

      {/* Info Versi */}
      <p className="text-center text-xs text-slate-400 mt-8 mb-4">KasFlow v1.0.0</p>
      
    </div>
  );
}