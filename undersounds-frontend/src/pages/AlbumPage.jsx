import React, { useContext, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'; // Importar Link
import { Box, Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import '../styles/album.css';
import { PlayerContext } from '../context/PlayerContext';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import albumsData from '../mockData/albums';
import tracksData from '../mockData/tracks';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const AlbumPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { playTrack, stopTrack } = useContext(PlayerContext);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [activeTrackId, setActiveTrackId] = useState(null);
  const [feedback, setFeedback] = useState(false);

  // Obtiene el álbum del state o lo busca en la lista completa
  const albumFromState = location.state?.album;
  let album = albumFromState;
  if (!album) {
    album = albumsData.find((a) => a.id === parseInt(id, 10));
  }
  if (!album) {
    return <Typography variant="h5">Álbum no encontrado</Typography>;
  }

  const tracks = album.tracks || [];
  const ratings = album.ratings || [];

  const handleAddToCart = () => {
    addToCart({
      id: album.id,
      name: album.title,
      price: album.price,
      image: album.coverImage || '/assets/images/default-cover.jpg',
      type: 'album',
    });
    setFeedback(true);
    setTimeout(() => setFeedback(false), 1000);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        p: 3,
      }}
    >
      {/* Capa para desenfoque de la imagen de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${album.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          zIndex: -1,
        }}
      />

      {/* Contenido de la página */}
      <Box className="album-page" sx={{ maxWidth: 800, width: '100%', p: 3 }}>
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
              by{' '}
              <Link
                to={`/artistProfile/${album.artistId}`} // Asegúrate de que artistId contiene el ID del artista
                style={{ textDecoration: 'none', color: '#1DA0C3', fontWeight: 'bold' }}
              >
                {album.artist} {/* Este sigue mostrando el nombre del artista */}
              </Link>
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
            {tracks.map((track) => (
              <Grid item xs={12} key={track.id}>
                <Box
                  className="track-item"
                  sx={{ p: 2, borderRadius: '8px', boxShadow: 1, backgroundColor: '#fff' }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'medium', marginRight: 'auto' }}
                  >
                    {track.title} - {track.duration}
                  </Typography>

                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      mt: 1,
                      backgroundColor: '#1DA0C3',
                      borderColor: '#1DA0C3',
                      color: 'white',
                      textTransform: 'none',
                      px: 2,
                      py: 2,
                      borderRadius: '50%',
                      '&:hover': {
                        backgroundColor: '#1976d2',
                        borderColor: '#1976d2',
                      },
                      marginLeft: 'auto',
                      minWidth: '60px',
                    }}
                    startIcon={<PlayArrowIcon sx={{ size: '60px', color: 'white' }} />}
                    onClick={() => {
                      if (!user) {
                        alert('Debe iniciar sesión para reproducir la música');
                        navigate('/login');
                        return;
                      }
                      const trackDetail = tracksData.find((t) => t.id === track.id);
                      if (trackDetail) {
                        playTrack(trackDetail);
                        setActiveTrackId(track.id);
                      } else {
                        console.error('Track not found in tracks.js');
                      }
                    }}
                  >
                    {/* No es necesario texto aquí, ya que el ícono lo sustituye */}
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
    </Box>
  );
};

export default AlbumPage;