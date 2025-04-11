import React, { useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Snackbar } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { AuthContext } from '../context/AuthContext';
import '../styles/concert.css';
import { formatDate } from '../utils/formatters';


const ConcertPage = () => {
  const { artistId, concertId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const concertFromState = location.state?.concert;
  let concert = concertFromState;

  if (!concert) {
    const artist = artists.find(a => a.id === parseInt(artistId));
    concert = artist?.concerts.find(c => c.id === parseInt(concertId));
  }

  if (!concert) {
    return <Typography variant="h5">Concierto no encontrado</Typography>;
  }

  const handleNotifyClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setOpenSnackbar(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#2c2c2c', // Fondo más oscuro
        padding: '2rem',
      }}
    >
      {/* Fondo difuminado */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${concert.concertImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(8px) brightness(0.5)', // Más oscuro
          opacity: 0.7, // Más transparente
          zIndex: 0,
        }}
      />

      {/* Contenedor principal */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          overflow: 'hidden',
          maxWidth: '1000px',
          width: '100%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)', // Sombra más pronunciada
        }}
      >
        {/* Imagen del concierto */}
        <Box
          sx={{
            width: '100%',
            height: '400px',
            position: 'relative',
            overflow: 'hidden',
            transform: 'scaleX(-1)', // Voltear horizontalmente
          }}
        >
          <img
            src={concert.concertImage}
            alt={`Concierto en ${concert.location}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'translateY(-30px)', // Desplazar hacia arriba
            }}
          />
        </Box>

        {/* Detalles del concierto */}
        <Box sx={{ padding: '2rem', backgroundColor: 'white' }}>
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '1.5rem'
            }}
          >
            {concert.location}
          </Typography>

          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ 
              color: '#666',
              marginBottom: '1rem'
            }}
          >
            Venue: {concert.venue}
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            gap: '2rem', 
            marginBottom: '2rem'
          }}>
            <Typography variant="h6" sx={{ color: '#666' }}>
              Fecha: {formatDate(concert.date)}
            </Typography>
            <Typography variant="h6" sx={{ color: '#666' }}>
              Hora: {concert.time}
            </Typography>
          </Box>

          <Typography 
            variant="body1" 
            paragraph
            sx={{ 
              color: '#444',
              lineHeight: 1.8,
              marginBottom: '2rem'
            }}
          >
            {concert.description}
          </Typography>

          <Button
            variant="contained"
            startIcon={<NotificationsActiveIcon sx={{ fontSize: 28 }} />}
            onClick={handleNotifyClick}
            sx={{
              backgroundColor: '#1DA0C3',
              padding: '15px 30px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#1788a3',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Notificar cuando la venta esté activa
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message="¡Te avisaremos cuando la venta de entradas esté disponible!"
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#1DA0C3',
          }
        }}
      />
    </Box>
  );
};

export default ConcertPage;