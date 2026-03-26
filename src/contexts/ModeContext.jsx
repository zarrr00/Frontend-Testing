import { createContext, useContext, useState, useEffect } from 'react';

const ModeContext = createContext();

export function ModeProvider({ children }) {
  // 1. State Mode (UMKM/Personal)
  const [mode, setMode] = useState(() => localStorage.getItem('kasflow-mode') || 'umkm');

  // 2. State Theme (Light/Dark) - Ambil dari localStorage
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // 3. State Notifications
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // EFFECT UNTUK THEME: Biar pas aplikasi jalan, class .dark langsung kepasang
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Simpan Mode ke Storage
  useEffect(() => {
    localStorage.setItem('kasflow-mode', mode);
  }, [mode]);

  // Simpan Notif ke Storage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // --- SEMUA FUNGSI TOGGLE ---
  const toggleMode = () => setMode((prev) => (prev === 'umkm' ? 'personal' : 'umkm'));
  
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const toggleNotifications = () => setNotifications((prev) => !prev);

  return (
    <ModeContext.Provider 
      value={{ 
        mode, 
        theme, 
        notifications, 
        toggleMode, 
        toggleTheme, 
        toggleNotifications 
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export const useMode = () => useContext(ModeContext);