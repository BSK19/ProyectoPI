import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Select, 
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import { downloadTrack, downloadAlbum } from '../services/jamendoService';

const PaymentSuccess = () => {
  const [orderSummary, setOrderSummary] = useState(null);
  const [selectedFormats, setSelectedFormats] = useState({});
  const [loading, setLoading] = useState({});
  const [notification, setNotification] = useState({ 
    open: false, 
    message: '', 
    severity: 'info' 
  });

  useEffect(() => {
    const storedSummary = localStorage.getItem('orderSummary');
    if (storedSummary) {
      const parsedSummary = JSON.parse(storedSummary);
      setOrderSummary(parsedSummary);
      
      // Inicializar formatos predeterminados para todos los items
      const initialFormats = {};
      parsedSummary.items.forEach(item => {
        initialFormats[item.id] = 'mp3'; // Formato por defecto
      });
      setSelectedFormats(initialFormats);
      
      // Opcional: limpiar el resumen almacenado
      // localStorage.removeItem('orderSummary');
    }
  }, []);

  const handleFormatChange = (itemId, value) => {
    setSelectedFormats(prev => ({ ...prev, [itemId]: value }));
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Función para descargar una pista individual
// Actualizar la función handleDownloadTrack

// Función para descargar una pista individual
const handleDownloadTrack = async (item) => {
  const format = selectedFormats[item.id] || 'mp3';
  
  // Marcar este item como en proceso de descarga
  setLoading(prev => ({ ...prev, [item.id]: true }));
  
  try {
    
    // Identificar correctamente los IDs
    // Para la descarga de una pista individual, necesitamos:
    // 1. El ID de la pista (trackId)
    // 2. El ID del álbum al que pertenece la pista (albumId que es ObjectID)
    const trackId = item.trackId || item.id;
    
    // Aquí es crucial usar el ID del álbum que sea el ObjectID de MongoDB
    const albumId = item.id; // Este ya debe ser el ObjectID según tu DTO
        
    // Llamar al servicio de descarga
    await downloadTrack(trackId, albumId, format);
    
    showNotification(`Descarga de "${item.name || item.title}" completada con éxito`, 'success');
  } catch (error) {
    console.error('Error en la descarga:', error);
    console.error('Error detallado:', error.response?.data || error.message);
    showNotification(`Error al descargar: ${error.message}`, 'error');
  } finally {
    // Desmarcar el estado de carga
    setLoading(prev => ({ ...prev, [item.id]: false }));
  }
};

  // Función para descargar un álbum completo
  const handleDownloadAlbum = async (item) => {
    const format = selectedFormats[item.id] || 'mp3';
    
    // Marcar este item como en proceso de descarga
    setLoading(prev => ({ ...prev, [item.id]: true }));
    
    try {
      // El álbum puede tener albumId o id dependiendo de la estructura de datos
      const albumId = item.albumId || item.id;
      
      // Llamar al servicio de descarga de álbum
      await downloadAlbum(albumId, format);
      
      showNotification(`Descarga del álbum "${item.name || item.title}" completada con éxito`, 'success');
    } catch (error) {
      console.error('Error en la descarga del álbum:', error);
      showNotification(`Error al descargar el álbum: ${error.message}`, 'error');
    } finally {
      // Desmarcar el estado de carga
      setLoading(prev => ({ ...prev, [item.id]: false }));
    }
  };

  // Función que determina qué tipo de descarga realizar
  const handleDownload = (item) => {
    if (item.type === 'album') {
      handleDownloadAlbum(item);
    } else {
      handleDownloadTrack(item);
    }
  };

  if (!orderSummary || !orderSummary.items || orderSummary.items.length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <Typography variant="h5">
          No se encontró ningún resumen del pedido.
        </Typography>
        <Button variant="contained" color="primary" component={Link} to="/">
          Ir a inicio
        </Button>
      </div>
    );
  }

  const { items, total } = orderSummary;

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        ¡Pago realizado con éxito!
      </Typography>
      <Typography variant="h6" gutterBottom>
        Resumen del pedido:
      </Typography>
      <Grid container spacing={2}>
        {items.map((item, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">
                  <strong>Producto:</strong> {item.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Cantidad:</strong> {item.quantity || 1}
                </Typography>
                <Typography variant="body2">
                  <strong>Precio:</strong> €{item.price.toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  <strong>Total:</strong> €{(item.price * (item.quantity || 1)).toFixed(2)}
                </Typography>
                {/* Mostrar dropdown y botón para productos descargables (canciones y álbumes) */}
                {((item.type === 'song' && item.price) || (item.type === 'album')) && (
                  <div style={{ marginTop: '1rem' }}>
                    <Typography variant="body2" style={{ marginBottom: '0.3rem' }}>
                      <strong>Formato de descarga:</strong>
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Select
                        value={selectedFormats[item.id] || 'mp3'}
                        onChange={(e) => handleFormatChange(item.id, e.target.value)}
                        size="small"
                        disabled={loading[item.id]}
                      >
                        <MenuItem value="mp3">MP3 (Compresión eficiente)</MenuItem>
                        <MenuItem value="wav">WAV (Alta calidad)</MenuItem>
                        <MenuItem value="flac">FLAC (Sin pérdida)</MenuItem>
                      </Select>
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={() => handleDownload(item)}
                        disabled={loading[item.id]}
                        startIcon={loading[item.id] ? <CircularProgress size={20} color="inherit" /> : null}
                      >
                        {loading[item.id] ? 'Descargando...' : 'Descargar'}
                      </Button>
                    </div>
                    {item.type === 'album' && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Se descargarán todas las pistas del álbum en formato {selectedFormats[item.id] || 'mp3'}
                      </Typography>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button 
        variant="contained" 
        color="primary" 
        style={{ marginTop: '2rem' }} 
        component={Link} 
        to="/"
      >
        Ir a inicio
      </Button>
      
      {/* Notificaciones */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PaymentSuccess;