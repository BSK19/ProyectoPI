const MerchDAO = require('../model/dao/MerchandisingDAO');
const MerchFactory = require('../model/factory/MerchandisingFactory');
const MerchDTO = require('../model/dto/MerchandisingDTO');

const MerchandisingController = {
  // Obtener todos los productos
  async getAllMerch(req, res) {
    try {
      const merch = await MerchDAO.getAllMerch();
      res.status(200).json(merch);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el merchandising', error });
    }
  },

  // Obtener por tipo
  async getByType(req, res) {
    try {
      const type = parseInt(req.params.type);
      const merch = await MerchDAO.getBasicMerchByType(type);
      res.status(200).json(merch);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener por tipo', error });
    }
  },

  // Obtener por artista
  async getByArtist(req, res) {
    try {
      const artistId = req.params.artistId;
      const merch = await MerchDAO.getByArtistId(artistId);
      res.status(200).json(merch);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener por artista', error });
    }
  },

  // Crear nuevo (más adelante lo usaréis con admin)
  async createMerch(req, res) {
    try {
      const merchData = { ...req.body };
      merchData.price = parseFloat(merchData.price); // Convertir precio a número
      merchData.type = parseInt(merchData.type); // Convertir tipo a número
      merchData.artistId = parseInt(merchData.artistId); // Convertir artistId a número
      if (req.file) {
        merchData.image = "http://localhost:5000/assets/images/" + req.file.filename;
      }
      const savedMerch = await MerchFactory.createMerch(merchData);
      res.status(201).json({ 
        success: true,
        merchandising: new MerchDTO(savedMerch)
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el merchandising', error });
    }
  },


  // Obtener un producto por ID
  async getById(req, res) {
    try {
      const id = req.params.id;
      const merch = await MerchDAO.getById(id);
      if (!merch) {
        return res.status(404).json({ message: 'Producto no encontrado XD' });
      }
      res.status(200).json(merch);
    } catch (error) {
      res.status(500).json({
        message: `Error al obtener el producto por ID (${req.params.id})`,
        error: error.message
      });
    }
  }
  };

module.exports = MerchandisingController;