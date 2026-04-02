import React from 'react';
import DesktopSettings from "./components/DesktopSettings";
import MobileSettings from "./components/MobileSettings";
export default function Settings() {
  return (
    <>
      {/* Desktop: Biasa aja */}
      <div className="hidden md:block min-h-screen bg-background relative z-10">
        <DesktopSettings />
      </div>
      {/* Mobile: Pakai Fixed biar dia nutupin SEMUA elemen lain termasuk Bottom Nav */}
      <div className="md:hidden fixed inset-0 bg-background z-[9999] overflow-y-auto">
        <MobileSettings />
      </div>
    </>
  );
}