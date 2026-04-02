import { useState, useEffect } from 'react';
import DesktopPOS from './components/DesktopPOS';
import MobilePOS from './components/MobilePOS';

export default function POS() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop ? <DesktopPOS /> : <MobilePOS />;
}
