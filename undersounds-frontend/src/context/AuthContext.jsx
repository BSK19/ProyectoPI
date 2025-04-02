import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado para almacenar al usuario autenticado
  const [user, setUser] = useState(null);
  // Estado para controlar cuando se ha terminado el intento de refresco
  const [loading, setLoading] = useState(true);

  // Efecto para intentar refrescar la sesión al montar la aplicación
  useEffect(() => {
    const refreshSession = async () => {
      try {
        console.log("Intentando refrescar la sesión...");
        // Se llama al endpoint de /refresh-token configurado en authService
        const { account, accessToken } = await authService.refreshToken();
        if (account) {
          setUser(account);
          console.log("Sesión refrescada exitosamente:", account);
        } else {
          console.log("La respuesta de refreshToken no devolvió account.");
        }
      } catch (error) {
        console.error("No se pudo refrescar la sesión:", error);
      } finally {
        setLoading(false);
      }
    };

    refreshSession();
  }, []);

  const login = async (email, password, remember) => {
    try {
      const { account, accessToken } = await authService.login(email, password, remember);
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