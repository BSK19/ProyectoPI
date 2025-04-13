import axios from 'axios';

// URL base para tus endpoints de álbumes y artistas
const ALBUM_BASE_URL = "http://localhost:5000/api/albums";
const ARTIST_BASE_URL = "http://localhost:5000/api/artists";

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

// Función para obtener artistas (usando los endpoints de AlbumController)
export const fetchArtistsList = async () => {
  try {
    const response = await axios.get(`${ARTIST_BASE_URL}`, {
      withCredentials: true,
    });
    return response.data.results || response.data;
  } catch (error) {
    console.error('Error fetching Artist from AlbumController:', error);
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

// Función mejorada para descargar una pista
export const downloadTrack = async (trackId, albumId, format = 'mp3') => {
  try {
    
    // Antes de hacer la petición, obtener el título de la pista para usarlo como fallback
    let trackTitle = `track-${trackId}`;
    try {
      const album = await fetchAlbumById(albumId);
      const track = album.tracks.find(t => String(t.id) === String(trackId));
      if (track && track.title) {
        trackTitle = track.title.replace(/[\/\\:*?"<>|]/g, '_');
      }
    } catch (e) {
      console.warn('No se pudo obtener información de la pista, usando ID como nombre:', e);
    }
    
    // La URL incluye el formato solicitado como parámetro de consulta
    const response = await axios({
      url: `${ALBUM_BASE_URL}/${albumId}/download?trackId=${trackId}&format=${format}`,
      method: 'GET',
      responseType: 'blob',
      withCredentials: true,
      // Asegurar que los encabezados de respuesta estén disponibles
      headers: {
        'Accept': '*/*',
      }
    });
        
    // Extraer el nombre de archivo del encabezado con mejor soporte para diferentes formatos
    let filename = `${trackTitle}.${format}`;
    
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      
      // Probar diferentes patrones de extracción
      let filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
      if (!filenameMatch) {
        filenameMatch = contentDisposition.match(/filename=([^;]+)/);
      }
      
      if (filenameMatch && filenameMatch[1]) {
        // Eliminar posibles comillas extras y espacios
        filename = filenameMatch[1].trim().replace(/^["']|["']$/g, '');
      } else {
        console.warn('No se pudo extraer el nombre del encabezado, usando nombre predeterminado');
      }
    } else {
      console.warn('No se encontró el encabezado Content-Disposition, usando nombre predeterminado');
    }
    
    // Método alternativo usando createObjectURL y un elemento <a>
    try {
      const blob = new Blob([response.data], {
        type: format === 'mp3' ? 'audio/mpeg' : 
              format === 'wav' ? 'audio/wav' : 
              'audio/flac'
      });
            
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // Para Internet Explorer
        window.navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        // Para navegadores modernos
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename; // Usar el nombre obtenido
        
        // Estilos para hacer el enlace invisible
        link.style.display = 'none';
        document.body.appendChild(link);
        
        // Simular clic y luego limpiar
        link.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        }, 100);
      }
    } catch (downloadError) {
      console.error('Error en la descarga:', downloadError);
      throw downloadError;
    }
    
    return true;
  } catch (error) {
    console.error(`Error downloading track ${trackId}:`, error);
    throw error;
  }
};

// Función mejorada para descargar un álbum
export const downloadAlbum = async (albumId, format = 'mp3') => {
  try {
    // Antes de hacer la petición, obtener el título del álbum para usarlo como fallback
    let albumTitle = `album-${albumId}`;
    try {
      const album = await fetchAlbumById(albumId);
      if (album && album.title) {
        albumTitle = album.title.replace(/[\/\\:*?"<>|]/g, '_');
      }
    } catch (e) {
      console.warn('No se pudo obtener información del álbum, usando ID como nombre:', e);
    }
    
    const response = await axios({
      url: `${ALBUM_BASE_URL}/${albumId}/download-album?format=${format}`,
      method: 'GET',
      responseType: 'blob',
      withCredentials: true,
      headers: {
        'Accept': '*/*',
      }
    });
        
    // Determinar el nombre del archivo ZIP
    let filename = `${albumTitle}.zip`;
    
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      
      // Probar diferentes patrones de extracción
      let filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
      if (!filenameMatch) {
        filenameMatch = contentDisposition.match(/filename=([^;]+)/);
      }
      
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].trim().replace(/^["']|["']$/g, '');
      } else {
        console.warn('No se pudo extraer el nombre del ZIP, usando nombre predeterminado');
      }
    }
    
    // Método alternativo de descarga
    try {
      const blob = new Blob([response.data], { type: 'application/zip' });
      
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // Para Internet Explorer
        window.navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        // Para navegadores modernos
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        
        // Hacer el enlace invisible
        link.style.display = 'none';
        document.body.appendChild(link);
        
        // Simular clic y luego limpiar
        link.click();
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        }, 100);
      }
    } catch (downloadError) {
      console.error('Error en la descarga del ZIP:', downloadError);
      throw downloadError;
    }
    
    return true;
  } catch (error) {
    console.error(`Error downloading album ${albumId}:`, error);
    throw error;
  }
};

export const createAlbum = async (albumData) => {
  try {
    // Establecer un timeout más largo para permitir la subida de archivos grandes
    const response = await axios.post(
      `${ALBUM_BASE_URL}`,
      albumData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000 // 60 segundos
      }
    );
    
    return { success: true, ...response.data };
  } catch (error) {
    console.error('Error creating album:', error);
    if (error.response && error.response.data) {
      return { 
        success: false, 
        error: error.response.data.error || 'Error del servidor' 
      };
    }
    return { success: false, error: error.message || 'Error desconocido' };
  }
};