import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

// Habilitar el envío de cookies en cada petición
axios.defaults.withCredentials = true;

// Variable para almacenar el access token en memoria
let accessToken = null;

// Interceptor para agregar el header de autorización si el access token existe
axios.interceptors.request.use(
  config => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor para refrescar el access token usando la cookie del refresh token
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      originalRequest.url.includes('/api/auth/refresh-token') ||
      originalRequest.url.includes('/api/auth/login') ||
      originalRequest.url.includes('/api/auth/register')
    ) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(`${API_URL}/api/auth/refresh-token`);
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

// Funciones de autenticación
export const login = async (email, password, remember) => {
  const { data } = await axios.post(
    `${API_URL}/api/auth/login`,
    { email, password, remember }
  );
  accessToken = data.accessToken;
  return data;
};

export const register = async formData => {
  const { data } = await axios.post(
    `${API_URL}/api/auth/register`,
    formData
  );
  return data;
};

export const logout = async () => {
  accessToken = null;
  const { data } = await axios.post(`${API_URL}/api/auth/logout`);
  return data;
};

export const updateUserProfile = async updatedUser => {
  try {
    const { data } = await axios.put(
      `${API_URL}/api/auth/${updatedUser.id}`,
      updatedUser
    );
    return data;
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error);
    throw error;
  }
};

export const refreshToken = async () => {
  const { data } = await axios.post(`${API_URL}/api/auth/refresh-token`);
  accessToken = data.accessToken;
  return data;
};

export const oauthLogin = () => {
  window.location.href = `${API_URL}/api/auth/google`;
};

export const forgotPassword = async email => {
  const { data } = await axios.post(
    `${API_URL}/api/auth/forgot-password`,
    { email }
  );
  return data;
};

export const resetPassword = async (email, otp, newPassword, otpToken) => {
  const { data } = await axios.post(
    `${API_URL}/api/auth/reset-password`,
    { email, otp, newPassword, otpToken }
  );
  return data;
};

export const authService = {login,register,logout,updateUserProfile,refreshToken,oauthLogin,forgotPassword,resetPassword};