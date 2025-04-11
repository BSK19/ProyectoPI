const express = require('express');
const router = express.Router();
const AlbumController = require('../controller/AlbumController');

router.get('/', AlbumController.getAlbums);
router.get('/:id', AlbumController.getAlbumById);
router.post('/', AlbumController.createAlbum);
router.put('/:id', AlbumController.updateAlbum);
router.delete('/:id', AlbumController.deleteAlbum);
router.post('/:id/rate', AlbumController.addRating);
router.get('/:id/download', AlbumController.downloadTrack);
router.get('/:id/download-album', AlbumController.downloadAlbum);

module.exports = router;