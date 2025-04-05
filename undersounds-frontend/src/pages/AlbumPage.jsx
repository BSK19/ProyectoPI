import React, { useContext, useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { Box, Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import '../styles/album.css';
import { PlayerContext } from '../context/PlayerContext';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import defaultImage from '../assets/images/botonPlay.jpg';
import { fetchAlbums, fetchTracklist } from '../services/jamendoService';

const AlbumPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { playTrack, stopTrack } = useContext(PlayerContext);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [feedback, setFeedback] = useState(false);
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlbumAndTracks = async () => {
      try {
        setLoading(true);
        const albums = await fetchAlbums();
        const foundAlbum = albums.find(a => String(a.id) === String(id));
        
        if (foundAlbum) {
          const trackList = await fetchTracklist(foundAlbum.id);
          // Calculate price based on actual tracks fetched
          const basePrice = 9.99;
          const pricePerTrack = 0.99;
          const calculatedPrice = trackList.length > 0 ? 
            (basePrice + (trackList.length * pricePerTrack)).toFixed(2) : 
            basePrice.toFixed(2);

          setAlbum({
            ...foundAlbum,
            price: parseFloat(calculatedPrice)
          });
          setTracks(trackList);
        }
      } catch (error) {
        console.error('Error loading album:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAlbumAndTracks();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h5">Cargando...</Typography>
      </Box>
    );
  }

  if (!album) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h5">Álbum no encontrado</Typography>
      </Box>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: album.id,
      name: album.name,
      price: album.price,
      image: album.image || '/assets/images/default-cover.jpg',
      type: 'album',
    });
    setFeedback(true);
    setTimeout(() => setFeedback(false), 1000);
  };

  const handleTrackPlay = (track) => {
    if (!user) {
      alert("Debe iniciar sesión para reproducir la música");
      navigate("/login");
      return;
    }

    if (activeTrackId === track.id) {
      stopTrack();
      setActiveTrackId(null);
    } else {
      playTrack(track);
      setActiveTrackId(track.id);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      position: 'relative',
      p: 3,
    }}>
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${album.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(8px)',
        opacity: 0.3,
        zIndex: -1,
      }} />

      <Box className="album-page" sx={{ maxWidth: 800, width: '100%', p: 3 }}>
        <Card elevation={4} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            image={album.image}
            alt={album.name}
            sx={{ height: 300, objectFit: 'cover' }}
          />
          <CardContent sx={{ backgroundColor: '#f7f7f7' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              {album.name}
            </Typography>
            <Typography variant="subtitle1" color="text.primary">
              by{' '}
              <Link
                to={`/artistProfile/${album.artist_id}`}
                style={{ textDecoration: 'none', color: '#1DA0C3', fontWeight: 'bold' }}
              >
                {album.artist_name}
              </Link>
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Release date: {new Date(album.releasedate).getFullYear()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    Genre:
                  </Typography>
                  <Typography className="tag" variant="body2">
                    #{album.genre}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Price Display */}
            <Box sx={{ 
              mt: 3, 
              mb: 2, 
              display: 'flex', 
              justifyContent: 'flex-start', // Changed to align left
              alignItems: 'center',
              pl: 2 // Added left padding
            }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#1DA0C3',
                  display: 'flex',
                  alignItems: 'baseline'
                }}
              >
                <span style={{ fontSize: '24px', marginRight: '2px' }}>$</span>
                {album.price?.toFixed(2)}
              </Typography>
            </Box>

            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCart}
                sx={{ 
                  borderRadius: '20px',
                  backgroundColor: '#1DA0C3',
                  '&:hover': {
                    backgroundColor: '#1789A7'
                  },
                  width: 'auto', // Changed from 100% to auto
                  minWidth: '120px' // Added minimum width
                }}
              >
                Add to cart
              </Button>
              {feedback && (
                <Typography variant="body2" color="success.main" sx={{ ml: 2 }}>
                  Added to cart!
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: 'text.primary' }}>
            Tracks
          </Typography>
          
          {tracks.length > 0 ? (
            <Grid container spacing={2}>
              {tracks.map((track, index) => (
                <Grid item xs={12} key={track.id || index}>
                  <Box
                    className="track-item"
                    sx={{
                      p: 2,
                      borderRadius: '8px',
                      boxShadow: 1,
                      backgroundColor: '#fff',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        transition: 'background-color 0.2s'
                      }
                    }}
                  >
                    <Box className="track-container">
                      <Box className="track-number">
                        <Typography sx={{ 
                          color: 'text.secondary',
                          textAlign: 'right',
                          minWidth: '20px',
                          fontVariantNumeric: 'tabular-nums'
                        }}>
                          {index + 1}
                        </Typography>
                      </Box>
                      <Box sx={{
                        width: '30px',
                        height: '30px',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img
                          src={defaultImage}
                          alt="Play Button"
                          onClick={() => handleTrackPlay(track)}
                          style={{
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer',
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" noWrap>
                          {track.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {track.duration}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                        {track.n_reproducciones?.toLocaleString() || 0} plays
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
              No tracks available for this album
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AlbumPage;