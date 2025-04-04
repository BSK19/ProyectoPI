import React, { useContext, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { Box, Button, Card, CardContent, CardMedia, Grid, Typography, Avatar } from '@mui/material';
import { Star } from '@mui/icons-material';
import '../styles/album.css';
import { PlayerContext } from '../context/PlayerContext';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import albumsData from '../mockData/albums';
import tracksData from '../mockData/tracks';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import defaultImage from '../assets/images/botonPlay.jpg';  // Imagen por defecto
const ProfileImage = ''; // Ruta de la imagen de perfil estática

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

  // Estados para la imagen
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Imágenes
  const hoverImage = "/images/play-button-dark.png"; // Imagen al pasar el mouse
  const clickedImage = "/images/pause-button.png";  // Imagen cuando se hace clic

  const handleClick = () => {
    if (!user) {
      alert("Debe iniciar sesión para reproducir la música");
      navigate("/login");
      return;
    }

    const trackDetail = tracksData.find((t) => t.id === track.id);
    if (trackDetail) {
      playTrack(trackDetail);
      setActiveTrackId(track.id);
      setIsClicked(!isClicked); // Alternar entre play y pausa
    } else {
      console.error("Track not found in tracks.js");
    }
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
            <Typography variant="subtitle1" color="black">
              by{' '}
              <Link
                to={`/artistProfile/${album.artistId}`}
                style={{ textDecoration: 'none', color: '#1DA0C3', fontWeight: 'bold' }}
              >
                {album.artist}
              </Link>
            </Typography>
            <Grid container>
              <Grid item xs={6}>
                <Typography style={{ color: "gray", margin: "0px", display: "flex", alignItems: "center" }}>
                  Lanzado en: {album.releaseYear}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  width: '100%',
                }}>
                  <Typography style={{ marginRight: '10px' }}>Genres:</Typography>
                  <Typography className="tag">
                    #{album.genre}
                  </Typography>
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={1} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <h4 className="precio">
                 /{album.price.toFixed(2)}$
                </h4>
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
            Lista de canciones:
          </Typography>
          
          <div className='lista_espaciada'>
            <Typography className="ind_cancion" style={{ margin: '0% 0% 0% 4%' }}>
              #
            </Typography>
            <Typography className="ind_cancion" style={{ margin: '0% 0% 0% 9%' }}>
              Nombre
            </Typography>
            <Typography className="ind_cancion" style={{ margin: '0% 0% 0% 19%' }}>
              Autores
            </Typography>
            <Typography className="ind_cancion" style={{ margin: '0% 0% 0% 39%' }}>
              Reproducciones
            </Typography>
          </div>

          <Grid container spacing={0}>
            {tracks.map((track) => (
              <Grid item xs={12} key={track.id}>
                <Box
                  className="track-item"
                  sx={{ p: 1, borderRadius: '8px', boxShadow: 3, backgroundColor: '#fff' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Typography style={{ fontSize: "1.1rem", color: "black", margin: "0px 20px" }}>
                      {track.id}
                    </Typography>

                    <img
                      src={defaultImage}
                      alt="Play Button"
                      onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.7)")}
                      onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
                      onClick={() => {
                        if (!user) {
                          alert("Debe iniciar sesión para reproducir la música");
                          navigate("/login");
                          return;
                        }
                        const trackDetail = tracksData.find((t) => t.id === track.id);
                        if (trackDetail) {
                          playTrack(trackDetail);
                          setActiveTrackId(track.id);
                        } else {
                          console.error("Track not found in tracks.js");
                        }
                      }}
                      style={{
                        margin: "0px 5px",
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                        transition: "filter 0.3s ease-in-out",
                      }}
                    />
                    <div style={{ marginLeft: '10px', marginTop: '0px', width: '200px', height: '40px' }}>
                      <Typography style={{ fontSize: "1.1rem", color: "black", margin: "0px" }}>
                        {track.title}
                      </Typography>
                      <Typography style={{ fontSize: "0.8rem", color: "gray", margin: "0px" }}>
                        {track.duration}
                      </Typography>
                    </div>

                    <Typography style={{ fontSize: "0.8rem", color: "gray", margin: "0px" }}>
                      {track.autor}
                    </Typography>

                    <Typography style={{ fontSize: "0.8rem", color: "gray", margin: "0px", marginLeft: "auto" }}>
                      {track.n_reproducciones.toLocaleString("es-ES")}
                    </Typography>
                  </div>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Valoraciones:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {ratings.map((rating, index) => (
              <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <Avatar src={ProfileImage} alt="Perfil Usuario" sx={{ width: 40, height: 40, marginRight: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {rating.comment}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {[...Array(5)].map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        sx={{
                          color: starIndex < rating.rating ? 'gold' : 'gray',
                          fontSize: 18,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </li>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AlbumPage;