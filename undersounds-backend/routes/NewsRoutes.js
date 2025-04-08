const express = require('express');
const router = express.Router();
const NewsController = require('../controller/NewsController');

// Crear una noticia
router.post('/', NewsController.createNews);

// Obtener todas las noticias
router.get('/', NewsController.getNews);

// Obtener una noticia por id
router.get('/:id', NewsController.getNewsById);

// Actualizar una noticia por id
router.put('/:id', NewsController.updateNews);

// Eliminar una noticia por id
router.delete('/:id', NewsController.deleteNews);

module.exports = router;