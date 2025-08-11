import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  name: string;
  email: string;
  role: 'admin' | 'employee';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

const login = async (email: string, password: string): Promise<User> => {
const response = await axios.post('https://timesheet-backend-production-283f.up.railway.app/api/auth/login', { email, password });

  const { user: userData, token } = response.data;

  // ✅ Normalize and enforce role presence
  const user = {
    name: userData.name,
    email: userData.email,
    role: userData.role || 'employee', // fallback for safety
  };

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  setUser(user); // ✅ this ensures correct role context
  setToken(token);
  return user;
};



  const register = async (data: any) => {
    await axios.post('/api/auth/register', data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
