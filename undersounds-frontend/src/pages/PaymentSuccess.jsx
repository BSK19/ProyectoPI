import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const [orderSummary, setOrderSummary] = useState(null);

  useEffect(() => {
    const storedSummary = localStorage.getItem('orderSummary');
    if (storedSummary) {
      setOrderSummary(JSON.parse(storedSummary));
      // Opcional: limpiar el resumen almacenado
      localStorage.removeItem('orderSummary');
    }
  }, []);

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
        to="/">
        Ir a inicio
      </Button>
    </div>
  );
};

export default PaymentSuccess;