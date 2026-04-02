import React, { useState, useEffect } from 'react';
import DesktopGamification from './components/DesktopGamification';
import MobileGamification from './components/MobileGamification';
export default function Gamification() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isDesktop ? <DesktopGamification /> : <MobileGamification />;
}
