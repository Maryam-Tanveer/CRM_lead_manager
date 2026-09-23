import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { getStoredAccessToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('lead_crm_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredAccessToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        if (response?.data?.user) {
          setUser(response.data.user);
          localStorage.setItem('lead_crm_user', JSON.stringify(response.data.user));
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    initAuth();

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setUser(response.data.user);
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    setUser(response.data.user);
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
