// models/Merch.js
const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const MerchSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    type: { type: Number, required: true }, // 0 = vinilo, 1 = CD, 2 = Cassettes, 3 = tshirts, 4 = others, etc.
    artistId: { type: Number, ref: 'Artist', default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('tshirts', MerchSchema);