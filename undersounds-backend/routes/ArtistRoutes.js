const express = require('express');
const router = express.Router();
const ArtistController = require('../controller/ArtistController');

router.get('/', ArtistController.getArtists);
router.get('/:id', ArtistController.getArtistById);
router.post('/', ArtistController.createArtist);
router.put('/:id', ArtistController.updateArtist);
router.delete('/:id', ArtistController.deleteArtist);

module.exports = router;