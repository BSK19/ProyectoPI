import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/carrito.css';

const CarritoPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    clearCart();
    navigate('/'); // Redirige al inicio
  };

  return (
    <div className="carrito-page">
      <h1>Carrito de Compra</h1>
      {cartItems.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              <img src={item.image} alt={item.name} style={{ width: '50px', marginRight: '10px' }} />
              <span>{item.name} - €{item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
      <h2>Total: €{total.toFixed(2)}</h2>
      <button onClick={handleCheckout}>Proceder al Pago</button>
    </div>
  );
};

export default CarritoPage;