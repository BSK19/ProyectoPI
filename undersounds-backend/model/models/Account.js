const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // Permitir que la contraseña sea opcional para usuarios OAuth
  password: { type: String },
  role: { type: String, enum: ['fan', 'band', 'label'], default: 'fan' },
  profileImage: { type: String, default: '' },
  bannerImage: { type: String, default: 'http://localhost:5000/assets/images/default.jpg' },
  followers: { type: Number, default: 0 },
  bio: { type: String, default: '' },
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' }
  },
  // Campos específicos para ciertos roles
  bandName: { type: String },
  genre: { type: String },
  labelName: { type: String },
  website: { type: String },
  purchaseHistory: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
  // Campos para autenticación vía OAuth2.0
  provider: { type: String },       // Ejemplo: "google", "facebook"
  providerId: { type: String }        // ID único devuelto por el proveedor
});

module.exports = mongoose.model('Account', AccountSchema);