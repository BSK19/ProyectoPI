const { Artist } = require('../models/Artistas');
const mongoose = require('mongoose');

class ArtistDAO {
  // Método para obtener el último artista creado (ordenado por ID numérico)
  async getLastArtist() {
    try {
      return await Artist.findOne().sort({ id: -1 });
    } catch (error) {
      console.error("Error al obtener último artista:", error);
      return null;
    }
  }

  // Método específico para obtener el ID numérico más alto
  async getMaxNumericId() {
    try {
      const artist = await Artist.findOne().sort({ id: -1 }).select('id');
      return artist ? artist.id : 0;
    } catch (error) {
      console.error("Error al obtener último ID numérico:", error);
      return 0;
    }
  }

  // En el método createArtist de ArtistDAO
  async createArtist(artistData) {
    try {
      // Verificar que el ID no esté en uso
      if (artistData.id) {
        const existing = await Artist.findOne({ id: artistData.id });
        if (existing) {
          console.warn(`El ID ${artistData.id} ya está en uso, generando uno nuevo`);
          const maxId = await this.getMaxNumericId();
          artistData.id = maxId + 1;
        }
      } else {
        // Si no hay ID, generar uno nuevo
        const maxId = await this.getMaxNumericId();
        artistData.id = maxId + 1;
      }
      
      console.log(`Guardando artista con ID numérico: ${artistData.id}`);
      const newArtist = new Artist(artistData);
      return await newArtist.save();
    } catch (error) {
      throw new Error(`Error al crear el artista: ${error.message}`);
    }
  }

  // Buscar artista por su ID de MongoDB
  async getArtistByMongoId(mongoId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(mongoId)) {
        throw new Error('ID de MongoDB inválido');
      }
      
      return await Artist.findById(mongoId)
        .populate({
          path: 'albums',
          select: '_id id title coverImage releaseYear price genre tracks ratings'
        });
    } catch (error) {
      throw new Error(`Error al obtener el artista con MongoDB ID ${mongoId}: ${error.message}`);
    }
  }

  async getArtists(filter = {}) {
    try {
      return await Artist.find(filter)
        .select('_id id name profileImage genre bio banner seguidores ubicacion albums concerts merchandising socialLinks createdAt updatedAt')
        .populate({
          path: 'albums',
          select: '_id id title coverImage releaseYear price genre tracks ratings'
        })
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error al obtener artistas: ${error.message}`);
    }
  }

  // El resto de los métodos se mantienen igual
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

  // Actualizar por ID de MongoDB
  async updateArtistByMongoId(mongoId, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(mongoId)) {
        throw new Error('ID de MongoDB inválido');
      }
      
      return await Artist.findByIdAndUpdate(mongoId, updateData, { new: true })
        .populate({
          path: 'albums',
          select: '_id id title coverImage releaseYear price genre tracks ratings'
        });
    } catch (error) {
      throw new Error(`Error al actualizar el artista con MongoDB ID ${mongoId}: ${error.message}`);
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