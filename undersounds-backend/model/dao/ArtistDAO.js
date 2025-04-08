const { Artist } = require('../models/Artistas');

class ArtistDAO {
  async createArtist(artistData) {
    try {
      const newArtist = new Artist(artistData);
      return await newArtist.save();
    } catch (error) {
      throw new Error(`Error al crear el artista: ${error.message}`);
    }
  }

  async getArtists(filter = {}) {
    try {
      return await Artist.find(filter).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error al obtener artistas: ${error.message}`);
    }
  }

  async getArtistById(id) {
    try {
      return await Artist.findById(id);
    } catch (error) {
      throw new Error(`Error al obtener el artista con id ${id}: ${error.message}`);
    }
  }

  async updateArtist(id, updateData) {
    try {
      updateData.updatedAt = Date.now();
      return await Artist.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw new Error(`Error al actualizar el artista con id ${id}: ${error.message}`);
    }
  }

  async deleteArtist(id) {
    try {
      return await Artist.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar el artista con id ${id}: ${error.message}`);
    }
  }
}

module.exports = new ArtistDAO();