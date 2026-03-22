import React from 'react';
import Prism from '../components/shared/Prism';
import LoginGlassCard from '../components/auth/LoginGlassCard';

// Halaman utilitas batas layar Login
const Login = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex flex-col font-sans">
      <div className="absolute inset-0 z-0">
        <Prism 
          animationType="rotate" 
          timeScale={0.3} 
          height={3.5} 
          baseWidth={5.5} 
          scale={3.6} 
          hueShift={0} 
          colorFrequency={1} 
          noise={0} 
          glow={1} 
          colors={['#B19EEF', '#5227FF']}
        />
      </div>
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto w-full flex justify-center">
            <LoginGlassCard />
        </div>
      </div>
    </div>
  );
};

export default Login;
