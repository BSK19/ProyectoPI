const AlbumDao = require('../model/dao/AlbumDao');
const AlbumDTO = require('../model/dto/AlbumDTO');
const AlbumFactory = require('../model/factory/AlbumFactory');

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
      const album = await AlbumDao.findById(id);
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
      const albumEntity = AlbumFactory.createAlbum(albumData);
      const newAlbum = await AlbumDao.create(albumEntity);
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
}

module.exports = new AlbumController();