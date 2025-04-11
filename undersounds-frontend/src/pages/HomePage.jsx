import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/homePage.css';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Typography, Box, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import { getNews } from '../services/newsService';
import { AlbumContext } from '../context/AlbumContext';
import { AuthContext } from '../context/AuthContext';
import { fetchAlbums } from '../services/jamendoService';

const HomePage = () => {
  const [news, setNews] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();
  const { setSelectedAlbumId } = useContext(AlbumContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const fetchedNews = await getNews();
        setNews(fetchedNews);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    loadNews();

    const loadAlbums = async () => {
      try {
        const fetchedAlbums = await fetchAlbums();
        setAlbums(fetchedAlbums);
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };
    loadAlbums();
  }, []);

  useEffect(() => {
    const loadArtists = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/artists');
        setArtists(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };
    loadArtists();
  }, []);

  // Desestructuramos las tres primeras noticias (fallback vacío)
  const noticia = news[0] || {};
  const noticia2 = news[1] || {};
  const noticia3 = news[2] || {};

  const handleAlbumClick = (album) => {
    setSelectedAlbumId(album.id);
    navigate(`/album/${album.id}`, { state: { album } });
  };

  const [startIndex, setStartIndex] = useState(0);
  const [startIndexNew, setStartIndexNew] = useState(0);
  const [startIndexArt, setStartIndexArt] = useState(0);
  const itemsPerPage = 4;

  // Función auxiliar para determinar el nombre del artista
  const getArtistName = (album) => {
    // Si el campo artist es una cadena o un objeto con propiedad name, se utiliza
    if (typeof album.artist === 'string') {
      return album.artist;
    }
    if (album.artist && typeof album.artist === 'object' && album.artist.name) {
      return album.artist.name;
    }
  };

  // Función para renderizar cada álbum
  const renderAlbumItem = (album) => (
    <div key={album.id} onClick={() => handleAlbumClick(album)} style={{ flex: '0 0 calc(25%)', cursor: 'pointer' }}>
      <Card className="item" sx={{ maxWidth: 310 }}>
        <CardMedia
          component="img"
          alt={`${album.title} cover`}
          image={album.coverImage}
          sx={{ aspectRatio: '1 / 1', padding: '15px' }}
        />
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {album.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              por {getArtistName(album)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Género: {album.genre}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );

  return (
    <div>
      {/* Sección de noticias */}
      <Grid
        container
        sx={{
          marginTop: 0,
          color: 'white',
          minHeight: '300px',
        }}
        justifyContent="center"
      >
        <Grid item xs={12} md={8} textAlign="center" sx={{ mt: 0, maxHeight: '550px' }}>
          <Link to={`news/${noticia.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                borderRadius: '0px',
                backgroundColor: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={noticia.image}
                alt={noticia.titulo}
                className="img-hover"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'fill',
                  borderRadius: '0px',
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  padding: '8px',
                  textAlign: 'left',
                }}
              >
                {noticia.titulo}
              </Typography>
            </Box>
          </Link>
        </Grid>

        <Grid
          item
          xs={12}
          md={4}
          sx={{
            mt: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Link to={`/news/${noticia2.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Grid
              container
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                height: '50%',
                maxHeight: '350px',
              }}
            >
              <img
                src={noticia2.image}
                alt={noticia2.titulo}
                className="img-hover"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'fill',
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  padding: '8px',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                }}
              >
                {noticia2.titulo}
              </Typography>
            </Grid>
          </Link>
          <Link to={`/news/${noticia3.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Grid
              container
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                height: '50%',
                maxHeight: '200px',
              }}
            >
              <img
                src={noticia3.image}
                alt={noticia3.titulo}
                className="img-hover"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'fill',
                  maxHeight: '200px',
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  padding: '8px',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                }}
              >
                {noticia3.titulo}
              </Typography>
            </Grid>
          </Link>
        </Grid>
      </Grid>

      {/* Sección de Álbumes Recomendados */}
      <Box className="envoltorio">
        <div className="featured-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', color: 'black' }}>
            <h2>Álbumes Recomendados</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="boton-carrusel" onClick={() => setStartIndex(Math.max(0, startIndex - 3))}>
                {"<"}
              </button>
              <button className="boton-carrusel" onClick={() => setStartIndex(Math.min(albums.length - 4, startIndex + 3))}>
                {">"}
              </button>
            </div>
          </div>

          <div style={{ overflow: 'hidden', width: '100%' }}>
            <div
              className="album-list"
              style={{
                display: 'flex',
                gap: '10px',
                transform: `translateX(-${(startIndex * 100) / 4}%)`,
                transition: 'transform 0.5s ease-in-out'
              }}
            >
              {albums.map((album) => renderAlbumItem(album))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '0px' }}>
            <Link to="/discover" style={{ textDecoration: 'underline', color: '#0066cc', marginTop: '1%' }}>
              <h6>Ver más</h6>
            </Link>
          </div>
        </div>
      </Box>

      {/* Sección "Nuevos Álbumes" */}
      <Box className="envoltorio">
        <div className="featured-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', color: 'black' }}>
            <h2>Nuevos Álbumes</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="boton-carrusel" onClick={() => setStartIndexNew(Math.max(0, startIndexNew - 3))}>
                {"<"}
              </button>
              <button className="boton-carrusel" onClick={() => setStartIndexNew(Math.min(albums.length - 4, startIndexNew + 3))}>
                {">"}
              </button>
            </div>
          </div>

          <div style={{ overflow: 'hidden', width: '100%' }}>
            <div
              className="album-list"
              style={{
                display: 'flex',
                gap: '10px',
                transform: `translateX(-${(startIndexNew * 100) / 4}%)`,
                transition: 'transform 0.5s ease-in-out'
              }}
            >
              {albums
                .slice()
                .sort((a, b) => {
                  if (b.releaseYear !== a.releaseYear) {
                    return b.releaseYear - a.releaseYear;
                  }
                  return a.title.localeCompare(b.title);
                })
                .map((album) => renderAlbumItem(album))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '0px' }}>
            <Link to="/discover" style={{ textDecoration: 'underline', color: '#0066cc', marginTop: '1%' }}>
              <h6>Ver más</h6>
            </Link>
          </div>
        </div>
      </Box>

{/* Sección de Artistas */}
<Box className="envoltorio">
  <div className="featured-section">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', color: 'black' }}>
      <h2>Descubre a nuestros artistas</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="boton-carrusel" onClick={() => setStartIndexArt(Math.max(0, startIndexArt - 3))}>
          {"<"}
        </button>
        <button className="boton-carrusel" onClick={() => setStartIndexArt(Math.min(artists.length - 4, startIndexArt + 3))}>
          {">"}
        </button>
      </div>
    </div>

    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div 
        className="album-list" 
        style={{
          display: 'flex',
          gap: '10px',
          transform: `translateX(-${(startIndexArt * 100) / 4}%)`,
          transition: 'transform 0.5s ease-in-out'
        }}
      >
        {artists.map((artist) => (
          <div key={artist.id} style={{ flex: '0 0 calc(25%)', cursor: 'pointer' }}>
            <Link to={`/artistProfile/${artist.id}`} style={{ textDecoration: 'none' }}>
              <Card className="item" sx={{ maxWidth: 310 }}>
                <CardMedia
                  component="img"
                  image={artist.profileImage || '/assets/default-profile.jpg'}
                  alt={`${artist.name} profile`}
                  sx={{ aspectRatio: '1 / 1', padding: '15px' }}
                />
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {artist.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Género: {artist.genre}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>

    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '0px' }}>
      <Link to="/discover" style={{ textDecoration: 'underline', color: '#0066cc', marginTop: '1%' }}>
        <h6>Ver más</h6>
      </Link>
    </div>
  </div>
</Box>

      {/* Sección para invitación a registrarse si no hay usuario */}
      {!user && (
        <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
          <h5 style={{ fontSize: '1rem', color: '#333', marginBottom: '10px' }}>
            ¿Te gusta Bandcamp? Registrate y disfruta de la experiencia completa
          </h5>
          <Link to="/register">
            <button className="boton-registro">Registrarse</button>
          </Link>
        </div>
      )}

      <div style={{ textAlign: 'start-flex', marginTop: '40px', marginLeft: '30px', marginBottom: '20px' }}>
        <Link to="/explore">
          <h5 style={{ fontSize: '1rem', color: '#1DA1C3', marginBottom: '5px' }}>CONTINÚA EXPLORANDO</h5>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;