const Album = require('../models/Album');
const AlbumDTO = require('../dto/AlbumDTO');

class AlbumFactory {
  // Crea una instancia del modelo Album a partir de datos crudos
  static createAlbum(data) {
    return new Album({
      title: data.title,
      artist: data.artist,
      artistId: data.artistId,
      coverImage: data.coverImage || '',
      price: data.price,
      releaseYear: data.releaseYear,
      genre: data.genre,
      tracks: data.tracks || [],
      ratings: data.ratings || [],
      vinyl: data.vinyl || false,
      cd: data.cd || false,
      cassettes: data.cassettes || false,
      destacado: data.destacado || false,
      description: data.description || '',
      label: data.label || '',
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date()
    });
  }

  // Convierte un documento Album en un DTO
  static createAlbumDTO(album) {
    return new AlbumDTO(album);
  }
}

module.exports = AlbumFactory;