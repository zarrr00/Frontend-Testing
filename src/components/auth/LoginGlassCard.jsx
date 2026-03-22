import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff, User, Lock, AlertCircle } from 'lucide-react';

const LoginGlassCard = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmFocused, setIsConfirmFocused] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan Konfirmasi Password tidak sama!');
      return;
    }

    // Arahkan otomatis ke dashboard
    navigate('/dashboard');
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <>
      <style>
        {`
          @keyframes scanner {
            0% { left: -30%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { left: 120%; opacity: 0; }
          }
          .animate-scanner {
            animation: scanner 2s linear infinite;
          }
        `}
      </style>
      <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-[#0D0716]/60 border border-purple-500/30 shadow-[0_0_20px_rgba(82,39,255,0.15)] z-20 relative">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Masuk ke Kasflow</h2>
          <p className="text-purple-300/80 text-sm">Kelola arus kasmu dengan lebih cerdas</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Pesan Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg text-sm border border-red-400/20 mb-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Input Nama */}
          <div className="relative w-full rounded-xl bg-white/5 border border-purple-500/30 focus-within:border-purple-400 transition-colors shadow-inner">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <User size={18} className="text-purple-400/80" />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Nama"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent text-white placeholder-purple-300/40 py-3.5 pl-11 pr-4 outline-none relative z-10"
            />
          </div>

          {/* Input Password (Efek Lampu) */}
          <div className={`relative w-full overflow-hidden rounded-xl bg-white/5 border ${error ? 'border-red-500/50' : 'border-purple-500/30'} focus-within:${error ? 'border-red-400' : 'border-purple-400'} transition-colors shadow-inner`}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-20">
              <Lock size={18} className="text-purple-400/80" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              className="w-full bg-transparent text-white placeholder-purple-300/40 py-3.5 pl-11 pr-12 outline-none relative z-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-purple-400/80 hover:text-purple-300 transition-colors z-20"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {/* Efek Scanner */}
            {isPasswordFocused && (
               <div className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent animate-scanner pointer-events-none z-0 transform -skew-x-12" />
            )}
          </div>

          {/* Input Konfirmasi Password (Efek Lampu) */}
          <div className={`relative w-full overflow-hidden rounded-xl bg-white/5 border ${error ? 'border-red-500/50' : 'border-purple-500/30'} focus-within:${error ? 'border-red-400' : 'border-purple-400'} transition-colors shadow-inner`}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-20">
              <Lock size={18} className="text-purple-400/80" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Konfirmasi Password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              onFocus={() => setIsConfirmFocused(true)}
              onBlur={() => setIsConfirmFocused(false)}
              className="w-full bg-transparent text-white placeholder-purple-300/40 py-3.5 pl-11 pr-12 outline-none relative z-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-purple-400/80 hover:text-purple-300 transition-colors z-20"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {/* Efek Scanner */}
            {isConfirmFocused && (
               <div className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent animate-scanner pointer-events-none z-0 transform -skew-x-12" />
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(82,39,255,0.3)] hover:shadow-[0_0_20px_rgba(82,39,255,0.5)] active:scale-[0.98]"
          >
            Masuk / Daftar
          </button>
          
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-purple-500/20"></div>
          <span className="text-purple-300/50 text-xs tracking-wider uppercase">Atau</span>
          <div className="flex-1 h-px bg-purple-500/20"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white border border-purple-500/40 transition-all duration-300 py-3.5 px-4 rounded-xl font-medium"
        >
          <LogIn size={20} className="text-purple-400" />
          Lanjutkan dengan Google
        </button>
      </div>
    </>
  );
};

export default LoginGlassCard;