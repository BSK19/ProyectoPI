import React from 'react';
import { useParams } from 'react-router-dom';
import  artists from '../../mockData/artists';
import  albums from '../../mockData/albums';

const ArtistProfile = () => {
    const { artistId } = useParams();
    const artist = artists.find(artist => artist.id === artistId);
    const artistAlbums = albums.filter(album => album.artistId === artistId);

    if (!artist) {
        return <div>Artist not found</div>;
    }

    return (
        <div className="artist-profile">
            <h1>{artist.name}</h1>
            <img src={artist.image} alt={artist.name} />
            <p>{artist.bio}</p>
            <h2>Albums</h2>
            <ul>
                {artistAlbums.map(album => (
                    <li key={album.id}>
                        <h3>{album.title}</h3>
                        <p>Price: ${album.price}</p>
                        <p>Release Date: {album.releaseDate}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ArtistProfile;