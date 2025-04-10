class AlbumFactory {
  createAlbum(data) {
    return {
      title: data.title,
      // Guardamos la referencia al artista usando el id recibido (más adelante se actualizará en el Artist)
      artist: data.artistId,
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
      label: data.label || ''
    };
  }
}

module.exports = new AlbumFactory();