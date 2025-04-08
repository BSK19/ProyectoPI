import axios from 'axios';

// URL base para tus endpoints de álbumes y artistas
const ALBUM_BASE_URL = "http://localhost:5000/api/albums";

// Función para obtener álbumes (usando los endpoints de AlbumController)
export const fetchAlbums = async () => {
  try {
    const response = await axios.get(`${ALBUM_BASE_URL}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching albums from AlbumController:', error);
    throw error;
  }
};

// Función para obtener la información de un álbum por ID
export const fetchAlbumById = async (albumId) => {
  try {
    const response = await axios.get(`${ALBUM_BASE_URL}/${albumId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching album with id ${albumId} from AlbumController:`, error);
    throw error;
  }
};

// Función para obtener las pistas de un álbum (se extrae del objeto álbum)
export const fetchTracklist = async (albumId) => {
  try {
    const album = await fetchAlbumById(albumId);
    return album.tracks || [];
  } catch (error) {
    console.error(`Error fetching tracklist for album ${albumId}:`, error);
    throw error;
  }
};

// Función para obtener artistas (agrega el endpoint correspondiente en tu backend)
export const fetchArtists = async () => {
  try {
    const response = await axios.get(`${ALBUM_BASE_URL}/artists`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching artists from AlbumController:', error);
    throw error;
  }
};