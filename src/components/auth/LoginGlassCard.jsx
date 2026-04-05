import { useNavigate } from 'react-router-dom';
import { LogIn, Code } from 'lucide-react';
import { authService } from '../../services/auth.service';
const LoginGlassCard = () => {
  const navigate = useNavigate();
  const handleGoogleLogin = (e) => {
    e.preventDefault();
    authService.loginWithGoogle();
  };
  return (
    <>
      <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-[#0D0716]/60 border border-purple-500/30 shadow-[0_0_20px_rgba(82,39,255,0.15)] z-20 relative">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Masuk ke Kasflow</h2>
          <p className="text-purple-300/80 text-sm">Kelola arus kasmu dengan lebih cerdas</p>
        </div>
        
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white border border-purple-500/40 transition-all duration-300 py-4 px-4 rounded-xl font-medium"
        >
          <LogIn size={20} className="text-purple-400" />
          Lanjutkan dengan Google
        </button>
      </div>
    </>
  );
};
export default LoginGlassCard;
