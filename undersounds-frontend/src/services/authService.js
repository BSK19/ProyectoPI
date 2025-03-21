// Nota: Cuando exista backend, descomenta las llamadas a la API.
import axios from 'axios';
import defaultAccounts from '../mockData/accounts.js';


const API_URL = 'http://localhost:5000/api/auth';

export const login = async (email, password) => {
  // Lee las cuentas almacenadas o usa las cuentas por defecto
  const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || defaultAccounts;
  
  // Busca una cuenta que tenga el email y password correctos
  const account = storedAccounts.find(
    (acc) => acc.email === email && acc.password === password
  );
  
  if (account) {
    // Opcional: puedes guardar la cuenta en localStorage para persistir la sesión
    localStorage.setItem('currentAccount', JSON.stringify(account));
    return account;
  } else {
    // Si no se encuentra la cuenta, lanza un error
    throw new Error('Su email o contraseña no es válido');
  }
};

export const logout = async () => {
    try {
        // Si tu backend requiere una petición para logout:
        // const response = await axios.post(`${API_URL}/logout`);
        // return response.data;

        // Simulando logout:
        localStorage.removeItem('currentAccount');
        return { success: true };
    } catch (error) {
        console.error('Error during logout:', error);
        throw error;
    }
};

export const register = async (formData) => {
  // Simula la lectura de cuentas existentes del localStorage.
  const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || defaultAccounts;
  
  // Asigna un nuevo ID (aumentando el último ID existente).
  const newId = storedAccounts.length ? storedAccounts[storedAccounts.length - 1].id + 1 : 1;
  
  // Determina el rol según los campos enviados:
  // Si se proporciona 'bandName', el rol es 'band'
  // Si se proporciona 'labelName', el rol es 'label'
  // En caso contrario, se asigna 'fan'
  const role = formData.bandName ? 'band' : formData.labelName ? 'label' : 'fan';
  
  // Construye el objeto account con todos los atributos necesarios
  const newAccount = {
    id: newId,
    username: formData.username,
    email: formData.email,
    password: formData.password,
    role: role,
    profileImage: formData.profileImage || '/assets/images/default-user.jpg',
    bio: formData.bio || '',
    socialLinks: formData.socialLinks || {
      facebook: '',
      instagram: '',
      twitter: ''
    },
    ...(role === 'band' && { bandName: formData.bandName, genre: formData.genre }),
    ...(role === 'label' && { labelName: formData.labelName, website: formData.website }),
    purchaseHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Actualiza el array con la nueva cuenta
  const updatedAccounts = [...storedAccounts, newAccount];

  // Guarda el array actualizado en localStorage
  localStorage.setItem('accounts', JSON.stringify(updatedAccounts));

  // Devuelve la nueva cuenta para efectos de confirmación
  return newAccount;
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