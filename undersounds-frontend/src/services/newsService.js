import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const getNews = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/noticias`);
        return response.data;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
};

export const getNewsById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/api/noticias/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching news by id ${id}:`, error);
        throw error;
    }
};

export const createNews = async (newsData) => {
    try {
        const response = await axios.post(`${API_URL}/api/noticias`, newsData);
        return response.data;
    } catch (error) {
        console.error('Error creating news:', error);
        throw error;
    }
};

export const updateNews = async (id, newsData) => {
    try {
        const response = await axios.put(`${API_URL}/api/noticias/${id}`, newsData);
        return response.data;
    } catch (error) {
        console.error(`Error updating news with id ${id}:`, error);
        throw error;
    }
};

export const deleteNews = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/api/noticias/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting news with id ${id}:`, error);
        throw error;
    }
};