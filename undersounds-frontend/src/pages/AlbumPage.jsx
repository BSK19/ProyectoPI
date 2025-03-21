import React, { useContext, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../styles/album.css';
import { PlayerContext } from '../context/PlayerContext';
import AudioPlayer from '../components/Player/AudioPlayer';
import { CartContext } from '../context/CartContext';  // <-- Nuevo import
import artists from '../mockData/artists';
import tracksData from '../mockData/tracks';

const AlbumPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { playTrack } = useContext(PlayerContext);
  const { addToCart } = useContext(CartContext);  // <-- Nuevo hook
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [feedback, setFeedback] = useState(false); // Nuevo estado para feedback

  const albumFromState = location.state?.album;
  let album = albumFromState;

  if (!album) {
    const allArtistAlbums = artists.flatMap(artist =>
      artist.albums.map(albumItem => ({
        ...albumItem,
        artist: artist.name 
      }))
    );
    album = allArtistAlbums.find(a => a.id === parseInt(id));
  }

  if (!album) {
    return <div>Album not found</div>;
  }

  const tracks = album.tracks || [];
  const ratings = album.ratings || [];

  // Función para añadir el álbum al carrito
  const handleAddToCart = () => {
    addToCart({
      id: album.id,
      name: album.title,
      price: album.price,
      image: album.coverImage || '/assets/images/default-cover.jpg',
      type: 'album'
    });
    setFeedback(true);
    setTimeout(() => setFeedback(false), 1000);
  };

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

      <button 
      className="buy-button small" 
      onClick={handleAddToCart}
    >
      Añadir al carrito
      </button>
      {feedback && <p style={{ color: 'green', marginTop: '10px' }}>¡Añadido al carrito!</p>}

      <h2>Track List:</h2>
      <ul>
        {tracks.map((track) => (
          <li key={track.id} className="track-item">
            <div className="track-info">
              {track.title} - {track.duration}
              <button
                onClick={() => {
                  const trackDetail = tracksData.find(t => t.id === track.id);
                  if (trackDetail) {
                    playTrack(trackDetail);
                    setActiveTrackId(track.id);
                  } else {
                    console.error('Track not found in tracks.js');
                  }
                }}
              >
                Play
              </button>
            </div>
            {activeTrackId === track.id && (
              <AudioPlayer track={track} />
            )}
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
    </div>
  );
};

export default AlbumPage;