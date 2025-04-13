const mongoose = require('mongoose');

const ConcertSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true }
}, { _id: false });

const MerchandisingSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    merchImage: { type: String, default: '' },
    description: { type: String, default: '' }
}, { _id: false });

const SocialLinksSchema = new mongoose.Schema({
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' }
}, { _id: false });

const ArtistSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    id: { type: Number, required: true },
    name: { type: String, required: true },
    profileImage: { type: String, default: '' },
    genre: { type: String, required: true },
    bio: { type: String, default: '' },
    banner: { type: String, default: '' },
    seguidores: { type: String, default: '0' },
    ubicacion: { type: String, default: '' },
    albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
    concerts: { type: [ConcertSchema], default: [] },
    merchandising: { type: [MerchandisingSchema], default: [] },
    socialLinks: { type: SocialLinksSchema, default: {} }
}, {
    timestamps: true
});

module.exports = {
    Artist: mongoose.model('Artist', ArtistSchema)
};