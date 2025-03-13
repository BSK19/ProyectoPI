import React, { useEffect, useState } from 'react';
import { fetchAlbums, fetchArtists } from '../services/musicService';
import Album from '../components/Album/Album';
import ArtistProfile from '../components/Artist/ArtistProfile';
import SearchBar from '../components/Search/SearchBar';

const ExplorePage = () => {
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadData = async () => {
            const albumsData = await fetchAlbums();
            const artistsData = await fetchArtists();
            setAlbums(albumsData);
            setArtists(artistsData);
        };

        loadData();
    }, []);

    const filteredAlbums = albums.filter(album => 
        album.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredArtists = artists.filter(artist => 
        artist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="explore-page">
            <h1>Explore Music</h1>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <h2>Albums</h2>
            <div className="albums-list">
                {filteredAlbums.map(album => (
                    <Album key={album.id} album={album} />
                ))}
            </div>
            <h2>Artists</h2>
            <div className="artists-list">
                {filteredArtists.map(artist => (
                    <ArtistProfile key={artist.id} artist={artist} />
                ))}
            </div>
        </div>
    );
};

export default ExplorePage;