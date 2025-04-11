const express = require('express');
const router = express.Router();
const AlbumController = require('../controller/AlbumController');
const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === 'coverImage') {
        cb(null, path.join(__dirname, '../../undersounds-frontend/src/assets/images'));
      } else if (file.fieldname === 'tracks') {
        cb(null, path.join(__dirname, '../../undersounds-frontend/src/assets/music'));
      }
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

router.post(
  '/',
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'tracks', maxCount: 10 },
  ]),
  AlbumController.createAlbum
);
router.get('/', AlbumController.getAlbums);
router.get('/:id', AlbumController.getAlbumById);
router.put('/:id', AlbumController.updateAlbum);
router.delete('/:id', AlbumController.deleteAlbum);
router.post('/:id/rate', AlbumController.addRating);
router.get('/:id/download', AlbumController.downloadTrack);
router.get('/:id/download-album', AlbumController.downloadAlbum);

module.exports = router;