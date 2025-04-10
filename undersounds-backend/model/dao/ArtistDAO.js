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
      return await Artist.find(filter)
        .populate({
          path: 'albums',
          select: '_id id title coverImage releaseYear price genre tracks ratings'
        })
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error al obtener artistas: ${error.message}`);
    }
  }

  // Busca por el campo numérico "id" y realiza populate de "albums" incluyendo el campo genre
  async getArtistById(numericId) {
    try {
      return await Artist.findOne({ id: numericId })
        .populate({
          path: 'albums',
          select: '_id id title coverImage releaseYear price genre tracks ratings'
        });
    } catch (error) {
      throw new Error(`Error al obtener el artista con id ${numericId}: ${error.message}`);
    }
  }

  async updateArtist(numericId, updateData) {
    try {
      return await Artist.findOneAndUpdate({ id: numericId }, updateData, { new: true })
        .populate({
          path: 'albums',
          select: '_id id title coverImage releaseYear price genre tracks ratings'
        });
    } catch (error) {
      throw new Error(`Error al actualizar el artista con id ${numericId}: ${error.message}`);
    }
  }

  async deleteArtist(numericId) {
    try {
      return await Artist.findOneAndDelete({ id: numericId });
    } catch (error) {
      throw new Error(`Error al eliminar el artista con id ${numericId}: ${error.message}`);
    }
  }
}

module.exports = new ArtistDAO();