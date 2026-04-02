import { useNavigate } from 'react-router-dom';
import { LogIn, Code } from 'lucide-react';
import { authService } from '../../services/auth.service';
const LoginGlassCard = () => {
  const navigate = useNavigate();
  const handleDevLogin = (e) => {
    e.preventDefault();
    // Mock Login
    localStorage.setItem('kasflow_token', 'dev_token_123456789');
    localStorage.setItem('kasflow_user', JSON.stringify({
      id: 'dev_user_1',
      name: 'Developer Mode',
      email: 'dev@kasflow.app',
      picture: 'https://ui-avatars.com/api/?name=Developer&background=8b5cf6&color=fff'
    }));
    // Redirect Dashboard
    navigate('/dashboard');
  };
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
          onClick={handleDevLogin}
          className="w-full mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold flex items-center justify-center gap-3 py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(82,39,255,0.3)] hover:shadow-[0_0_20px_rgba(82,39,255,0.5)] active:scale-[0.98]"
        >
          <Code size={20} />
          Login Akses Developer
        </button>
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-purple-500/20"></div>
          <span className="text-purple-300/50 text-xs tracking-wider uppercase">Atau Auth Resmi</span>
          <div className="flex-1 h-px bg-purple-500/20"></div>
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
