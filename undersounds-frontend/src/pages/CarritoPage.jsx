import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/carrito.css';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Typography } from '@mui/material';

const CarritoPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Calcular el total considerando la cantidad de cada producto
  const total = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("El carrito está vacío. Agrega productos antes de proceder al pago.");
      return;
    }
    if (!user) {
      // Si no está logueado, redirigir a la página de login
      navigate('/login');
      return;
    }
    navigate('/payment'); // Redirigir a la página de pago
  };

  return (
    <div className="carrito-page">
      <div className="cart-summary">
        <h2>Resumen</h2>
        <p>Total: €{total.toFixed(2)}</p>
        <button className="proceed-button" onClick={handleCheckout}>
          Proceder al pago
        </button>
      </div>
      <h1>Carrito de Compra</h1>
      {cartItems.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cartItems.map((item) => (
            <li key={item.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  mb: 2,
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '80px', borderRadius: '8px' }}
                />
                <Box sx={{ flex: 1, ml: 2 }}>
                  <Typography variant="subtitle1">{item.name}</Typography>
                  <Typography variant="body2">
                    €{item.price.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    sx={{
                      backgroundColor: '#1da0c3',
                      p: 0.25, // Padding reducido
                      '&:hover': { backgroundColor: '#d5d5d5' },
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body1">{item.quantity}</Typography>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    sx={{
                      backgroundColor: '#1da0c3',
                      p: 0.25, // Padding reducido
                      '&:hover': { backgroundColor: '#d5d5d5' },
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
                <IconButton
                  color="error"
                  onClick={() => removeFromCart(item.id)}
                  sx={{
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                    p: 0.5,
                    '&:hover': {
                      backgroundColor: '#ffe6e6',
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CarritoPage;