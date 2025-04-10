class AlbumDTO {
  constructor(album) {
    this.id = album._id;
    this.title = album.title;
    // Si el artista fue populated, se puede extraer más información
    if (album.artist && album.artist._id) {
      this.artist = album.artist.name;
      this.artistId = album.artist.id;
    } else {
      this.artist = album.artist;
      this.artistId = album.artistId;
    }
    this.coverImage = album.coverImage;
    this.price = album.price;
    this.releaseYear = album.releaseYear;
    this.genre = album.genre;
    this.tracks = album.tracks;
    this.ratings = album.ratings;
    this.vinyl = album.vinyl;
    this.cd = album.cd;
    this.cassettes = album.cassettes;
    this.destacado = album.destacado;
    this.description = album.description;
    this.label = album.label;
    this.createdAt = album.createdAt;
    this.updatedAt = album.updatedAt;
  }
}

module.exports = AlbumDTO;