// Nota: Cuando tengas un backend, puedes volver a usar las peticiones axios descomentando las líneas correspondientes.
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/music';

export const fetchAlbums = async () => {
    try {
        // Cuando el backend esté disponible:
        // const response = await axios.get(`${API_URL}/albums`);
        // return response.data;

        // Datos simulados:
        return [
            { id: 1, title: 'Álbum de prueba 1', artist: 'Artista 1' },
            { id: 2, title: 'Álbum de prueba 2', artist: 'Artista 2' }
        ];
    } catch (error) {
        console.error('Error fetching albums:', error);
        throw error;
    }
};

export const fetchArtists = async () => {
    try {
        // const response = await axios.get(`${API_URL}/artists`);
        // return response.data;

        return [
            { id: 1, name: 'Artista 1' },
            { id: 2, name: 'Artista 2' }
        ];
    } catch (error) {
        console.error('Error fetching artists:', error);
        throw error;
    }
};

export const fetchTracks = async () => {
    try {
        // const response = await axios.get(`${API_URL}/tracks`);
        // return response.data;

        return [
            { id: 1, title: 'Tema 1', albumId: 1 },
            { id: 2, title: 'Tema 2', albumId: 2 }
        ];
    } catch (error) {
        console.error('Error fetching tracks:', error);
        throw error;
    }
};

export const fetchAlbumById = async (albumId) => {
    try {
        // const response = await axios.get(`${API_URL}/albums/${albumId}`);
        // return response.data;

        return { id: albumId, title: `Álbum de prueba ${albumId}`, artist: 'Artista de prueba' };
    } catch (error) {
        console.error(`Error fetching album with ID ${albumId}:`, error);
        throw error;
    }
};

export const fetchArtistById = async (artistId) => {
    try {
        // const response = await axios.get(`${API_URL}/artists/${artistId}`);
        // return response.data;

        return { id: artistId, name: `Artista de prueba ${artistId}` };
    } catch (error) {
        console.error(`Error fetching artist with ID ${artistId}:`, error);
        throw error;
    }
};

export const getArtistAlbums = async (artistId) => {
    try {
        const albumsData = await fetchAlbums();
        // Suponiendo que el campo 'artist' en cada álbum coincide con el artistId recibido;
        // ajusta la comparación según tu estructura de datos.
        return albumsData.filter(album => album.artist === artistId);
    } catch (error) {
        console.error('Error fetching artist albums:', error);
        throw error;
    }
};

export const getArtistProfile = async (artistId) => {
    try {
        // Cuando tengas backend, haz la llamada API correspondiente:
        // const response = await axios.get(`${API_URL}/artists/${artistId}`);
        // return response.data;

        // Versión simulada:
        return { 
            id: artistId, 
            name: `Artista de prueba ${artistId}`, 
            bio: 'Esta es la biografía de prueba.', 
            image: 'https://placehold.co/600x400/jpg' 
        };
    } catch (error) {
        console.error(`Error fetching profile for artist with ID ${artistId}:`, error);
        throw error;
    }
};