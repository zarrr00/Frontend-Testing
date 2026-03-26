import { Outlet, NavLink } from 'react-router-dom';
import { Home, Receipt, PlusCircle, Plus, WalletCards, User, Store, PieChart, UserCircle } from 'lucide-react';
import { useMode } from '../contexts/ModeContext';
import AIChatBot from '../components/chat/AIChatBot';

export default function AppLayout() {
  const { mode, toggleMode, theme } = useMode();

  const isPersonal = mode === 'personal';
  const isDark = theme === 'dark';
  
  // Warna Mode Desktop
  const modeColor = isPersonal ? 'bg-purple-600' : 'bg-blue-600';
  
  // Modifikasi modeBg agar lebih soft di Dark Mode
  const modeBg = isPersonal 
    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    
  const activeIconColor = isPersonal ? 'text-purple-600' : 'text-blue-600';

  // Warna Tombol Tambah (FAB)
  const fabGradient = isPersonal 
    ? 'bg-gradient-to-tr from-purple-600 to-pink-500 shadow-purple-500/40' 
    : 'bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-blue-500/40';

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden transition-colors duration-300 font-sans">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border p-4 shadow-sm z-10 transition-colors">
        <div className="flex items-center gap-2 mb-6 px-2">
          <WalletCards className={`w-8 h-8 ${activeIconColor}`} />
          <h1 className="text-2xl font-bold tracking-tight">
            Kas<span className={activeIconColor}>Flow</span>
          </h1>
        </div>

        {/* Switcher Mode */}
        <div className="mb-6 p-1 bg-muted rounded-xl flex border border-border">
          <button onClick={toggleMode} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${isPersonal ? 'bg-card text-purple-600 dark:text-purple-400 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            <User className="w-4 h-4" /> Personal
          </button>
          <button onClick={toggleMode} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${!isPersonal ? 'bg-card text-blue-600 dark:text-blue-400 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            <Store className="w-4 h-4" /> UMKM
          </button>
        </div>
        
        <nav className="flex flex-col gap-1.5">
          <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm ${isActive ? modeBg : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>
            <Home className="w-5 h-5" /> Dashboard
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm ${isActive ? modeBg : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>
            <Receipt className="w-5 h-5" /> Transaksi
          </NavLink>
          <NavLink to="/insights" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm ${isActive ? modeBg : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>
            <PieChart className="w-5 h-5" /> Insight
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm ${isActive ? modeBg : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>
            <UserCircle className="w-5 h-5" /> Profil
          </NavLink>
          
          <NavLink to="/add" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm mt-4 ${isActive ? `${modeColor} text-white shadow-lg` : "bg-foreground text-background shadow-md hover:opacity-90"}`}>
            <PlusCircle className="w-5 h-5" /> Catat Transaksi
          </NavLink>
        </nav>
      </aside>

      {/* Area Konten Utama */}
      <main className="flex-1 overflow-y-auto pb-28 md:pb-0 relative bg-background">
        {/* Floating Mode Toggle Mobile */}
        <div className="md:hidden absolute top-4 right-4 z-50">
          <button onClick={toggleMode} className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-lg text-xs font-bold text-white transition-all active:scale-95 ${modeColor}`}>
            {isPersonal ? <><User className="w-3.5 h-3.5" /> Personal</> : <><Store className="w-3.5 h-3.5" /> UMKM</>}
          </button>
        </div>
        <Outlet />
      </main>

      {/* Navigasi Bawah Mobile */}
      <div className="fixed bottom-6 left-4 right-4 z-50 md:hidden animate-in slide-in-from-bottom-12 fade-in duration-700 ease-out">
        <nav className="bg-card/80 dark:bg-card/90 backdrop-blur-xl border border-border shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-3xl flex justify-between items-center px-4 py-3 relative transition-colors">
          
          <NavLink to="/dashboard" className={({ isActive }) => `group flex flex-col items-center flex-1 transition-all duration-300 ${isActive ? activeIconColor : "text-muted-foreground hover:text-foreground"}`}>
            {({ isActive }) => (
              <>
                <Home className={`w-6 h-6 mb-1 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-active:scale-95'}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] transition-all ${isActive ? "font-bold" : "font-medium"}`}>Beranda</span>
                <div className={`w-1 h-1 rounded-full mt-1 transition-all duration-300 ${isActive ? modeColor : 'bg-transparent'}`}></div>
              </>
            )}
          </NavLink>

          <NavLink to="/transactions" className={({ isActive }) => `group flex flex-col items-center flex-1 transition-all duration-300 ${isActive ? activeIconColor : "text-muted-foreground hover:text-foreground"}`}>
            {({ isActive }) => (
              <>
                <Receipt className={`w-6 h-6 mb-1 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-active:scale-95'}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] transition-all ${isActive ? "font-bold" : "font-medium"}`}>Transaksi</span>
                <div className={`w-1 h-1 rounded-full mt-1 transition-all duration-300 ${isActive ? modeColor : 'bg-transparent'}`}></div>
              </>
            )}
          </NavLink>

          {/* Tombol Tambah Transaksi (FAB) */}
          <div className="relative flex justify-center w-14">
            <NavLink 
              to="/add" 
              className={({ isActive }) => `absolute -bottom-6 flex items-center justify-center w-14 h-14 rounded-full text-white shadow-xl transition-all duration-300 active:scale-95 group hover:-translate-y-1 ${isActive ? (isPersonal ? "bg-purple-800 shadow-purple-900/40" : "bg-blue-800 shadow-blue-900/40") : fabGradient}`}
            >
              <Plus className="w-7 h-7 transition-transform duration-500 group-hover:rotate-90" strokeWidth={2.5} />
            </NavLink>
          </div>

          <NavLink to="/insights" className={({ isActive }) => `group flex flex-col items-center flex-1 transition-all duration-300 ${isActive ? activeIconColor : "text-muted-foreground hover:text-foreground"}`}>
            {({ isActive }) => (
              <>
                <PieChart className={`w-6 h-6 mb-1 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-active:scale-95'}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] transition-all ${isActive ? "font-bold" : "font-medium"}`}>Insight</span>
                <div className={`w-1 h-1 rounded-full mt-1 transition-all duration-300 ${isActive ? modeColor : 'bg-transparent'}`}></div>
              </>
            )}
          </NavLink>

          <NavLink to="/profile" className={({ isActive }) => `group flex flex-col items-center flex-1 transition-all duration-300 ${isActive ? activeIconColor : "text-muted-foreground hover:text-foreground"}`}>
            {({ isActive }) => (
              <>
                <UserCircle className={`w-6 h-6 mb-1 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-active:scale-95'}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] transition-all ${isActive ? "font-bold" : "font-medium"}`}>Profil</span>
                <div className={`w-1 h-1 rounded-full mt-1 transition-all duration-300 ${isActive ? modeColor : 'bg-transparent'}`}></div>
              </>
            )}
          </NavLink>
        </nav>
      </div>
      <AIChatBot />
    </div>
  );
}