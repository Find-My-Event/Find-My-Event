import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  age?: number | string;
  gender?: string;
  education?: {
    collegeName?: string;
    department?: string;
    course?: string;
    year?: string;
  };
  interests?: string[];
  hobbies?: string[];
  phone?: string;
  authProvider?: string;
  favEvents?: string[];
  hasCompletedProfile?: boolean;
  role: 'user' | 'admin' | 'organizer';
  notifyEmail?: boolean;
  publicProfile?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  register: (name: string, email: string, password: string) => Promise<any>;
  verifyOtp: (email: string, otp: string) => Promise<any>;
  resendOtp: (email: string) => Promise<any>;
  handleLogin: (email: string, password: string) => Promise<any>;
  loginWithToken: (token: string) => Promise<void>;
  setupProfile: (profileData: any) => Promise<any>;
  uploadAvatar: (file: File) => Promise<string>;
  updateProfile: (profileData: any) => Promise<any>;
  updateSettings: (payload: { notifyEmail?: boolean; publicProfile?: boolean }) => Promise<any>;
  refreshUser: () => Promise<void>;
  logout: () => void;
  mockLogin: () => void;
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
    if (token === 'mock_token') {
      setUser({ id: 'mock_org', name: 'Mock Organizer', email: 'organizer@eventum.com', role: 'admin' });
      setLoading(false);
      return;
    }
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
    if (!token || token === 'mock_token') return;
    try {
      const { data } = await api.get<User>('/auth/me');
      setUser({ ...data, id: String(data.id) });
    } catch {
      /* ignore */
    }
  }, [token]);

  const register = (name: string, email: string, password: string) => {
    localStorage.removeItem('token');
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

  const resendOtp = async (email: string) => {
    const { data } = await api.post('/auth/resend-otp', { email });
    return data;
  };

  const handleLogin = async (email: string, password: string) => {
    if (email === 'organizer@eventum.com' && password === 'organizer123') {
      const fakeUser: User = { id: 'mock_org', name: 'Mock Organizer', email: 'organizer@eventum.com', role: 'admin' };
      setToken('mock_token');
      localStorage.setItem('token', 'mock_token');
      setUser(fakeUser);
      return { user: fakeUser, token: 'mock_token' };
    }

    // Ensure no mock_token blocks the real login request
    localStorage.removeItem('token');
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);
    localStorage.setItem('token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser({ ...data.user, id: String(data.user.id) });
    return data;
  };

  const loginWithToken = async (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    try {
      const { data } = await api.get<User>('/auth/me');
      setUser({ ...data, id: String(data.id) });
    } catch (err) {
      setToken(null);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const setupProfile = async (profileData: any) => {
    if (!user) throw new Error('User not registered in session');
    const { data } = await api.post('/auth/setup-profile', { userId: user.id || (user as any)._id, ...profileData });
    setUser({ ...data.user, id: String(data.user.id) });
    return data;
  };

  const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await api.post('/auth/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.url;
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

  const mockLogin = () => {
    const fakeUser: User = { id: 'mock_org', name: 'Mock Organizer', email: 'org@mock.com', role: 'admin' };
    setToken('mock_token');
    localStorage.setItem('token', 'mock_token');
    setUser(fakeUser);
    window.location.hash = '#organizer-dashboard/my-events';
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
    <AuthContext.Provider value={{ user, token, loading, register, verifyOtp, resendOtp, handleLogin, loginWithToken, setupProfile, uploadAvatar, updateProfile, updateSettings, refreshUser, logout, mockLogin, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
