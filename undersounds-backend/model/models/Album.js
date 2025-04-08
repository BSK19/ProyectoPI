const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    genre: { type: String, required: true },
    coverImage: { type: String, default: '' },
    trackList: [{ title: String, duration: String , url: String }],
    label: { type: String, default: '' },
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Album', AlbumSchema);