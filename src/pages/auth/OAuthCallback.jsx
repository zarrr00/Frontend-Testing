import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth.service';
export default function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const handleLogin = async () => {
      // Check both search params (?) and hash fragments (#)
      const params = new URLSearchParams(location.search);
      const hashParams = new URLSearchParams(location.hash.replace('#', '?'));
      
      const accessToken = params.get('access_token') || hashParams.get('access_token');

      if (accessToken) {
        localStorage.setItem('kasflow_token', accessToken);
        try {
          // Fetch user metadata from backend to store in localstorage
          await authService.fetchCurrentUser();
          navigate('/dashboard', { replace: true });
        } catch (err) {
          console.error('Auth check failed:', err);
          navigate('/login', { replace: true });
        }
      } else {
        navigate('/login', { replace: true });
      }
    };
    handleLogin();
  }, [location, navigate]);
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-sans">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-purple-300 font-medium">Memproses Autentikasi...</p>
    </div>
  );
}
