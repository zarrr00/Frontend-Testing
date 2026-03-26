import React from 'react';
import FloatingLines from '../components/ui/FloatingLines';
import LoginGlassCard from '../components/auth/LoginGlassCard';

// Halaman utilitas batas layar Login
const Login = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex flex-col font-sans">
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <FloatingLines 
          linesGradient={['#5227FF', '#B19EEF', '#170D27']}
          animationSpeed={1.5}
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
