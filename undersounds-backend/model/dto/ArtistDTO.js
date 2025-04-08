class ArtistDTO {
    constructor(artist) {
        this.id = artist.id;
        this.name = artist.name;
        this.profileImage = artist.profileImage;
        this.genre = artist.genre;
        this.bio = artist.bio;
        this.banner = artist.banner;
        this.seguidores = artist.seguidores;
        this.ubicacion = artist.ubicacion;
        this.albums = artist.albums;
        this.concerts = artist.concerts;
        this.merchandising = artist.merchandising;
        this.socialLinks = artist.socialLinks;
        this.createdAt = artist.createdAt;
        this.updatedAt = artist.updatedAt;
    }
}

module.exports = ArtistDTO;