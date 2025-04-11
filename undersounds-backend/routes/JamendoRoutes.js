const express = require('express');
const router = express.Router();
const JamendoController = require('../controller/JamendoController');

router.get('/albums', JamendoController.getAlbums);
router.get('/albums/musicinfo', JamendoController.getMusicInfo);
router.get('/albums/tracks', JamendoController.getAlbumTracks);
module.exports = router;