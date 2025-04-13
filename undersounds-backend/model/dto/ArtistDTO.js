class ArtistDTO {
    constructor(artist) {
        this._id = artist._id; // ID de MongoDB
        this.id = artist.id;
        this.name = artist.name;
        this.profileImage = artist.profileImage;
        this.genre = artist.genre;
        this.bio = artist.bio;
        this.banner = artist.banner;
        this.seguidores = artist.seguidores;
        this.ubicacion = artist.ubicacion;
        // Si albums viene populated, devolver información resumida; de lo contrario, solo la referencia (ObjectId)
        this.albums = Array.isArray(artist.albums)
            ? artist.albums.map(alb => (alb && alb._id ? {
                    id: alb._id,
                    title: alb.title,
                    artist: alb.artist,
                    genre: alb.genre,
                    tracks: alb.tracks,
                    ratings: alb.ratings,
                    vinyl: alb.vinyl,
                    cd: alb.cd,
                    cassettes: alb.cassettes,
                    destacado: alb.destacado,
                    description: alb.description,
                    label: alb.label,
                    coverImage: alb.coverImage,
                    releaseYear: alb.releaseYear,
                    price: alb.price,
                  } : alb))
            : [];
        this.concerts = artist.concerts;
        this.merchandising = artist.merchandising;
        this.socialLinks = artist.socialLinks;
        this.createdAt = artist.createdAt;
        this.updatedAt = artist.updatedAt;
    }
}

module.exports = ArtistDTO;