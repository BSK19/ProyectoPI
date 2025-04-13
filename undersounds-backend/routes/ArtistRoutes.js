const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const ArtistController = require('../controller/ArtistController');

// Configuración de multer para manejar imágenes de perfil y banner
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Guarda ambas imágenes en la carpeta de assets/images del frontend
    if (file.fieldname === 'profileImage' || file.fieldname === 'banner') {
      cb(null, path.join(__dirname, '../../undersounds-frontend/src/assets/images'));
    } else {
      cb(null, path.join(__dirname, '../../undersounds-frontend/src/assets/images'));
    }
  },
  filename: function (req, file, cb) {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + cleanName);
  }
});

const upload = multer({ storage });

// Definir rutas con el middleware de multer en create y update
router.get('/', ArtistController.getArtists);
router.get('/:id', ArtistController.getArtistById);
router.post(
  '/',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]),
  ArtistController.createArtist
);
router.put(
  '/:id',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]),
  ArtistController.updateArtist
);
router.delete('/:id', ArtistController.deleteArtist);

module.exports = router;