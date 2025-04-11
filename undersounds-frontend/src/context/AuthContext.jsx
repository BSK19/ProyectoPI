import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado para almacenar al usuario autenticado
  const [user, setUser] = useState(null);
  // Estado para controlar cuando se ha terminado el intento de refresco
  const [loading, setLoading] = useState(true);

  // Función para obtener datos del usuario usando un token
  const fetchUserWithToken = async (token) => {
    if (!token) return null;
    
    try {
      // Configurar el token para todas las solicitudes
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Obtener datos del usuario
      const response = await axios.get('http://localhost:5000/api/auth/me');
      
      if (response.data && response.data.account) {
        return response.data.account;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener datos del usuario con token:', error);
      return null;
    }
  };

  // Efecto para intentar refrescar la sesión al montar la aplicación
  useEffect(() => {
    const refreshSession = async () => {
      try {
        console.log("Intentando refrescar la sesión...");
        
        // Verificar si hay un token en localStorage (para OAuth)
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await fetchUserWithToken(token);
          if (userData) {
            setUser(userData);
            setLoading(false);
            return;
          } else {
            // Limpiar token inválido
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
          }
        }
        
        // Si no hay token o falla, intentar refrescar con el método normal
        try {
          const { account, accessToken } = await authService.refreshToken();
          if (account) {
            setUser(account);
            console.log("Sesión refrescada exitosamente:", account);
          } else {
            console.log("La respuesta de refreshToken no devolvió account.");
          }
        } catch (refreshError) {
          console.error("Error en refreshToken:", refreshError);
        }
      } catch (error) {
        console.error("No se pudo refrescar la sesión:", error);
      } finally {
        setLoading(false);
      }
    };

    refreshSession();
  }, []);

  // Función login mejorada para soportar tanto login normal como OAuth
  const login = async (emailOrUserData, passwordOrToken, remember) => {
    try {
      // Verificar si es un login OAuth (recibe objeto de usuario y token)
      if (typeof emailOrUserData === 'object' && passwordOrToken) {
        // Login con OAuth (userData y token)
        
        // Guardar el token
        localStorage.setItem('token', passwordOrToken);
        
        // Verificar que tenemos todos los datos necesarios, sino obtenerlos
        if (!emailOrUserData.username || !emailOrUserData.email) {
          const fullUserData = await fetchUserWithToken(passwordOrToken);
          if (fullUserData) {
            setUser(fullUserData);
          } else {
            setUser(emailOrUserData);
          }
        } else {
          setUser(emailOrUserData);
        }
        
        // Configurar el token para futuras solicitudes
        axios.defaults.headers.common['Authorization'] = `Bearer ${passwordOrToken}`;
        return;
      } 
      
      // Login normal
      const { account, accessToken } = await authService.login(emailOrUserData, passwordOrToken, remember);
      console.log("Login normal exitoso:", account);
      setUser(account);
      
      // Almacenar el token para futuras solicitudes
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Intentar logout normal
      await authService.logout();
      
      // Limpiar también el token almacenado (para OAuth)
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      const response = await authService.register(formData);
      if (response && response.account) {
        setUser(response.account);
        
        // Almacenar el token para futuras solicitudes
        if (response.accessToken) {
          localStorage.setItem('token', response.accessToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`;
        }
      }
      return response;
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