import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import artists from '../mockData/artists';
import { Typography, Box, Grid, Tab, Tabs } from '@mui/material';
import '../styles/artistProfile.css';
import artistaIMG from '../assets/images/artista.jpg';
import albumIMG from '../assets/images/albumPortada.jpg';
import albums from '../mockData/albums';

const ArtistProfile = () => {
  const { id } = useParams(); // Capturamos el parámetro de la URL
  const artist = artists.find((artista) => artista.id === parseInt(id));
  const navigate = useNavigate();

  if (!artist) {
    return <Typography variant="h5">Artista con ID no encontrado</Typography>;
  }

  // Estado para los tabs
  const [value, setValue] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false); // Estado para seguir al artista
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getArtistAlbums = (artist) => {
    return albums.filter((album) => album.artist === artist.name);
  };

  // Función de accesibilidad para los tabs
  const a11yProps = (index) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  });

  // Función para seguir al artista
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };
    
  // Renderizado de Álbumes
  const renderAlbums = (albums, navigate) => {  // <-- Acepta navigate como argumento
    return (
      <Grid container spacing={0} justifyContent="flex-start" className="tab-content">
        {albums.map((album) => (
          <Grid
            item
            key={album.id}
            xs={6} sm={2} md={3} lg={3}
            sx={{ display: 'flex', flexDirection: 'column' }}
            className="grid-item"
            onClick={() => navigate(`/album/${album.id}`, { state: { album } })} // <-- Ahora usa el navigate pasado
          >
            <div className="image-container">
              <img
                src={album.coverImage || albumIMG} // Si no hay coverImage, usa albumIMG por defecto
                alt={album.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '0px',
                  objectFit: 'cover',
                }}
              />
            </div>
            <Typography variant="h8" sx={{ textAlign: 'left' }} className="item-title">{album.title}</Typography>
            <Typography variant="body2" sx={{ textAlign: 'left' }} className="item-details">Año: {album.releaseYear}</Typography>
            <Typography variant="body2" sx={{ textAlign: 'left' }} className="item-details">Género: {album.genre}</Typography>
            <Typography variant="body2" sx={{ textAlign: 'left' }} className="item-details">Precio: ${album.price}</Typography>
          </Grid>
        ))}
      </Grid>
    );
  };
  

  // Renderizado de Merchandising (se ha eliminado la descripción del artículo)
  const renderMerchandise = (merchandise) => {
    return (
      <Grid container spacing={0} justifyContent="flex-start" className="tab-content">
        {merchandise.map((item) => (
          <Grid
            item
            key={item.id}
            xs={6} sm={2} md={3} lg={3} sx={{ display: 'flex', flexDirection: 'column',  }} 
            className="grid-item"
            onClick={() =>
              navigate(`/tshirt/${item.id}`, { state: { from: 'artistMerch' } })
            }
          >
            <div style={{
              width: '100%',
              paddingTop: '100%',  // Esto asegura que la imagen sea cuadrada (proporción 1:1)
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '0px', // Redondea las esquinas
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Sombra para la imagen
            }}>
              <img
                src={item.merchImage} // Usamos la imagen del merchandising
                alt={item.name} 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',  // Hace que la imagen llene el área sin deformarse
                }}
              />
            </div>
            <Typography variant="h8" sx={{ textAlign: 'left', marginTop: '8px' }} className="item-title">
              {item.name}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'left' }} className="item-details">
              Precio: ${item.price}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'left' }} className="item-details">
              {item.description}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Renderizado de Conciertos
  const renderConcerts = (concerts) => {
    return (
      <Grid container spacing={0} justifyContent="flex-start" className="tab-content">
        {concerts.map((concert) => (
          <Grid
            item
            key={concert.id}
            xs={6} sm={2} md={3} lg={3} sx={{ display: 'flex', flexDirection: 'column',  }} className="grid-item">
            <div style={{
              width: '100%',
              paddingTop: '100%',  // Esto asegura que la imagen sea cuadrada (proporción 1:1)
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '0px', // Redondea las esquinas
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Sombra para la imagen
            }}>
              <img
                src={concert.concertImage} // Usamos la imagen del concierto
                alt={`Concert at ${concert.location}`} 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',  // Hace que la imagen llene el área sin deformarse
                }}
              />
            </div>

            {/* Datos del concierto */}
            <Typography variant="h8" sx={{ textAlign: 'left' }} className="item-title">
              Concierto en {concert.location}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'left' }} className="item-details">Fecha: {concert.date}</Typography>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
<Box
  sx={{
    backgroundImage: `url(${artist.banner})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    maxHeight: '100vh', // Asegura que cubra toda la pantalla
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '50px',
  }}
>
  <Grid
    container
    spacing={2}
    justifyContent="center"
    alignItems="center"
    sx={{ paddingRight: '300px', paddingLeft: '300px', paddingTop: '150px', }}
    className="container"
  >
    {/* Panel principal con tabs */}
    <Grid item xs={12} container sx={{ height: '80%', border: '1px solid black', backgroundColor: 'rgba(255, 255, 255, 0.8)', }}>
      <Grid item xs={10} sx={{ borderRight: '2px solid black', marginTop: '-15px', paddingBottom: '30px', }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            sx={{
              "& .MuiTab-root": { color: "black" },
              "& .Mui-selected": { color: "black", fontWeight: "bold" },
              "& .MuiTabs-indicator": { backgroundColor: "black" },
              "& .MuiTab-textColorInherit": { color: "black" },
              margin: 0, padding: 0, height: 'auto'
            }}
          >
            <Tab label="Álbumes" {...a11yProps(0)} />
            <Tab label="Merchandising" {...a11yProps(1)} />
            <Tab label="Conciertos" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {renderAlbums(getArtistAlbums(artist), navigate)}
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          {renderMerchandise(artist.merchandising)}
        </CustomTabPanel>

        <CustomTabPanel value={value} index={2}>
          {renderConcerts(artist.concerts)}
        </CustomTabPanel>

        <Typography sx={{ fontSize: '12px', textAlign: 'left', marginLeft:'10px', marginTop:'10px'  }} className="artist-name">
            © 2025 {artist.name}. Todos los derechos reservados.
        </Typography>
      </Grid>

      {/* Segunda columna: Perfil del artista */}
      <Grid item xs={2} sx={{ textAlign: 'center', marginTop: '80px' }}>
        <div className="profile-image-container">
          <img src={artist.profileImage} alt={artist.name} className="profile-image" />
        </div>

        <Typography sx={{ fontSize: '25px', textAlign: 'left', marginLeft:'10px' }} className="artist-name">
          {artist.name}
        </Typography>

        <Typography sx={{ fontSize: '12px', textAlign: 'left', marginLeft:'10px' }} className="artist-name">
          {artist.ubicacion}
        </Typography>

        <button
          id="btn-seguir"
          className={`btn-seguir ${isFollowing ? 'siguiendo' : ''}`}
          onClick={handleFollow}
        >
          {isFollowing ? 'Siguiendo' : 'Seguir'}
        </button>
        <Typography
          variant="h6"
          sx={{
            fontSize: '14px',  // Aumenté el tamaño para mayor legibilidad
            fontWeight: 'bold',  // Resaltar el texto
            color: '#4A90E2',  // Color atractivo, puedes elegir otro que se ajuste a tu diseño
            textAlign: 'left',  // Alineación más natural para este tipo de texto
            padding: '8px',  // Agregar un poco de relleno para darle más espacio alrededor
            borderRadius: '5px',  // Borde redondeado para una apariencia más suave
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',  // Sombra ligera para darle profundidad
            alignItems: 'center',  // Alineación centrada para que el texto esté balanceado
          }}
          className="artist-bio"
        >
          Seguidores: {artist.seguidores}
        </Typography>

        <Typography variant="h6" sx={{ marginTop: '15px', fontSize: '15px', textAlign: 'justify', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',}} className="artist-bio">
          {artist.bio}
        </Typography>

        <Typography variant="h6" sx={{ marginTop: '15px', fontSize: '15px', textAlign: 'justify', }} className="artist-bio">
          <a
            href={artist.socialLinks.instagram}
            style={{
              textDecoration: 'none', // Eliminar el subrayado por defecto
              color: '#333', // Color del texto normal (gris oscuro, por ejemplo)
            }}
            onMouseEnter={(e) => {
              e.target.style.textDecoration = 'underline'; // Subraya el texto al pasar el ratón
              e.target.style.color = '#333'; // Cambia el color al pasar el ratón (color azul)
            }}
            onMouseLeave={(e) => {
              e.target.style.textDecoration = 'none'; // Elimina el subrayado cuando el ratón deja el enlace
              e.target.style.color = '#333'; // Restaura el color original del texto
            }}
          >
            Instragram.
          </a>
        </Typography>
        <Typography variant="h6" sx={{ marginTop: '0px', fontSize: '15px', textAlign: 'justify',}} className="artist-bio">
          <a
            href={artist.socialLinks.twitter}
            style={{
              textDecoration: 'none', // Eliminar el subrayado por defecto
              color: '#333', // Color del texto normal (gris oscuro, por ejemplo)
            }}
            onMouseEnter={(e) => {
              e.target.style.textDecoration = 'underline'; // Subraya el texto al pasar el ratón
              e.target.style.color = '#333'; // Cambia el color al pasar el ratón (color azul)
            }}
            onMouseLeave={(e) => {
              e.target.style.textDecoration = 'none'; // Elimina el subrayado cuando el ratón deja el enlace
              e.target.style.color = '#333'; // Restaura el color original del texto
            }}
          >
            Twitter.
          </a>
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: '10px', fontSize: '15px', textAlign: 'justify',}} className="artist-bio">
          <a
            href={artist.socialLinks.facebook}
            style={{
              textDecoration: 'none', // Eliminar el subrayado por defecto
              color: '#333', // Color del texto normal (gris oscuro, por ejemplo)
            }}
            onMouseEnter={(e) => {
              e.target.style.textDecoration = 'underline'; // Subraya el texto al pasar el ratón
              e.target.style.color = '#333'; // Cambia el color al pasar el ratón (color azul)
            }}
            onMouseLeave={(e) => {
              e.target.style.textDecoration = 'none'; // Elimina el subrayado cuando el ratón deja el enlace
              e.target.style.color = '#333'; // Restaura el color original del texto
            }}
          >
            Facebook.
          </a>
        </Typography>

      </Grid>
    </Grid>
  </Grid>
</Box>

  );
};

// Componente para manejar los paneles de contenido de los tabs
const CustomTabPanel = ({ children, value, index }) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      sx={{ p: 2, height: '87%', margin:0, paddingRight:1, }}
      className="tab-panel"
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
};

export default ArtistProfile;