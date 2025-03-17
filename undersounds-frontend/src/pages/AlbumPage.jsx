import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import albums from '../mockData/albums';
import '../styles/album.css';
import { AlbumContext } from '../context/AlbumContext';
import { PlayerContext } from '../context/PlayerContext';
import AudioPlayer from '../components/Player/AudioPlayer';

const AlbumPage = () => {
    const { id } = useParams();
    const { selectedAlbumId } = useContext(AlbumContext);
    const { playTrack } = useContext(PlayerContext);
    const albumId = selectedAlbumId || parseInt(id);
    const album = albums.find((album) => album.id === albumId);

    if (!album) {
        return <div>Album not found</div>;
    }

    return (
        <div className="album-page">
            <h1>{album.title}</h1>
            <img src={album.coverImage || '/assets/images/default-cover.jpg'} alt={`${album.title} cover`} />
            <p>Artist: {album.artist}</p>
            <p>Release Year: {album.releaseYear}</p>
            <p>Genre: {album.genre}</p>
            <p>Price: ${album.price.toFixed(2)}</p>
            <h2>Track List:</h2>
            <ul>
                {album.tracks.map((track) => (
                    <li key={track.id}>
                        {track.title} - {track.duration}
                        <button onClick={() => playTrack(track)}>Play</button>
                    </li>
                ))}
            </ul>
            <h2>Ratings:</h2>
            <ul>
                {album.ratings.map((rating, index) => (
                    <li key={index}>
                        {rating.comment} - {rating.rating} stars
                    </li>
                ))}
            </ul>
            <AudioPlayer />
        </div>
    );
};

export default AlbumPage;