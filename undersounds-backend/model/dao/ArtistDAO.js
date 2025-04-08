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

  // Se usa el campo numérico "id" en lugar de _id
  async getArtistById(numericId) {
    try {
      return await Artist.findOne({ id: numericId });
    } catch (error) {
      throw new Error(`Error al obtener el artista con id ${numericId}: ${error.message}`);
    }
  }

  // Se actualiza buscando por el campo "id" numérico
  async updateArtist(numericId, updateData) {
    try {
      return await Artist.findOneAndUpdate({ id: numericId }, updateData, { new: true });
    } catch (error) {
      throw new Error(`Error al actualizar el artista con id ${numericId}: ${error.message}`);
    }
  }

  // Se elimina utilizando el campo "id" numérico
  async deleteArtist(numericId) {
    try {
      return await Artist.findOneAndDelete({ id: numericId });
    } catch (error) {
      throw new Error(`Error al eliminar el artista con id ${numericId}: ${error.message}`);
    }
  }
}

module.exports = new ArtistDAO();