import albumsData from '../mockData/albums';
import artistsData from '../mockData/artists';
import tracksData from '../mockData/tracks';

export const fetchAlbums = async () => {
    try {
        // Usar datos de mockData/albums.js
        return albumsData;
    } catch (error) {
        console.error('Error fetching albums:', error);
        throw error;
    }
};

export const fetchArtists = async () => {
    try {
        // Usar datos de mockData/artists.js
        return artistsData;
    } catch (error) {
        console.error('Error fetching artists:', error);
        throw error;
    }
};

export const fetchTracks = async () => {
    try {
        // Usar datos de mockData/tracks.js
        return tracksData;
    } catch (error) {
        console.error('Error fetching tracks:', error);
        throw error;
    }
};

export const fetchAlbumById = async (albumId) => {
    try {
        const albums = await fetchAlbums();
        return albums.find(album => album.id === albumId);
    } catch (error) {
        console.error(`Error fetching album with ID ${albumId}:`, error);
        throw error;
    }
};

export const fetchArtistById = async (artistId) => {
    try {
        const artists = await fetchArtists();
        return artists.find(artist => artist.id === artistId);
    } catch (error) {
        console.error(`Error fetching artist with ID ${artistId}:`, error);
        throw error;
    }
};

export const getArtistAlbums = async (artistId) => {
    try {
        const albums = await fetchAlbums();
        // Ajusta la comparación según la estructura de tus datos en mockData
        return albums.filter(album => album.artist === artistId);
    } catch (error) {
        console.error('Error fetching artist albums:', error);
        throw error;
    }
};

export const getArtistProfile = async (artistId) => {
    try {
        // Versión simulada usando datos de mockData/artists
        const artist = await fetchArtistById(artistId);
        // Complementar con más información simulada si es necesario
        return {
            ...artist,
            bio: 'Esta es la biografía de prueba.',
            image: 'https://placehold.co/600x400/jpg'
        };
    } catch (error) {
        console.error(`Error fetching profile for artist with ID ${artistId}:`, error);
        throw error;
    }
};