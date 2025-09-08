import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updateProfile: (name: string, profileImage?: string) => Promise<void>;
  deleteProfileImage: () => Promise<void>;
  logout: (showConfirm?: boolean) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set token ke header axios setiap kali berubah
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Set token untuk semua request axios
    } else {
      // Remove token dari header
    }
  }, [user]);

  // ...existing code...
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          const newUser = response.data.user;
          
          // Check if this is a different user
          const lastUserId = localStorage.getItem('lastUserId');
          if (lastUserId && lastUserId !== newUser.id) {
            // Clear previous user's data
            localStorage.removeItem('learnhub-library');
            localStorage.removeItem('yearlyGoal');
            localStorage.removeItem('monthlyGoal');
            localStorage.removeItem('dailyGoal');
            localStorage.removeItem('goalType');
            localStorage.removeItem('theme');
            localStorage.removeItem('colorScheme');
            localStorage.removeItem('fontSize');
            localStorage.removeItem('compactMode');
            localStorage.removeItem('animations');
          }
          
          localStorage.setItem('lastUserId', newUser.id);
          setUser(newUser);
        } catch (error) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('lastUserId');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('lastUserId', user.id);
      setUser(user);
    } catch (error: any) {
      console.error('Login API error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register({ email, password, name });
      // Registration successful but no auto-login
      return response.data;
    } catch (error: any) {
      console.error('Register API error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';
      const baseUrl = API_BASE_URL.replace('/api', '');
      window.location.href = `${baseUrl}/api/auth/google`;
    } catch (error: any) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const updateProfile = async (name: string, profileImage?: string) => {
    try {
      const response = await authAPI.updateProfile({ name, profileImage });
      setUser(response.data.user);
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const deleteProfileImage = async () => {
    try {
      const response = await authAPI.deleteProfileImage();
      setUser(response.data.user);
    } catch (error: any) {
      console.error('Delete profile image error:', error);
      throw error;
    }
  };

  const logout = (showConfirm = true) => {
    if (showConfirm && !confirm('Are you sure you want to logout?')) {
      return;
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('lastUserId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, updateProfile, deleteProfileImage, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};