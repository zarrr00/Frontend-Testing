import { useState, useEffect } from "react";
import DesktopProfile from "./components/DesktopProfile";
import MobileProfile from "./components/MobileProfile";
export default function Profile() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isDesktop ? <DesktopProfile /> : <MobileProfile />;
}