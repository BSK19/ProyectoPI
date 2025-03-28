import React, { createContext, useState } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado para almacenar al usuario autenticado
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

const login = async (email, password) => {
  try {
    const { account, accessToken } = await authService.login(email, password);
    setUser(account);
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      // Si register devuelve { account, accessToken }
      const { account, accessToken } = await authService.register(email, password);
      setUser(account);
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};