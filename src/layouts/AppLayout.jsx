import { Outlet, NavLink } from 'react-router-dom';
import { Home, Receipt, PlusCircle, Plus, WalletCards, User, Store, PieChart, UserCircle } from 'lucide-react';
import { useMode } from '../contexts/ModeContext';
import AIChatBot from '../components/chat/AIChatBot';

export default function AppLayout() {
  const { mode, toggleMode } = useMode();

  const isPersonal = mode === 'personal';
  
  // Warna Mode Desktop
  const modeColor = isPersonal ? 'bg-purple-600' : 'bg-blue-600';
  const modeBg = isPersonal ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700';
  const activeIconColor = isPersonal ? 'text-purple-600' : 'text-blue-600';

  // Warna Tombol Tambah (FAB)
  const fabGradient = isPersonal 
    ? 'bg-gradient-to-tr from-purple-600 to-pink-500 shadow-purple-500/40' 
    : 'bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-blue-500/40';

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-4 shadow-sm z-10">
        <div className="flex items-center gap-2 mb-6 px-2">
          <WalletCards className={`w-8 h-8 ${activeIconColor}`} />
          <h1 className="text-2xl font-bold text-slate-900">Kas<span className={activeIconColor}>Flow</span></h1>
        </div>

        <div className="mb-6 p-1 bg-slate-100 rounded-lg flex">
          <button onClick={toggleMode} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all ${isPersonal ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <User className="w-4 h-4" /> Personal
          </button>
          <button onClick={toggleMode} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all ${!isPersonal ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <Store className="w-4 h-4" /> UMKM
          </button>
        </div>
        
        <nav className="flex flex-col gap-1.5">
          <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-all font-medium ${isActive ? modeBg : "text-slate-600 hover:bg-slate-100"}`}>
            <Home className="w-5 h-5" /> Dashboard
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-all font-medium ${isActive ? modeBg : "text-slate-600 hover:bg-slate-100"}`}>
            <Receipt className="w-5 h-5" /> Transaksi
          </NavLink>
          <NavLink to="/insights" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-all font-medium ${isActive ? modeBg : "text-slate-600 hover:bg-slate-100"}`}>
            <PieChart className="w-5 h-5" /> Insight
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-all font-medium ${isActive ? modeBg : "text-slate-600 hover:bg-slate-100"}`}>
            <UserCircle className="w-5 h-5" /> Profil
          </NavLink>
          <NavLink to="/add" className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-all font-medium mt-4 ${isActive ? `${modeColor} text-white shadow-md` : "bg-slate-900 text-white shadow-md hover:bg-slate-800"}`}>
            <PlusCircle className="w-5 h-5" /> Catat Transaksi
          </NavLink>
        </nav>
      </aside>

      {/* Area Konten Utama */}
      <main className="flex-1 overflow-y-auto pb-28 md:pb-0 relative">
        <div className="md:hidden absolute top-4 right-4 z-50">
          <button onClick={toggleMode} className={`flex items-center gap-2 px-3 py-1.5 rounded-full shadow-md text-xs font-bold text-white transition-all ${modeColor}`}>
            {isPersonal ? <><User className="w-3 h-3" /> Personal Mode</> : <><Store className="w-3 h-3" /> UMKM Mode</>}
          </button>
        </div>
        <Outlet />
      </main>

      {/* Navigasi Bawah Mobile */}
      
      <div className="fixed bottom-6 left-4 right-4 z-50 md:hidden animate-in slide-in-from-bottom-12 fade-in duration-700 ease-out">
        <nav className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl flex justify-between items-center px-4 py-3 relative">
          
          {/* Menu Dashboard */}
          <NavLink to="/dashboard" className={({ isActive }) => `group flex flex-col items-center flex-1 transition-all duration-300 ${isActive ? activeIconColor : "text-slate-400 hover:text-slate-600 hover:-translate-y-1"}`}>
            {({ isActive }) => (
              <>
                <Home className={`w-6 h-6 mb-1 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-active:scale-95'}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] transition-all ${isActive ? "font-bold" : "font-medium"}`}>Beranda</span>
                <div className={`w-1 h-1 rounded-full mt-1 transition-all duration-300 ${isActive ? modeColor : 'bg-transparent'}`}></div>
              </>
            )}
          </NavLink>

          {/* Menu Transaksi */}
          <NavLink to="/transactions" className={({ isActive }) => `group flex flex-col items-center flex-1 transition-all duration-300 ${isActive ? activeIconColor : "text-slate-400 hover:text-slate-600 hover:-translate-y-1"}`}>
            {({ isActive }) => (
              <>
                <Receipt className={`w-6 h-6 mb-1 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-active:scale-95'}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] transition-all ${isActive ? "font-bold" : "font-medium"}`}>Transaksi</span>
                <div className={`w-1 h-1 rounded-full mt-1 transition-all duration-300 ${isActive ? modeColor : 'bg-transparent'}`}></div>
              </>
            )}
          </NavLink>

          {/* Tombol Tambah Transaksi */}
          <div className="relative flex justify-center w-14">
            <NavLink 
              to="/add" 
              className={({ isActive }) => `absolute -bottom-6 flex items-center justify-center w-14 h-14 rounded-full text-white shadow-xl transition-all duration-300 active:scale-95 group hover:-translate-y-1 ${isActive ? (isPersonal ? "bg-purple-800 shadow-purple-900/40" : "bg-blue-800 shadow-blue-900/40") : fabGradient}`}
            >
              <Plus className="w-7 h-7 transition-transform duration-500 group-hover:rotate-90" strokeWidth={2.5} />
            </NavLink>
          </div>

          {/* Menu Insight */}
          <NavLink to="/insights" className={({ isActive }) => `group flex flex-col items-center flex-1 transition-all duration-300 ${isActive ? activeIconColor : "text-slate-400 hover:text-slate-600 hover:-translate-y-1"}`}>
            {({ isActive }) => (
              <>
                <PieChart className={`w-6 h-6 mb-1 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-active:scale-95'}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] transition-all ${isActive ? "font-bold" : "font-medium"}`}>Insight</span>
                <div className={`w-1 h-1 rounded-full mt-1 transition-all duration-300 ${isActive ? modeColor : 'bg-transparent'}`}></div>
              </>
            )}
          </NavLink>

          {/* Menu Profil */}
          <NavLink to="/profile" className={({ isActive }) => `group flex flex-col items-center flex-1 transition-all duration-300 ${isActive ? activeIconColor : "text-slate-400 hover:text-slate-600 hover:-translate-y-1"}`}>
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