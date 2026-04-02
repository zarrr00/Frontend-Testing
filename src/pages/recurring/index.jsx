import { useState, useEffect } from 'react';
import DesktopRecurring from './components/DesktopRecurring';
import MobileRecurring from './components/MobileRecurring';

export default function Recurring() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop ? <DesktopRecurring /> : <MobileRecurring />;
}
