const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    profileImage: { type: String, default: '' },
    genre: { type: String, required: true },
    bio: { type: String, default: '' },
    banner: { type: String, default: '' },
    seguidores: { type: Number, default: 0 },
    ubicacion: { type: String, default: '' },
    idAlbum: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
    ConcertColection: [{ location: String, date: Date , time: String , venue: String , concertImage: String, description:String }]
}, {
    timestamps: true
});

/*
const ConcertSchema = new mongoose.Schema({
    location: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    concertImage: { type: String, default: '' },
    description: { type: String, default: '' }
}, {
    timestamps: true
});
*/

module.exports = {
    Artist: mongoose.model('Artist', ArtistSchema)
};