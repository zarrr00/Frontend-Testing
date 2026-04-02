import { useState, useEffect } from 'react';
import DesktopGoals from './components/DesktopGoals';
import MobileGoals from './components/MobileGoals';

export default function Goals() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop ? <DesktopGoals /> : <MobileGoals />;
}
