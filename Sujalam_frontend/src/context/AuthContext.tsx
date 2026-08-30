import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../services/types';
import { authApi } from '../services/authApi';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loginAsDemo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use localStorage so session persists across tab close/reopen
const TOKEN_KEY = 'sujalam_auth_token';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const setStoredToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearStoredToken = () => localStorage.removeItem(TOKEN_KEY);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = async () => {
    try {
      if (!getStoredToken()) throw new Error('No token');
      const me = await authApi.getMe();
      setUser({
        id: me._id || me.id,
        name: me.name,
        email: me.email,
        phone: me.phone || '',
        language: me.language || 'en'
      });
    } catch {
      setUser(null);
      clearStoredToken();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
    const onUnauthorized = () => {
      setUser(null);
      clearStoredToken();
      // Redirect to login on 401
      window.location.href = '/login';
    };
    window.addEventListener('auth:unauthorized', onUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', onUnauthorized);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password });
      setStoredToken(res.token);
      // Clear cached farm data from previous user
      localStorage.removeItem('sujalam_cache_farm');
      localStorage.removeItem('sujalam_cache_crop');
      localStorage.removeItem('sujalam_cache_advisory');
      await fetchMe();
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await authApi.register({ name, email, password });
      await login(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    clearStoredToken();
    // Clear ALL cached data on logout for security
    const keysToRemove = [
      'sujalam_cache_farm',
      'sujalam_cache_crop',
      'sujalam_cache_advisory',
      'sujalam_cache_weather',
      'sujalam_cache_soil',
      'sujalam_cache_market',
      'sujalam_cache_crop_health',
      'sujalam_cache_last_sync',
    ];
    keysToRemove.forEach(k => localStorage.removeItem(k));
  };

  const loginAsDemo = async () => {
    await login('demo@sujalam.com', 'demo123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
