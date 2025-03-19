import React, { useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../styles/album.css';
import { PlayerContext } from '../context/PlayerContext';
import AudioPlayer from '../components/Player/AudioPlayer';
import artists from '../mockData/artists';

const AlbumPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { playTrack } = useContext(PlayerContext);

  // Intentamos obtener el álbum enviado vía state desde ArtistProfile.jsx
  const albumFromState = location.state?.album;
  let album = albumFromState;

  // Si no viene en state, buscamos entre todos los álbumes de artists.js
  if (!album) {
    const allArtistAlbums = artists.flatMap(artist =>
      artist.albums.map(albumItem => ({
        ...albumItem,
        artist: artist.name  // Aseguramos que tengamos el nombre del artista
      }))
    );
    album = allArtistAlbums.find(a => a.id === parseInt(id));
  }

  if (!album) {
    return <div>Album not found</div>;
  }

  // Valores por defecto para evitar errores si no existen
  const tracks = album.tracks || [];
  const ratings = album.ratings || [];

  return (
    <div className="album-page">
      <h1>{album.title}</h1>
      <img
        src={album.coverImage || '/assets/images/default-cover.jpg'}
        alt={`${album.title} cover`}
      />
      <p>Artist: {album.artist}</p>
      <p>Release Year: {album.releaseYear}</p>
      <p>Genre: {album.genre}</p>
      <p>Price: ${album.price.toFixed(2)}</p>
      <h2>Track List:</h2>
      <ul>
        {tracks.map((track) => (
          <li key={track.id}>
            {track.title} - {track.duration}
            <button onClick={() => playTrack(track)}>Play</button>
          </li>
        ))}
      </ul>
      <h2>Ratings:</h2>
      <ul>
        {ratings.map((rating, index) => (
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