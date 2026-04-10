import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { transactionService } from "@/services/transaction.service";
import AnimatedContent from "@/components/ui/AnimatedContent";
import {
  User, Settings, Bell, CircleHelp, LogOut, ChevronRight, Shield, Store, Moon, Sun, Pencil, Trophy, Flame, Medal, WalletCards, Camera, X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMode } from "@/contexts/ModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useConfirm } from "@/contexts/ConfirmContext";
import { toast } from "sonner";

export default function DesktopProfile() {
  const { mode, theme, notifications, toggleMode, toggleTheme, toggleNotifications } = useMode();
  const { user, updateUser, logout } = useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [totalTransactions, setTotalTransactions] = useState(0);

  useEffect(() => {
    transactionService.getTotalCount()
      .then(setTotalTransactions)
      .catch(console.error);
  }, [mode]);

  const handleEditClick = () => {
    setEditName(user?.full_name || user?.name || "");
    setEditAvatar(null);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      await updateUser({ full_name: editName, avatarFile: editAvatar });
      toast.success("Profil berhasil diperbarui");
      setIsEditModalOpen(false);
    } catch (e) {
      toast.error(e?.message || "Gagal memperbarui profil");
    } finally {
      setIsSaving(false);
    }
  };
  const { confirmDialog } = useConfirm();
  const navigate = useNavigate();
  
  const isPersonal = mode === "personal";
  const isDark = theme === "dark";
  const themeColor = isPersonal ? "text-purple-600" : "text-blue-600";
  const themeBg = isPersonal ? "bg-purple-100 dark:bg-purple-900/30" : "bg-blue-100 dark:bg-blue-900/30";

  const handleToggleMode = () => {
    const targetMode = mode === 'personal' ? 'UMKM / Bisnis' : 'Personal';
    const targetIcon = mode === 'personal' ? <Store className="w-5 h-5 text-blue-500" /> : <User className="w-5 h-5 text-purple-500" />;
    
    confirmDialog({
      title: `Beralih ke Mode ${targetMode}`,
      description: `Aplikasi akan dimuat ulang untuk menyesuaikan ruang lingkup data ${targetMode} Anda. Lanjutkan?`,
      confirmText: 'Ya, Beralih',
      isDestructive: false,
      icon: targetIcon,
      onConfirm: () => {
        toggleMode();
        toast.loading(`Mempersiapkan data ruang lingkup ${targetMode}...`);
        setTimeout(() => window.location.reload(), 1000);
      }
    });
  };

  const userName = user?.full_name || user?.name || "KasFlow User";
  const userEmail = user?.email || "";
  const avatarUrl = user?.avatar_url || user?.picture || null;
  const initials = userName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-10 space-y-8 animate-in fade-in zoom-in-95 duration-500 bg-background text-foreground transition-colors" id="snap-main-container">
      <AnimatedContent distance={30} delay={0.1} direction="vertical">
        <header>
          {/* JUDUL DAN SUB-JUDUL SINKRON */}
          <h1 className="text-3xl font-bold tracking-tight">{"Profil & Pengaturan"}</h1>
          <p className="text-sm text-muted-foreground mt-1 text-balance">
            {"Kelola preferensi akun dan personalisasi aplikasi KasFlow Anda."}
          </p>
        </header>
      </AnimatedContent>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <AnimatedContent distance={40} delay={0.2} direction="horizontal" className="lg:col-span-4 space-y-6">
          <Card className="border-border bg-card shadow-sm overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center text-center gap-4 relative">
              <button 
                onClick={handleEditClick}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent transition text-muted-foreground"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <div className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl font-extrabold overflow-hidden ${themeBg} ${themeColor} shadow-inner`}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{userName}</h2>
                <p className="text-sm text-muted-foreground mt-1 mb-4">{userEmail}</p>
                <span className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider ${themeBg} ${themeColor}`}>
                  {isPersonal ? "Mengelola keuangan pribadi" : "Mengelola keuangan UMKM"}
                </span>
              </div>
            </CardContent>
          </Card>
          {/* STATS LABEL */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-border bg-card shadow-sm overflow-hidden text-center py-4 hover:bg-accent/50 transition-colors cursor-default">
              <div className="flex flex-col items-center gap-2">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full"><WalletCards className="w-6 h-6" /></div>
                <p className="text-2xl font-black text-foreground">{totalTransactions}</p>
                <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  {"Transaksi"}
                </p>
              </div>
            </Card>
            <Card className="border-border bg-card shadow-sm overflow-hidden text-center py-4 hover:bg-accent/50 transition-colors cursor-default">
              <div className="flex flex-col items-center gap-2">
                <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full"><Medal className="w-6 h-6" /></div>
                <p className="text-2xl font-black text-foreground">12</p>
                <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  {"Lencana"}
                </p>
              </div>
            </Card>
            <Card className="border-border bg-card shadow-sm overflow-hidden text-center py-4 hover:bg-accent/50 transition-colors cursor-default">
              <div className="flex flex-col items-center gap-2">
                <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full"><Flame className="w-6 h-6" /></div>
                <p className="text-2xl font-black text-foreground">5</p>
                <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  {"Beruntun"}
                </p>
              </div>
            </Card>
          </div>
          <Button variant="destructive" onClick={logout} className="w-full h-14 font-bold text-lg gap-3 mt-4 shadow-sm hover:shadow-md transition-all">
            <LogOut className="w-5 h-5" /> {"Keluar Akun"}
          </Button>
        </AnimatedContent>
        <AnimatedContent distance={40} delay={0.3} direction="vertical" className="lg:col-span-8 space-y-6">
          <Card className="border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border py-4 px-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{"Preferensi Umum"}</CardTitle>
            </CardHeader>
            <div className="flex flex-col divide-y divide-border text-foreground">
              {/* MODE APLIKASI */}
              <button onClick={handleToggleMode} className="flex items-center justify-between p-6 hover:bg-accent transition text-left group">
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-xl ${themeBg} ${themeColor} group-hover:scale-110 transition-transform`}>
                    {isPersonal ? <User className="w-6 h-6" /> : <Store className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-lg font-bold">{"Mode Aplikasi"}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isPersonal ? "Mengelola keuangan pribadi" : "Mengelola keuangan UMKM"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
              {/* TEMA */}
              <button onClick={toggleTheme} className="flex items-center justify-between p-6 hover:bg-accent transition text-left group">
                <div className="flex items-center gap-5">
                  <div className="p-4 rounded-xl bg-muted group-hover:scale-110 transition-transform">
                    {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-lg font-bold">{"Tema Tampilan"}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isDark ? "Mode Gelap" : "Mode Terang"}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-bold w-12 text-center ${isDark ? "text-blue-500" : "text-muted-foreground"}`}>{isDark ? "ON" : "OFF"}</span>
              </button>
              {/* NOTIFIKASI */}
              <button onClick={toggleNotifications} className="flex items-center justify-between p-6 hover:bg-accent transition text-left group">
                <div className="flex items-center gap-5">
                  <div className="p-4 rounded-xl bg-muted group-hover:scale-110 transition-transform"><Bell className="w-6 h-6" /></div>
                  <div>
                    <p className="text-lg font-bold">{"Notifikasi Push"}</p>
                    <p className="text-sm text-muted-foreground mt-1">{"Atur peringatan transaksi dan promo"}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold w-12 text-center ${notifications ? "text-blue-500" : "text-muted-foreground"}`}>{notifications ? "ON" : "OFF"}</span>
              </button>
              {/* ACHIEVEMENTS */}
              <Link to="/gamification" className="flex items-center justify-between p-6 hover:bg-accent transition block w-full group">
                <div className="flex items-center gap-5">
                  <div className="p-4 rounded-xl bg-muted group-hover:scale-110 transition-transform"><Trophy className="w-6 h-6 text-yellow-500" /></div>
                  <div className="text-left">
                    <p className="text-lg font-bold">{"Pencapaian"}</p>
                    <p className="text-sm text-muted-foreground mt-1">{"Lihat Level Finansial & Koleksi Lencana"}</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            </div>
          </Card>
          {/* SECURITY & HELP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border bg-card shadow-sm overflow-hidden flex flex-col h-full">
              <CardHeader className="bg-muted/30 border-b border-border py-4 px-6 relative overflow-hidden">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{"Akun & Keamanan"}</CardTitle>
              </CardHeader>
              <div className="flex flex-col divide-y divide-border flex-1">
                <NavLink to="/profile/settings" className="flex items-center justify-between p-6 hover:bg-accent transition text-left group flex-1">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-muted group-hover:scale-110 transition-transform"><Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /></div>
                    <p className="text-base font-bold">{"Ubah PIN & Sandi"}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </NavLink>
                <NavLink to="/profile/settings" className="flex items-center justify-between p-6 hover:bg-accent transition text-left group flex-1">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-muted group-hover:scale-110 transition-transform"><Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" /></div>
                    <p className="text-base font-bold">{"Pengaturan"}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </NavLink>
              </div>
            </Card>
            <Card className="border-border bg-card shadow-sm overflow-hidden flex flex-col h-full text-foreground">
              <CardHeader className="bg-muted/30 border-b border-border py-4 px-6 relative overflow-hidden">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{"Bantuan"}</CardTitle>
              </CardHeader>
              <div className="flex flex-col divide-y divide-border flex-1">
                <Link to="/profile/about" className="flex items-center justify-between p-6 hover:bg-accent transition text-left group flex-1">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-muted group-hover:scale-110 transition-transform"><CircleHelp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /></div>
                    <p className="text-base font-bold">{"Tentang KasFlow"}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
              </div>
            </Card>
          </div>
        </AnimatedContent>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in">
          <div className="bg-background border border-border p-6 rounded-2xl w-full max-w-sm shadow-2xl space-y-6">
            <h3 className="text-xl font-bold text-foreground text-center">Edit Profil</h3>
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3">
                <label className="relative flex flex-col items-center justify-center w-28 h-28 rounded-full border-2 border-dashed border-muted-foreground/50 hover:border-primary/50 bg-muted/30 cursor-pointer overflow-hidden transition-colors group">
                  {editAvatar ? (
                    <img src={URL.createObjectURL(editAvatar)} alt="Preview" className="w-full h-full object-cover" />
                  ) : avatarUrl ? (
                    <img src={avatarUrl} alt={userName} className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                      <Camera className="w-8 h-8 mb-1" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider">Ubah Foto</span>
                    </div>
                  )}
                  {!editAvatar && avatarUrl && (
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                       <Camera className="w-8 h-8 text-white drop-shadow-md" />
                     </div>
                  )}
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && setEditAvatar(e.target.files[0])}
                    className="hidden"
                  />
                </label>
                {editAvatar && (
                  <button 
                    onClick={() => setEditAvatar(null)} 
                    className="text-xs text-destructive hover:underline flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Hapus Foto Terpilih
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground ml-1">Nama Lengkap</label>
                <Input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="h-12 px-4 rounded-xl"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
              <Button onClick={handleSaveProfile} disabled={isSaving}>{isSaving ? "Menyimpan..." : "Simpan"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}