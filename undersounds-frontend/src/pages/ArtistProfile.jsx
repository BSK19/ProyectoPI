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
  console.log('id recibido:', id);
  const artist = artists.find((artista) => artista.id === parseInt(id));
  console.log('artist encontrado:', artist);
  const navigate = useNavigate();

  if (!artist) {
    return <Typography variant="h5">Artista con ID no encontrado</Typography>;
  }

  // Estado para los tabs
  const [value, setValue] = useState(0);
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

  // Renderizado de Álbumes
  const renderAlbums = (albums) => {
    return (
      <Grid container spacing={4} justifyContent="flex-start" className="tab-content">
        {albums.map((album) => (
          <Grid
            item
            key={album.id}
            xs={6}
            sm={4}
            md={3}
            lg={2}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            className="grid-item"
            onClick={() =>
              navigate(`/album/${album.id}`, { state: { album } })
            }
          >
            <div style={{
              width: '100%',
              paddingTop: '100%',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '5px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            }}>
              <img 
                src={album.albumIMG} 
                alt={album.title} 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'fill'
                }}
              />
            </div>
            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '8px' }} className="item-title">
              {album.title}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center' }} className="item-details">
              Año: {album.releaseYear}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center' }} className="item-details">
              Precio: ${album.price}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Renderizado de Merchandising (se envía state para indicar que viene desde ArtistProfile)
  const renderMerchandise = (merchandise) => {
    return (
      <Grid container spacing={4} justifyContent="flex-start" className="tab-content">
        {merchandise.map((item) => (
          <Grid
            item
            key={item.id}
            xs={6}
            sm={4}
            md={3}
            lg={2}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
            className="grid-item"
            onClick={() =>
              navigate(`/tshirt/${item.id}`, { state: { from: 'artistMerch' } })
            }
          >
            <div style={{
              width: '100%',
              paddingTop: '100%',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            }}>
              <img 
                src={item.merchImage} 
                alt={item.name} 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '8px' }} className="item-title">
              {item.name}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center' }} className="item-details">
              Precio: ${item.price}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center' }} className="item-details">
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
      <Grid container spacing={4} justifyContent="flex-start" className="tab-content">
        {concerts.map((concert) => (
          <Grid
            item
            key={concert.id}
            xs={6}
            sm={4}
            md={3}
            lg={2}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            className="grid-item"
          >
            <div style={{
              width: '100%',
              paddingTop: '100%',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            }}>
              <img 
                src={concert.concertImage} 
                alt={`Concert at ${concert.location}`} 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '8px' }} className="item-title">
              Concert at {concert.location}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center' }} className="item-details">
              Fecha: {concert.date}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ padding: '0px' }} className="container">
      {/* Encabezado con el nombre del artista */}
      <Grid item xs={12} sx={{
          height: '10%',
          backgroundColor: '#000000',
          marginTop: '15px',
          marginBottom: '15px',
          width: '100vw',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
      }}>
        <Box textAlign="center">
          <Typography
            variant="h3"
            sx={{
              marginBottom: '20px',
              fontWeight: 'bold',
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              textShadow: '2px 2px 6px rgba(255, 0, 0, 0.66)',
              fontFamily: '"Roboto", sans-serif',
              lineHeight: 1.2,
              textAlign: 'center',
            }}
          >
            {artist.name}
          </Typography>
        </Box>
      </Grid>
  
      {/* Panel principal con tabs */}
      <Grid item xs={12} container sx={{ height: '90%' }}>
        <Grid item xs={7} sx={{ borderRight: '2px solid black', marginTop: '-33px' }}>
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
                margin: 0,
                padding: 0,
                height: 'auto'
              }}
            >
              <Tab label="Álbumes" {...a11yProps(0)} />
              <Tab label="Merchandising" {...a11yProps(1)} />
              <Tab label="Conciertos" {...a11yProps(2)} />
            </Tabs>
          </Box>
  
          <CustomTabPanel value={value} index={0}>
            {renderAlbums(artist.albums)}
          </CustomTabPanel>
  
          <CustomTabPanel value={value} index={1}>
            {renderMerchandise(artist.merchandising)}
          </CustomTabPanel>
  
          <CustomTabPanel value={value} index={2}>
            {renderConcerts(artist.concerts)}
          </CustomTabPanel>
        </Grid>
  
        {/* Segunda columna: Perfil del artista */}
        <Grid item xs={5} sx={{ textAlign: 'center' }}>
          <img
            src={artistaIMG}
            alt={artist.name}
            className="profile-image"
          />
          <Typography variant="h6" sx={{ marginTop: '20px' }} className="artist-bio">
            {artist.bio}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
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
      sx={{ p: 2, backgroundColor: 'black', height: '87%', overflowY: 'auto', margin: 1 }}
      className="tab-panel"
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
};

export default ArtistProfile;