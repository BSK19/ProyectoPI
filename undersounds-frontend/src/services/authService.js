import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';

// Habilitar el envío de cookies en cada petición
axios.defaults.withCredentials = true;

// Variable para almacenar el access token en memoria
let accessToken = null;

// Interceptor para agregar el header de autorización si el access token existe
axios.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para refrescar el access token usando la cookie del refresh token
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Evita intentar refrescar si la petición era al endpoint de refresh-token o a endpoints de autenticación como /login o /register
    if (
      originalRequest.url.includes('/refresh-token') ||
      originalRequest.url.includes('/login') ||
      originalRequest.url.includes('/register')
    ) {
      return Promise.reject(error);
    }
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(`${API_URL}/refresh-token`);
        accessToken = data.accessToken;
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Función de login: espera que el backend devuelva el access token en el body y envíe el refresh token en una cookie HttpOnly
export const login = async (email, password, remember) => {
  const response = await axios.post(`${API_URL}/login`, { email, password, remember });
  const { accessToken: at } = response.data;
  accessToken = at;
  return response.data;
};

export const register = async (formData) => {
  const response = await axios.post(`${API_URL}/register`, formData);
  return response.data;
};

export const logout = async () => {
  accessToken = null;
  const response = await axios.post(`${API_URL}/logout`);
  return response.data;
};

export const updateUserProfile = async (data) => {
  const response = await axios.put(`${API_URL}/${data.id}`, data);
  return response.data;
};

export const refreshToken = async () => {
  const response = await axios.post(`${API_URL}/refresh-token`);
  accessToken = response.data.accessToken;
  return response.data; // se espera { account, accessToken }
};

// Para manejar OAuth, redirige al backend
export const oauthLogin = () => {
  window.location.href = `${API_URL}/google`;
};

export const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async (email, otp, newPassword, otpToken) => {
  const response = await axios.post(`${API_URL}/reset-password`, { email, otp, newPassword, otpToken });
  return response.data;
};

export const authService = { login, register, logout, updateUserProfile, refreshToken, oauthLogin, forgotPassword, resetPassword };