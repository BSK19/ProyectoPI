const Merch = require('../models/Merch');

const MerchDAO = {
    // Recuperar todo el merchandising asociado a un artista
    getByArtistId: async (artistId) => {
        return await Merch.find({ artistId }).populate('artistId');
    },

    // Recuperar merchandising básico (solo título, foto y precio)
    getBasicMerchByType: async (type) => {
        return await Merch.find({ type })
            .select('name image price') // Solo estos campos
            .exec();
    },

    // Recuperar merchandising básico de un artista, filtrado por tipo (camisetas, vinilos, etc.)
    getBasicMerchByArtistAndType: async (artistId, type) => {
        return await Merch.find({ artistId, type })
            .select('name image price') // Solo estos campos
            .exec();
    },

    // Recuperar todo el merchandising (sin filtros específicos)
    getAllMerch: async () => {
        return await Merch.find().exec();
    }
};

module.exports = MerchDAO;