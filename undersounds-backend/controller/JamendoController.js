const axios = require('axios');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // Almacena durante 1 hora
const JAMENDO_API_URL = 'https://api.jamendo.com/v3.0';
const API_KEY = process.env.JAMENDO_API_KEY || '37a3b74b';

class JamendoController {
  async getAlbums(req, res) {
    const cacheKey = 'albums';
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
    try {
      const response = await axios.get(`${JAMENDO_API_URL}/albums`, {
        params: {
          client_id: API_KEY,
          format: 'json',
          limit: 20
        }
      });
      // Guarda en cache la respuesta
      cache.set(cacheKey, response.data);
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching albums from Jamendo:', error.message);
      res.status(500).json({ error: 'Error fetching albums from Jamendo' });
    }
  }

  async getMusicInfo(req, res) {
    const albumId = req.query.id;
    const cacheKey = `musicinfo_${albumId}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
    try {
      const response = await axios.get(`${JAMENDO_API_URL}/albums/musicinfo`, {
        params: {
          client_id: API_KEY,
          format: 'json',
          id: albumId
        }
      });
      cache.set(cacheKey, response.data);
      res.json(response.data);
    } catch (error) {
      console.error(`Error fetching musicinfo for album ${albumId}:`, error.message);
      res.status(500).json({ error: 'Error fetching musicinfo' });
    }
  }

  async getAlbumTracks(req, res) {
    const albumId = req.query.album_id;
    const cacheKey = `album_tracks_${albumId}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
    try {
      const response = await axios.get(`${JAMENDO_API_URL}/albums/tracks`, {
        params: {
          client_id: API_KEY,
          format: 'json',
          id: albumId,
          limit: 20,
        },
      });
      cache.set(cacheKey, response.data);
      res.json(response.data);
    } catch (error) {
      console.error(
        `Error fetching album tracks for album ${albumId}:`,
        error.response ? error.response.data : error.message
      );
      res.status(500).json({
        error: 'Error fetching album tracks',
        details: error.response ? error.response.data : error.message
      });
    }
  }
}

module.exports = new JamendoController();