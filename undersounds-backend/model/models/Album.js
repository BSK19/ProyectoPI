const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  profileImage: { type: String, default: '' }
}, { _id: false });

const AlbumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
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
  ratings: { type: [RatingSchema], default: [] },
  vinyl: { type: Boolean, default: false },
  cd: { type: Boolean, default: false },
  cassettes: { type: Boolean, default: false },
  destacado: { type: Boolean, default: false },
  description: { type: String, default: '' },
  label: { type: String, default: '' },
}, {
  timestamps: true
});

module.exports = mongoose.model('Album', AlbumSchema);