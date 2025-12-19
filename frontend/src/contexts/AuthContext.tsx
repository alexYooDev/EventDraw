import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (businessName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      // Set token in axios headers
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { access_token } = response.data;
      
      // Save token
      setToken(access_token);
      setIsAuthenticated(true);
      localStorage.setItem('admin_token', access_token);
      
      // Set token in axios headers
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (businessName: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post('/auth/register', { 
        business_name: businessName, 
        email, 
        password 
      });
      const { access_token } = response.data;
      
      // Save token
      setToken(access_token);
      setIsAuthenticated(true);
      localStorage.setItem('admin_token', access_token);
      
      // Set token in axios headers
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('admin_token');
    delete apiClient.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
