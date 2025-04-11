const express = require('express');
const router = express.Router();
const MerchandisingController = require('../controller/MerchandisingController');

// Obtener todos los productos de merchandising
router.get('/', MerchandisingController.getAllMerch);

// Obtener productos por tipo (camiseta, vinilo, etc.)
router.get('/type/:type', MerchandisingController.getByType);

// Obtener productos por artista
router.get('/artist/:artistId', MerchandisingController.getByArtist);

// Crear un nuevo producto (cuando haya panel admin)
router.post('/', MerchandisingController.createMerch);

// Obtener un producto de merchandising por ID
router.get('/:id', MerchandisingController.getById);


module.exports = router;