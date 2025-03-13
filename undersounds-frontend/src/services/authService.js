// Nota: Cuando exista backend, descomenta las llamadas a la API.
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const login = async (credentials) => {
    try {
        // Cuando tengas backend:
        // const response = await axios.post(`${API_URL}/login`, credentials);
        // return response.data;

        // Simulando un login exitoso:
        return { userId: 1, name: 'Usuario de Prueba', token: 'fake-jwt-token' };
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        // Si tu backend requiere una petición para logout:
        // const response = await axios.post(`${API_URL}/logout`);
        // return response.data;

        // Simulando logout:
        return { success: true };
    } catch (error) {
        console.error('Error during logout:', error);
        throw error;
    }
};

export const register = async (data) => {
    try {
        // Con backend:
        // const response = await axios.post(`${API_URL}/register`, data);
        // return response.data;

        // Simulando un registro exitoso:
        return { userId: 2, name: data.name, token: 'fake-jwt-token' };
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};

export const updateUserProfile = async (data) => {
    try {
        // Simulación de actualización exitosa del perfil:
        return { userId: data.userId, name: data.name, email: data.email, token: 'fake-jwt-token' };
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

export const authService = { login, logout, register, updateUserProfile };