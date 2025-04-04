import axios from 'axios';

const JAMENDO_API_URL = 'https://api.jamendo.com/v3.0';
const API_KEY = "37a3b74b";

export const fetchTracks = async () => {
    try {
        const response = await axios.get(`${JAMENDO_API_URL}/tracks`, {
            params: {
                client_id: API_KEY,
                format: 'json',
                limit: 20,
            },
            withCredentials: false,
        });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching tracks from Jamendo:', error);
        throw error;
    }
};

export const fetchAlbums = async () => {
    try {
        // Primero obtenemos la lista básica de álbumes
        const albumsResponse = await axios.get(`${JAMENDO_API_URL}/albums`, {
            params: {
                client_id: API_KEY,
                format: 'json',
                limit: 20,
            },
            withCredentials: false,
        });
        
        const basicAlbums = albumsResponse.data.results;
        
        // Por cada álbum, se solicita su información extendida
        const albumsWithInfoPromises = basicAlbums.map(async (album) => {
            try {
                const musicInfoResponse = await axios.get(`${JAMENDO_API_URL}/albums/musicinfo`, {
                    params: {
                        client_id: API_KEY,
                        format: 'json',
                        id: album.id,
                    },
                    withCredentials: false,
                });
                
                // Se asume que la respuesta devuelve un único objeto de información para el álbum
                const musicInfo = musicInfoResponse.data.results[0] || null;
                
                // Extraer los tags desde musicInfo.musicinfo, ya que allí se encuentran los tags reales
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
                console.error(`Error fetching musicinfo for album ${album.id}:`, error);
                // Si falla, devolvemos el álbum sin información extendida
                return { ...album, genre: 'Unknown', musicinfo: null };
            }
        });
        
        const albumsWithInfo = await Promise.all(albumsWithInfoPromises);
        return albumsWithInfo;
    } catch (error) {
        console.error('Error fetching albums from Jamendo:', error);
        throw error;
    }
};