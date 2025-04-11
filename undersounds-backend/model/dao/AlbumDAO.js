const mongoose = require('mongoose');
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
      // Modificar el populate para incluir ambos IDs (numérico y ObjectId)
      return await Album.find(filter)
        .populate('artist', '_id id name bandName profileImage') // Incluye tanto _id como id numérico
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error al obtener álbumes: ${error.message}`);
    }
  }
  
  async getAlbumById(id) {
    try {
      // Si es un ObjectId válido, buscar directamente con populate
      if (mongoose.Types.ObjectId.isValid(id)) {
        return await Album.findById(id)
          .populate('artist', '_id id name bandName profileImage genre bio'); // Incluir tanto _id como id numérico
      }
      
      // Si no es un ObjectId válido (ejemplo: id numérico como string "2")
      // Intentar buscar por otros campos
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        // Buscar por campo id numérico si existe, también con populate
        const albumByNumericId = await Album.findOne({ id: numericId })
          .populate('artist', '_id id name bandName profileImage genre bio'); // Incluir tanto _id como id numérico
        if (albumByNumericId) return albumByNumericId;
      }
      
      // Si llegamos aquí, no se encontró el álbum
      return null;
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