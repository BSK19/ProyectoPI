import React, { createContext, useState } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Simulación: ningún usuario autenticado y sin "loading"
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        try {
            // authService.login recibe las credenciales (simuladas)
            const userCredential = await authService.login({ email, password });
            setUser(userCredential);
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
            // authService.register recibe las credenciales (simuladas)
            const userCredential = await authService.register({ email, password });
            setUser(userCredential);
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};