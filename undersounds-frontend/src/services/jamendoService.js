import axios from 'axios';

const PROXY_BASE_URL = "http://localhost:5000/api/jamendo";

// Ejemplo para obtener pistas
export const fetchTracks = async () => {
    try {
        const response = await axios.get(`${PROXY_BASE_URL}/tracks`, {
            params: {
                client_id: "37a3b74b", // Puedes mantenerla o quitarla si el backend ya la incluye
                format: 'json',
                limit: 20,
            },
            withCredentials: false,
        });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching tracks from Jamendo (proxy):', error);
        throw error;
    }
};

// Ejemplo para obtener álbumes con información extendida
export const fetchAlbums = async () => {
    try {
        // Cambiamos la llamada para que apunte al proxy
        const albumsResponse = await axios.get(`${PROXY_BASE_URL}/albums`, {
            params: {
                client_id: "37a3b74b",
                format: 'json',
                limit: 20,
            },
            withCredentials: false,
        });
        
        const basicAlbums = albumsResponse.data.results;
        
        // Se mantiene el mapeo para obtener información extendida, ya que la ruta para musicinfo se define en el proxy
        const albumsWithInfoPromises = basicAlbums.map(async (album) => {
            try {
                const musicInfoResponse = await axios.get(`${PROXY_BASE_URL}/albums/musicinfo`, {
                    params: {
                        client_id: "37a3b74b",
                        format: 'json',
                        id: album.id,
                    },
                    withCredentials: false,
                });
                
                const musicInfo = musicInfoResponse.data.results[0] || null;
                let tagsArray = [];
                if (musicInfo && musicInfo.musicinfo && musicInfo.musicinfo.tags) {
                    if (typeof musicInfo.musicinfo.tags === 'string') {
                        tagsArray = musicInfo.musicinfo.tags.split(',').map(tag => tag.trim());
                    } else if (Array.isArray(musicInfo.musicinfo.tags)) {
                        tagsArray = musicInfo.musicinfo.tags;
                    }
                }
                const genre = tagsArray.length > 0 ? tagsArray[0] : 'Unknown';
                return { ...album, genre, musicinfo: musicInfo };
            } catch (error) {
                console.error(`Error fetching musicinfo for album ${album.id} (proxy):`, error);
                return { ...album, genre: 'Unknown', musicinfo: null };
            }
        });
        
        const albumsWithInfo = await Promise.all(albumsWithInfoPromises);
        return albumsWithInfo;
    } catch (error) {
        console.error('Error fetching albums from Jamendo (proxy):', error);
        throw error;
    }
};

export const fetchTracklist = async (albumId) => {
    try {
        const response = await axios.get(`${PROXY_BASE_URL}/albums/tracks`, {
            params: {
                client_id: "37a3b74b",
                format: 'json',
                album_id: albumId,
                limit: 20,
            },
            withCredentials: false,
        });
        if (response.data.results && response.data.results.length > 0) {
            const albumData = response.data.results[0];
            // Mapear las pistas agregando el artista obtenido del álbum e incluyendo la URL correcta
            return albumData.tracks.map(track => ({
                ...track,
                url: track.audio,
                artist: albumData.artist_name, // Se extrae el nombre del artista del nivel álbum
                // Si no quieres mostrar la posición, puedes omitirla o reemplazarla por otra cosa
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching tracklist from Jamendo (proxy):', error);
        throw error;
    }
};

export const fetchAlbumById = async (albumId) => {
  try {
    const response = await axios.get(`${PROXY_BASE_URL}/albums/musicinfo`, {
      params: {
        client_id: "37a3b74b",
        format: 'json',
        id: albumId,
      },
      withCredentials: false,
    });
    // Se asume que la respuesta viene en results[0]
    return response.data.results[0] || null;
  } catch (error) {
    console.error(`Error fetching album with id ${albumId}:`, error);
    throw error;
  }
};