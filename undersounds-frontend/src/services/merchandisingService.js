import axios from 'axios';

// URL base del backend para merchandising
const API_URL = 'http://localhost:5000/api/merchandising';

// Obtener todo el merchandising
export const getAllMerch = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

// Obtener merchandising por tipo (ej: camisetas = 1, vinilos = 2, etc.)
export const getMerchByType = async (type) => {
  const response = await axios.get(`${API_URL}/type/${type}`);
  return response.data;
};


// Obtener merchandising por ID de artista
export const getMerchByArtist = async (artistId) => {
  const response = await axios.get(`${API_URL}/artist/${artistId}`);
  return response.data;
};

// Crear un nuevo producto de merchandising (cuando haya panel admin)
export const createMerch = async (merchData) => {
  const response = await axios.post(`${API_URL}`, merchData);
  return response.data;
};

export const getMerchById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const merchService = {
  getAllMerch,
  getMerchByType,
  getMerchByArtist,
  createMerch,
  getMerchById
};
