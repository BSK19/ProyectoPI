const { Artist } = require('../models/Artistas');
const ArtistDTO = require('../dto/ArtistDTO');

class ArtistaFactory {
    // Crea una instancia del modelo Artist desde datos crudos
    static createArtist(data) {
        return new Artist({
            name: data.name,
            profileImage: data.profileImage || '',
            genre: data.genre,
            bio: data.bio || '',
            banner: data.banner || '',
            seguidores: data.seguidores || Math.floor(Math.random() * (2000000 - 4000 + 1)) + 4000,
            ubicacion: data.ubicacion || '',
            idAlbum: data.idAlbum || [],
            ConcertColection: data.ConcertColection || [],
            createdAt: data.createdAt || new Date(),
            updatedAt: data.updatedAt || new Date()
        });

        
    }
        static create(artist) {
            return new ArtistDTO(artist);
        }
    
}

module.exports = ArtistaFactory;