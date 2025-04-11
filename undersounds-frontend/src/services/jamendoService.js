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

// Función para descargar una pista en el formato seleccionado
// Actualizar la función downloadTrack para manejar mejor los IDs

// Función para descargar una pista en el formato seleccionado
export const downloadTrack = async (trackId, albumId, format = 'mp3') => {
  try {
    console.log(`Descargando track ${trackId} del álbum ${albumId} en formato ${format}`);
    
    // Asegurarse de que albumId esté definido
    if (!albumId) {
      throw new Error('ID del álbum es requerido para descargar una pista');
    }
    
    // Asegurar que los IDs sean siempre strings para consistencia
    const trackIdStr = String(trackId);
    const albumIdStr = String(albumId);
    
    console.log(`Realizando petición a: ${ALBUM_BASE_URL}/${albumIdStr}/download?trackId=${trackIdStr}&format=${format}`);
    
    // La URL incluye el formato solicitado como parámetro de consulta
    const response = await axios({
      url: `${ALBUM_BASE_URL}/${albumIdStr}/download?trackId=${trackIdStr}&format=${format}`,
      method: 'GET',
      responseType: 'blob', // Importante para recibir datos binarios
      withCredentials: true,
    });
    
    // Resto del código igual...
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const contentDisposition = response.headers['content-disposition'];
    let filename = `track-${trackIdStr}.${format}`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error(`Error downloading track ${trackId} in format ${format}:`, error);
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
    }
    throw error;
  }
};

// Función para descargar un álbum completo en el formato seleccionado
export const downloadAlbum = async (albumId, format = 'mp3') => {
  try {
    const response = await axios({
      url: `${ALBUM_BASE_URL}/${albumId}/download-album?format=${format}`,
      method: 'GET',
      responseType: 'blob',
      withCredentials: true,
    });
    
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const contentDisposition = response.headers['content-disposition'];
    let filename = `album-${albumId}.zip`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error(`Error downloading album ${albumId} in format ${format}:`, error);
    throw error;
  }
};