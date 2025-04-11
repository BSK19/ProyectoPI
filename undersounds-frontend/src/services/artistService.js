import axios from 'axios';

export const fetchArtists = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/artists');
        return response.data.results || response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchArtistById = async (id) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/artists/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};