import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import artists from '../mockData/artists'; // Asegúrate de que los datos están bien cargados
import { Typography, Box, Grid, Tab, Tabs } from '@mui/material';

import '../styles/artistProfile.css'; // Importa el archivo CSS

import artistaIMG from '../assets/images/artista.jpg'; // Imagen provisional
import albumIMG from '../assets/images/albumPortada.jpg'; // Imagen provisional

const ArtistProfile = () => {
  const { id } = useParams(); // Capturamos el parámetro de la URL
  const artist = artists.find((artista) => artista.id === parseInt(id));

  if (!artist) {
    return <Typography variant="h5">Artista con ID no encontrado</Typography>;
  }

  // Estado para los tabs
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Función para accesibilidad en los tabs
  const a11yProps = (index) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  });

  const renderConcerts = (concerts) => {
    return (
      <Grid container spacing={4} justifyContent="flex-start"  className="tab-content">
        {concerts.map((concert) => (
          <Grid item key={concert.id} xs={6} sm={4} md={3} lg={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="grid-item">
            {/* Imagen del concierto */}
            <div style={{
              width: '100%',
              paddingTop: '100%',  // Esto asegura que la imagen sea cuadrada (proporción 1:1)
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '10px', // Redondea las esquinas
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
            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '8px' }} className="item-title">
              Concert at {concert.location}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center' }} className="item-details">Date: {concert.date}</Typography>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderMerchandise = (merchandise) => {
    return (
      <Grid container spacing={4} justifyContent="flex-start" className="tab-content">
        {merchandise.map((item) => (
          <Grid item key={item.id} xs={6} sm={4} md={3} lg={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="grid-item">
            {/* Imagen del merchandising */}
            <div style={{
              width: '100%',
              paddingTop: '100%',  // Esto asegura que la imagen sea cuadrada (proporción 1:1)
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '10px', // Redondea las esquinas
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
                  objectFit: 'cover',  // Hace que la imagen llene el área sin deformarse
                }}
              />
            </div>
  
            {/* Datos del merchandising */}
            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '8px' }} className="item-title">
              {item.name}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center' }} className="item-details">
              Price: ${item.price}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center' }} className="item-details">
              {item.description}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  };
  // Función para mostrar los álbumes de un artista
  const renderAlbums = (albums) => {
    return (
      <Grid container spacing={4} justifyContent="flex-start"  className="tab-content">
        {albums.map((album) => (
          <Grid item key={album.id} xs={6} sm={4} md={3} lg={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',  }} className="grid-item">
            {/* Imagen del álbum */}
            <div style={{
              width: '100%',
              paddingTop: '100%',  // Esto asegura que la imagen sea cuadrada (proporción 1:1)
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '5px', // Redondea las esquinas
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Sombra para la imagen
            }}>
              <img
                src={albumIMG}
                alt={album.title}
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
  
            {/* Datos del álbum */}
            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '8px' }} className="item-title">{album.title}</Typography>
            <Typography variant="body2" sx={{ textAlign: 'center' }} className="item-details">Año: {album.releaseYear}</Typography>
            <Typography variant="body2" sx={{ textAlign: 'center' }} className="item-details">Precio: ${album.price}</Typography>
          </Grid>
        ))}
      </Grid>
    );
  };
  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ padding: '0px' }} className="container">
      {/* Nombre del artista */}
      <Grid item xs={12}   sx={{ 
          height: '10%', 
          backgroundColor: '#000000', 
          marginTop: '15px', 
          marginBottom: '15px', 
          width: '100vw',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)', // Sombra hacia abajo
        }} >
        <Box textAlign="center">
        <Typography 
          variant="h3" 
          sx={{ 
            marginBottom: '20px', 
            fontWeight: 'bold',          // Hacer el texto más fuerte
            color: 'white',              // Color oscuro para contrastar con el fondo
            textTransform: 'uppercase', // Convertir todo el texto a mayúsculas
            letterSpacing: '2px',       // Añadir espaciado entre las letras
            textShadow: '2px 2px 6px rgba(255, 0, 0, 0.66)', // Añadir sombra suave para darle profundidad
            fontFamily: '"Roboto", sans-serif',  // Asegurar una tipografía moderna
            lineHeight: 1.2,            // Ajustar la altura de la línea para un mejor espaciado
            textAlign: 'center',        // Centrar el texto
          }} 
        >
          {artist.name}
        </Typography>

        </Box>
      </Grid>

      {/* Contenedor principal */}
      <Grid item xs={12} container sx={{ height: '90%' }}>
        <Grid item xs={7} sx={{ borderRight: '2px solid black', marginTop: '-33px' }}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                sx={{
                  "& .MuiTab-root": { color: "black" }, // Color del texto en tabs no seleccionados
                  "& .Mui-selected": { color: "black", fontWeight: "bold" }, // Color del tab seleccionado
                  "& .MuiTabs-indicator": { backgroundColor: "black" }, // Color de la línea de selección
                  "& .MuiTab-textColorInherit": { color: "black" }, // Color del texto heredado
                  margin: 0, padding: 0, height: 'auto'
                }}
              >
                <Tab label="Álbumes" {...a11yProps(0)} />
                <Tab label="Merchandising" {...a11yProps(1)} />
                <Tab label="Conciertos" {...a11yProps(2)} />
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            {/* Mostrar los álbumes */}
            {renderAlbums(artist.albums)}
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1}>
            {renderMerchandise(artist.merchandising)}
          </CustomTabPanel>

          <CustomTabPanel value={value} index={2}>
            {renderConcerts(artist.concerts)}
          </CustomTabPanel>
        </Grid>

        {/* Segunda columna (40%) */}
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
      sx={{ p: 2, backgroundColor: 'black', height: '87%', overflowY: 'auto', margin:1 }}
      className="tab-panel"
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
};

export default ArtistProfile;
