import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

/**
 * Provides authentication state and OAuth flow handlers.
 * Checks for existing token on mount and fetches user data if needed.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            // Token exists but no cached user — fetch from API
            const userData = await authService.fetchCurrentUser();
            setUser(userData);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginWithGoogle = () => authService.loginWithGoogle();
  const loginWithGithub = () => authService.loginWithGithub();
  const handleCallback = (hash) => authService.handleOauthCallback(hash);

  const updateUser = async (data) => {
    const updatedUser = await authService.updateCurrentUser(data);
    setUser(updatedUser);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    loginWithGoogle,
    loginWithGithub,
    handleCallback,
    updateUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/** @throws {Error} When used outside of AuthProvider. */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
