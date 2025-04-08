const Album = require('../models/Album');

class AlbumDAO {
  async createAlbum(data) {
    try {
      const album = new Album(data);
      return await album.save();
    } catch (error) {
      throw new Error(`Error al crear el álbum: ${error.message}`);
    }
  }

  async getAlbums(filter = {}) {
    try {
      return await Album.find(filter).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error al obtener álbumes: ${error.message}`);
    }
  }

  async getAlbumById(id) {
    try {
      return await Album.findById(id);
    } catch (error) {
      throw new Error(`Error al obtener el álbum con id ${id}: ${error.message}`);
    }
  }

  async updateAlbum(id, data) {
    try {
      data.updatedAt = new Date();
      return await Album.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error(`Error al actualizar el álbum con id ${id}: ${error.message}`);
    }
  }

  async deleteAlbum(id) {
    try {
      return await Album.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar el álbum con id ${id}: ${error.message}`);
    }
  }
}

module.exports = new AlbumDAO();