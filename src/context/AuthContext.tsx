import React, { createContext, useContext, useState, ReactNode } from 'react';
import { storageService } from '../services/storageService';

export interface AuthUser {
  username: string;
  name?: string;
  role?: string;
}

export interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => storageService.getAuthSession());

  const login = (username: string, password: string) => {
    if (username.trim().toLowerCase() === 'admin' && password.trim() === 'admin123') {
      const user: AuthUser = { username: 'admin', name: 'Administrador Principal', role: 'admin' };
      storageService.setAuthSession(user);
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, error: 'Usuario o contraseña incorrectos (Por defecto: admin / admin123)' };
  };

  const logout = () => {
    storageService.clearAuthSession();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: !!currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
