const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const MerchandisingController = require('../controller/MerchandisingController');

// Configuración de multer para el campo "image"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'image') {
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

// Rutas de merchandising
router.get('/', MerchandisingController.getAllMerch);
router.get('/type/:type', MerchandisingController.getByType);
router.get('/artist/:artistId', MerchandisingController.getByArtist);

// Para crear un nuevo producto se procesa el archivo "image"
router.post('/', upload.single('image'), MerchandisingController.createMerch);

router.get('/:id', MerchandisingController.getById);

module.exports = router;