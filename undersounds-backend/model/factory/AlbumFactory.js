const Album = require('../models/Album');
const AlbumDTO = require('../dto/AlbumDTO');

class AlbumFactory {
    // Crea una instancia del modelo Album desde datos crudos
    static createAlbum(data) {
        return new Album({
            title: data.title,
            artist: data.artist,
            releaseDate: data.releaseDate,
            genre: data.genre,
            coverImage: data.coverImage || '',
            trackList: data.trackList || [],
            label: data.label || '',
            description: data.description || '',
            createdAt: data.createdAt || new Date(),
            updatedAt: data.updatedAt || new Date()
        });
    }

    // Convierte una instancia del modelo (o documento) Album a un DTO
    static createAlbumDTO(album) {
        return new AlbumDTO(album);
    }
}

module.exports = AlbumFactory;