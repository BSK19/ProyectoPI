const Album = require('../models/Album');

class AlbumDAO {
    async createAlbum(albumData) {
        try {
            const album = new Album(albumData);
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

    async updateAlbum(id, albumData) {
        try {
            albumData.updatedAt = Date.now();
            return await Album.findByIdAndUpdate(id, albumData, { new: true });
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