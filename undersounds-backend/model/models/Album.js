const mongoose = require('mongoose');

const AlbumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  artistId: { type: Number, required: true },
  coverImage: { type: String, default: '' },
  price: { type: Number, required: true },
  releaseYear: { type: Number, required: true },
  genre: { type: String, required: true },
  tracks: [{
    id: Number,
    title: { type: String, required: true },
    duration: { type: String, required: true },
    url: { type: String, required: true },
    autor: { type: String },
    n_reproducciones: { type: Number }
  }],
  ratings: [{
    userId: { type: Number, required: true },
    rating: { type: Number, required: true },
    comment: { type: String }
  }],
  vinyl: { type: Boolean, default: false },
  cd: { type: Boolean, default: false },
  cassettes: { type: Boolean, default: false },
  destacado: { type: Boolean, default: false },
  description: { type: String, default: '' },
  label: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Album', AlbumSchema);