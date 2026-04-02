import { useState, useEffect } from 'react';
import DesktopDebts from './components/DesktopDebts';
import MobileDebts from './components/MobileDebts';

export default function Debts() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop ? <DesktopDebts /> : <MobileDebts />;
}
