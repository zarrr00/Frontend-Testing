import { createContext, useContext, useState, useEffect } from 'react';

// 1. Buat Context Mode
const ModeContext = createContext();

// 2. Provider Context
export function ModeProvider({ children }) {
  // Ambil mode dari storage, default 'umkm'
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('kasflow-mode') || 'umkm'; 
  });

  // Simpan mode ke storage tiap berubah
  useEffect(() => {
    localStorage.setItem('kasflow-mode', mode);
  }, [mode]);

  // Toggle Mode Personal/UMKM
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'umkm' ? 'personal' : 'umkm'));
  };

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

// 3. Hook Khusus Mode
export const useMode = () => useContext(ModeContext);