const ArtistDAO = require('../model/dao/ArtistDAO');
const ArtistDTO = require('../model/dto/ArtistDTO');
const ArtistaFactory = require('../model/factory/ArtistaFactory');

class ArtistController {
  async getArtists(req, res) {
    try {
      const artists = await ArtistDAO.getArtists();
      const artistDTOs = artists.map(artist => new ArtistDTO(artist));
      res.json(artistDTOs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getArtistById(req, res) {
    try {
      const { id } = req.params;
      const artist = await ArtistDAO.getArtistById(id);
      if (!artist) {
        return res.status(404).json({ error: 'Artista no encontrado' });
      }
      res.json(new ArtistDTO(artist));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createArtist(req, res) {
    try {
      const artistData = req.body;
      const artistEntity = ArtistaFactory.createArtist(artistData);
      const newArtist = await ArtistDAO.createArtist(artistEntity);
      res.status(201).json(new ArtistDTO(newArtist));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateArtist(req, res) {
    try {
      const { id } = req.params;
      const artistData = req.body;
      const updatedArtist = await ArtistDAO.updateArtist(id, artistData);
      if (!updatedArtist) {
        return res.status(404).json({ error: 'Artista no encontrado' });
      }
      res.json(new ArtistDTO(updatedArtist));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteArtist(req, res) {
    try {
      const { id } = req.params;
      const deletedArtist = await ArtistDAO.deleteArtist(id);
      if (!deletedArtist) {
        return res.status(404).json({ error: 'Artista no encontrado' });
      }
      res.json({ message: 'Artista eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ArtistController();