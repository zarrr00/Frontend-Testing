import React, { useState, useEffect } from 'react';
import DesktopDashboard from './components/DesktopDashboard';
import MobileDashboard from './components/MobileDashboard';

export default function Dashboard() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    // Check on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop ? <DesktopDashboard /> : <MobileDashboard />;
}