import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialAdminAuth } from '../config/initialAuth';
import { supabaseDbService } from '../services/supabaseDbService';
import { storageService } from '../services/storageService';

export interface AuthUser {
  username: string;
  name?: string;
  role?: string;
}

export interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateCredentials: (newUsername: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => storageService.getAuthSession());
  const [adminCredentials, setAdminCredentials] = useState<{ username: string; password: string }>(initialAdminAuth);

  useEffect(() => {
    let isMounted = true;
    async function loadCredentials() {
      try {
        const cloudAuth = await supabaseDbService.getAdminAuth();
        if (!isMounted) return;
        if (cloudAuth && cloudAuth.username && cloudAuth.password) {
          setAdminCredentials(cloudAuth);
        } else {
          // Si no existe en Supabase, inicializarlo con los valores iniciales del código
          supabaseDbService.saveAdminAuth(initialAdminAuth);
        }
      } catch (err) {
        console.warn('Error cargando credenciales desde Supabase:', err);
      }
    }
    loadCredentials();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Primero intentar consultar las credenciales más recientes de Supabase
    let validCredentials = adminCredentials;
    try {
      const freshCloudAuth = await supabaseDbService.getAdminAuth();
      if (freshCloudAuth && freshCloudAuth.username && freshCloudAuth.password) {
        validCredentials = freshCloudAuth;
        setAdminCredentials(freshCloudAuth);
      }
    } catch {
      // Usar las credenciales en memoria si falla la consulta
    }

    const inputUser = username.trim().toLowerCase();
    const targetUser = validCredentials.username.trim().toLowerCase();
    const inputPass = password.trim();
    const targetPass = validCredentials.password.trim();

    if (inputUser === targetUser && inputPass === targetPass) {
      const user: AuthUser = {
        username: validCredentials.username,
        name: 'Administrador Principal',
        role: 'admin'
      };
      storageService.setAuthSession(user);
      setCurrentUser(user);
      return { success: true };
    }

    return { success: false, error: 'Usuario o contraseña incorrectos.' };
  };

  const updateCredentials = async (newUsername: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    const cleanUser = newUsername.trim();
    const cleanPass = newPassword.trim();

    if (!cleanUser || cleanUser.length < 3) {
      return { success: false, error: 'El nombre de usuario debe tener al menos 3 caracteres.' };
    }
    if (!cleanPass || cleanPass.length < 4) {
      return { success: false, error: 'La contraseña debe tener al menos 4 caracteres.' };
    }

    const newAuth = { username: cleanUser, password: cleanPass };
    setAdminCredentials(newAuth);
    const saved = await supabaseDbService.saveAdminAuth(newAuth);
    if (!saved) {
      return { success: false, error: 'No se pudo guardar la contraseña en la base de datos de Supabase.' };
    }

    if (currentUser) {
      const updatedUser = { ...currentUser, username: cleanUser };
      storageService.setAuthSession(updatedUser);
      setCurrentUser(updatedUser);
    }

    return { success: true };
  };

  const logout = () => {
    storageService.clearAuthSession();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: !!currentUser, login, logout, updateCredentials }}>
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
