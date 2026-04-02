import { useState, useEffect } from 'react';
import DesktopMembers from './components/DesktopMembers';
import MobileMembers from './components/MobileMembers';

export default function Members() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop ? <DesktopMembers /> : <MobileMembers />;
}
