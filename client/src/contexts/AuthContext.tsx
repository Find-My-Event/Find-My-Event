import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  age?: number;
  gender?: string;
  interests?: string[];
  hobbies?: string[];
  favEvents?: string[];
  hasCompletedProfile?: boolean;
  role: 'user' | 'admin';
  notifyEmail?: boolean;
  publicProfile?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  register: (name: string, email: string, password: string) => Promise<any>;
  verifyOtp: (email: string, otp: string) => Promise<any>;
  handleLogin: (email: string, password: string) => Promise<any>;
  setupProfile: (profileData: any) => Promise<any>;
  updateProfile: (profileData: any) => Promise<any>;
  updateSettings: (payload: { notifyEmail?: boolean; publicProfile?: boolean }) => Promise<any>;
  refreshUser: () => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const { data } = await api.get<User>('/auth/me');
      setUser({ ...data, id: String(data.id) });
    } catch (err) {
      setToken(null);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await api.get<User>('/auth/me');
      setUser({ ...data, id: String(data.id) });
    } catch {
      /* ignore */
    }
  }, [token]);

  const register = (name: string, email: string, password: string) => {
    return api.post('/auth/register', { name, email, password });
  };

  const verifyOtp = async (email: string, otp: string) => {
    const { data } = await api.post('/auth/verify-otp', { email, otp });
    setToken(data.token);
    localStorage.setItem('token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser({ ...data.user, id: String(data.user.id) });
    return data;
  };

  const handleLogin = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);
    localStorage.setItem('token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser({ ...data.user, id: String(data.user.id) });
    return data;
  };

  const setupProfile = async (profileData: any) => {
    if (!user) throw new Error('User not registered in session');
    const { data } = await api.post('/auth/setup-profile', { userId: user.id || (user as any)._id, ...profileData });
    setUser({ ...data.user, id: String(data.user.id) });
    return data;
  };

  const updateProfile = async (profileData: any) => {
    if (!user) return;
    // We try PUT update-profile first as it's the more comprehensive one from Remote
    try {
      const { data } = await api.put('/auth/update-profile', { userId: user.id, ...profileData });
      setUser({ ...data.user, id: String(data.user.id) });
      return data;
    } catch {
      // Fallback to PATCH profile if PUT fails (legacy or different logic)
      const { data } = await api.patch('/auth/profile', profileData);
      setUser({ ...data.user, id: String(data.user.id) });
      return data;
    }
  };

  const updateSettings = async (payload: { notifyEmail?: boolean; publicProfile?: boolean }) => {
    const { data } = await api.patch('/auth/settings', payload);
    setUser({ ...data.user, id: String(data.user.id) });
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    window.location.hash = '#home';
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, register, verifyOtp, handleLogin, setupProfile, updateProfile, updateSettings, refreshUser, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
