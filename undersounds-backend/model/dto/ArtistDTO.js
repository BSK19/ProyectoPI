class ArtistDTO {
    constructor(artist) {
        this.id = artist._id;
        this.name = artist.name;
        this.profileImage = artist.profileImage;
        this.genre = artist.genre;
        this.bio = artist.bio;
        this.banner = artist.banner;
        this.seguidores = artist.seguidores;
        this.ubicacion = artist.ubicacion;
        this.idAlbum = artist.idAlbum;
        this.ConcertColection = artist.ConcertColection;
        this.createdAt = artist.createdAt;
        this.updatedAt = artist.updatedAt;
    }
}

module.exports = ArtistDTO;