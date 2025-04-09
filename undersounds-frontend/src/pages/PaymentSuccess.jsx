import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Grid, Button, Select, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const [orderSummary, setOrderSummary] = useState(null);
  // State to keep track of download format for each eligible item (keyed by item id)
  const [selectedFormats, setSelectedFormats] = useState({});

  useEffect(() => {
    const storedSummary = localStorage.getItem('orderSummary');
    if (storedSummary) {
      setOrderSummary(JSON.parse(storedSummary));
      // Opcional: limpiar el resumen almacenado
      localStorage.removeItem('orderSummary');
    }
  }, []);

  const handleFormatChange = (itemId, value) => {
    setSelectedFormats(prev => ({ ...prev, [itemId]: value }));
  };

  // Helper function to simulate conversion.
  // In a real app, you might call a backend API or use a library like ffmpeg.wasm.
  const convertAudioFormat = async (mp3Blob, targetFormat) => {
    // Esta función simula la conversión:
    // Simplemente cambia el tipo MIME según el formato seleccionado.
    let mimeType = 'audio/mpeg';
    if (targetFormat === '.wav') {
      mimeType = 'audio/wav';
    } else if (targetFormat === '.flac') {
      mimeType = 'audio/flac';
    }
    // Nota: en una conversión real se modificarían los datos del blob.
    return new Blob([mp3Blob], { type: mimeType });
  };

  // Nueva función para descargar y convertir el artículo en el formato seleccionado
  const handleDownload = async (item) => {
    const format = selectedFormats[item.id] || '.mp3';
    try {
      // Descarga el archivo mp3 original
      const response = await fetch(item.url);
      if (!response.ok) throw new Error("Error de red al descargar el archivo");
      const mp3Blob = await response.blob();
      // Si el formato solicitado no es mp3, convertirlo (simulación)
      const finalBlob = format === '.mp3' ? mp3Blob : await convertAudioFormat(mp3Blob, format);
      // Crear enlace de descarga
      const blobUrl = URL.createObjectURL(finalBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${item.name}${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error al descargar y convertir el archivo:", error);
      alert("No se pudo descargar el archivo en el formato seleccionado.");
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
                {/* Mostrar dropdown y botón para canciones de 0.99 y álbumes digitales */}
                {((item.type === 'song' && item.price === 0.99) || (item.type === 'album')) && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <Typography variant="body2" style={{ marginBottom: '0.3rem' }}>
                      <strong>Formato de descarga:</strong>
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Select
                        value={selectedFormats[item.id] || '.mp3'}
                        onChange={(e) => handleFormatChange(item.id, e.target.value)}
                        size="small"
                      >
                        <MenuItem value=".mp3">.mp3</MenuItem>
                        <MenuItem value=".wav">.wav</MenuItem>
                        <MenuItem value=".flac">.flac</MenuItem>
                      </Select>
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={() => handleDownload(item)}
                      >
                        Descargar
                      </Button>
                    </div>
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
        style={{ marginTop: '1rem' }} 
        component={Link} 
        to="/"
      >
        Ir a inicio
      </Button>
    </div>
  );
};

export default PaymentSuccess;