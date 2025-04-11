const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String, default: '' },
    fechaPublicacion: { type: Date, required: true },
    autor: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('noticiasMusica', NewsSchema,'noticiasMusica');