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
      const numericId = Number(req.params.id);
      const artist = await ArtistDAO.getArtistById(numericId);
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
      if(req.files) {
        if (req.files.profileImage) {
          artistData.profileImage = "http://localhost:5000/assets/images/" + req.files.profileImage[0].filename;
        }
        if (req.files.banner) {
          artistData.banner = "http://localhost:5000/assets/images/" + req.files.banner[0].filename;
        }
      }
      const artistEntity = ArtistaFactory.createArtist(artistData);
      
      const newArtist = await ArtistDAO.createArtist(artistEntity);

      res.status(201).json({
        success : true,
        artista: new ArtistDTO(newArtist)
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateArtist(req, res) {
    try {
      const numericId = Number(req.params.id);
      const artistData = req.body;
      const updatedArtist = await ArtistDAO.updateArtist(numericId, artistData);
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
      const numericId = Number(req.params.id);
      const deletedArtist = await ArtistDAO.deleteArtist(numericId);
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