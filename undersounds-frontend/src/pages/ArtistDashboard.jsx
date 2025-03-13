import React, { useEffect, useState } from 'react';
import { getArtistProfile, getArtistAlbums } from '../services/musicService';
import ArtistProfile from '../components/Artist/ArtistProfile';
import Album from '../components/Album/Album';

const ArtistDashboard = () => {
    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);
    const artistId = '123'; // Replace with dynamic artist ID as needed

    useEffect(() => {
        const fetchArtistData = async () => {
            const artistData = await getArtistProfile(artistId);
            const artistAlbums = await getArtistAlbums(artistId);
            setArtist(artistData);
            setAlbums(artistAlbums);
        };

        fetchArtistData();
    }, [artistId]);

    if (!artist) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{artist.name}'s Dashboard</h1>
            <ArtistProfile artist={artist} />
            <h2>Albums</h2>
            <div>
                {albums.map(album => (
                    <Album key={album.id} album={album} />
                ))}
            </div>
        </div>
    );
};

export default ArtistDashboard;