import React, { useContext, useState} from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import '../styles/album.css';
import { PlayerContext } from '../context/PlayerContext';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import albumsData from '../mockData/albums';
import tracksData from '../mockData/tracks';

const AlbumPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Se extrae playTrack y stopTrack desde PlayerContext
  const { playTrack, stopTrack } = useContext(PlayerContext);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [feedback, setFeedback] = useState(false);

  // Obtiene el album del state o lo busca en la lista completa
  const albumFromState = location.state?.album;
  let album = albumFromState;
  if (!album) {
    album = albumsData.find(a => a.id === parseInt(id, 10));
  }
  if (!album) {
    return <Typography variant="h5">Album not found</Typography>;
  }

  const tracks = album.tracks || [];
  const ratings = album.ratings || [];

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
    <Box className="album-page" sx={{ p: 3 }}>
      <Card elevation={4} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={album.coverImage || '/assets/images/default-cover.jpg'}
          alt={`${album.title} cover`}
          sx={{ maxHeight: 450, objectFit: 'cover' }}
        />
        <CardContent sx={{ backgroundColor: '#f7f7f7' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            {album.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            by {album.artist}
          </Typography>
          <Grid container spacing={1} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <Typography variant="body1">Released: {album.releaseYear}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">Genre: {album.genre}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Price: ${album.price.toFixed(2)}</Typography>
            </Grid>
          </Grid>
          <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" color="primary" onClick={handleAddToCart}>
              Añadir al carrito
            </Button>
            {feedback && (
              <Typography variant="body2" color="success.main">
                ¡Añadido al carrito!
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Track List:
        </Typography>
        <Grid container spacing={2}>
          {tracks.map(track => (
            <Grid item xs={12} key={track.id}>
              <Box className="track-item" sx={{ p: 2, borderRadius: '8px', boxShadow: 1, backgroundColor: '#fff' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                  {track.title} - {track.duration}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    mt: 1,
                    backgroundColor: 'white',
                    borderColor: 'black',
                    color: 'black',
                    textTransform: 'none',
                    px: 2,
                    py: 0.5,
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                      borderColor: 'black',
                    },
                  }}
                  onClick={() => {
                    if (!user) {
                      alert("Debe iniciar sesión para reproducir la música");
                      navigate('/login');
                      return;
                    }
                    const trackDetail = tracksData.find(t => t.id === track.id);
                    if (trackDetail) {
                      playTrack(trackDetail); // Actualiza el reproductor global
                      setActiveTrackId(track.id);
                    } else {
                      console.error('Track not found in tracks.js');
                    }
                  }}
                >
                  Play
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Ratings:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          {ratings.map((rating, index) => (
            <li key={index}>
              <Typography variant="body2">
                {rating.comment} - {rating.rating} stars
              </Typography>
            </li>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AlbumPage;