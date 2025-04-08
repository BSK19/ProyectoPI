const MerchDAO = require('../model/dao/MerchandisingDAO');
const MerchFactory = require('../model/factory/MerchandisingFactory');

const MerchandisingController = {
  // Obtener todos los productos
  async getAllMerch(req, res) {
    try {
      const merch = await MerchDAO.getAll();
      res.status(200).json(merch);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el merchandising', error });
    }
  },

  // Obtener por tipo
  async getByType(req, res) {
    try {
      const type = parseInt(req.params.type);
      const merch = await MerchDAO.getByType(type);
      res.status(200).json(merch);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener por tipo', error });
    }
  },

  // Obtener por artista
  async getByArtist(req, res) {
    try {
      const artistId = req.params.artistId;
      const merch = await MerchDAO.getByArtist(artistId);
      res.status(200).json(merch);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener por artista', error });
    }
  },

  // Crear nuevo (más adelante lo usaréis con admin)
  async createMerch(req, res) {
    try {
      const newMerch = MerchFactory.createMerch(req.body);
      const savedMerch = await MerchDAO.create(newMerch);
      res.status(201).json(savedMerch);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el merchandising', error });
    }
  }
};

module.exports = MerchandisingController;