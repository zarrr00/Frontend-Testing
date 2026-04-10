import React from 'react';
import DesktopAbout from "./components/DesktopAbout";
import MobileAbout from "./components/MobileAbout";

export default function AboutKasflow() {
  return (
    <>
      {/* Desktop: Biasa */}
      <div className="hidden md:block min-h-screen bg-background relative z-10">
        <DesktopAbout />
      </div>
      {/* Mobile: Fullscreen overlay */}
      <div className="md:hidden fixed inset-0 bg-background z-[9999] overflow-y-auto w-full h-full">
        <MobileAbout />
      </div>
    </>
  );
}
