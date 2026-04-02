import { createContext, useContext, useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
const ModeContext = createContext();
export function ModeProvider({ children }) {
  // Mode
  const [mode, setMode] = useState(() => localStorage.getItem('kasflow-mode') || 'umkm');
  
  // Theme
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  
  // Notifications
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  useEffect(() => localStorage.setItem('kasflow-mode', mode), [mode]);
  useEffect(() => localStorage.setItem('notifications', JSON.stringify(notifications)), [notifications]);
  const toggleMode = () => setMode((prev) => (prev === 'umkm' ? 'personal' : 'umkm'));
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    if (!document.startViewTransition) { setTheme(nextTheme); return; }
    document.startViewTransition(() => { flushSync(() => setTheme(nextTheme)); });
  };
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
export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) throw new Error("useMode must be used within a ModeProvider!");
  return context;
};