class AlbumDTO {
    constructor(album) {
        this.id = album._id;
        this.title = album.title;
        this.artist = album.artist;
        this.releaseDate = album.releaseDate;
        this.genre = album.genre;
        this.coverImage = album.coverImage;
        this.trackList = album.trackList; // Puedes mapear cada pista si deseas transformar su estructura.
        this.label = album.label;
        this.description = album.description;
        this.createdAt = album.createdAt;
        this.updatedAt = album.updatedAt;
    }
}

module.exports = AlbumDTO;