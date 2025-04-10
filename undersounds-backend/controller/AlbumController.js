const AlbumDao = require('../model/dao/AlbumDao');
const AlbumDTO = require('../model/dto/AlbumDTO');
const AlbumFactory = require('../model/factory/AlbumFactory');
const { Artist } = require('../model/models/Artistas');

class AlbumController {
  async getAlbums(req, res) {
    try {
      const albums = await AlbumDao.getAlbums();
      const albumDTOs = albums.map(album => new AlbumDTO(album));
      res.json(albumDTOs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async getAlbumById(req, res) {
    try {
      const { id } = req.params;
      const album = await AlbumDao.getAlbumById(id);
      if (!album) {
        return res.status(404).json({ error: 'Album not found' });
      }
      res.json(new AlbumDTO(album));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async createAlbum(req, res) {
    try {
      const albumData = req.body;
      // Crear la entidad usando el factory; se espera que el body incluya "artistId" con el id numérico del artista
      const albumEntity = AlbumFactory.createAlbum(albumData);
      // Crear el álbum en la base de datos
      const newAlbum = await AlbumDao.createAlbum(albumEntity);
      // Buscar el artista por su id (según el campo "id" definido en el modelo Artist)  
      const artist = await Artist.findOne({ id: albumData.artistId });
      if (artist) {
        artist.albums.push(newAlbum._id);
        await artist.save();
      }
      res.status(201).json(new AlbumDTO(newAlbum));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async updateAlbum(req, res) {
    try {
      const { id } = req.params;
      const albumData = req.body;
      const updatedAlbum = await AlbumDao.updateAlbum(id, albumData);
      if (!updatedAlbum) {
        return res.status(404).json({ error: 'Album not found' });
      }
      res.json(new AlbumDTO(updatedAlbum));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async deleteAlbum(req, res) {
    try {
      const { id } = req.params;
      const deletedAlbum = await AlbumDao.deleteAlbum(id);
      if (!deletedAlbum) {
        return res.status(404).json({ error: 'Album not found' });
      }
      res.json({ message: 'Album deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async addRating(req, res) {
    try {
      const { id } = req.params;
      const { userId, rating, comment, profileImage } = req.body;
      const album = await AlbumDao.getAlbumById(id);
      if (!album) {
        return res.status(404).json({ success: false, error: 'Album not found' });
      }
      album.ratings.push({ userId, rating, comment, profileImage });
      await album.save();
      res.json({ success: true, album });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new AlbumController();