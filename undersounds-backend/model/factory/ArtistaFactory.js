const { Artist } = require('../models/Artistas');

class ArtistaFactory {
    // Crea una instancia del modelo Artist desde datos crudos
    static createArtist(data) {
        return new Artist({
            name: data.name,
            profileImage: data.profileImage || '',
            genre: data.genre,
            bio: data.bio || '',
            banner: data.banner || '',
            seguidores: data.seguidores || 0,
            ubicacion: data.ubicacion || '',
            idAlbum: data.idAlbum || [],
            ConcertColection: data.ConcertColection || [],
            createdAt: data.createdAt || new Date(),
            updatedAt: data.updatedAt || new Date()
        });
    }
}

module.exports = ArtistaFactory;