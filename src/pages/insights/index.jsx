import React, { useState, useEffect } from 'react';
import DesktopInsights from './components/DesktopInsights';
import MobileInsights from './components/MobileInsights';

export default function Insights() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop ? <DesktopInsights /> : <MobileInsights />;
}