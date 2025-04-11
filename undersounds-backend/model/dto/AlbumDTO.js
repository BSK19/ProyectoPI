class AlbumDTO {
  constructor(album) {
      this.id = album._id || album.id;
      this.title = album.title;
      
      // Extraer tanto el nombre como el ID numérico del artista correctamente
      if (album.artist) {
        if (typeof album.artist === 'object') {
          // Si el objeto artist está poblado, extraer sus propiedades
          this.artist = album.artist.name || album.artist.bandName || 'Unknown Artist';
          
          // Asegurarse de usar el ID numérico explícitamente
          // El campo 'id' en el modelo de Artist se refiere al ID numérico, no al ObjectId
          this.artistId = album.artist.id; // Usar directamente el ID numérico
        } else {
          // Si artist es solo un string o ID
          this.artist = 'Unknown Artist';
          this.artistId = album.artist; // El ID en formato string
        }
      } else {
        this.artist = 'Unknown Artist';
        this.artistId = null;
      }
    // Resto de propiedades
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
    this.updatedAt = album.updatedAt;
  }
}

module.exports = AlbumDTO;