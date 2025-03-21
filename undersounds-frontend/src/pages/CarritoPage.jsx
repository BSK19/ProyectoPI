import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/carrito.css';

const CarritoPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Calcular el total considerando la cantidad de cada producto
  const total = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handleCheckout = () => {
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
          Proceder al Pago
        </button>
      </div>
      <h1>Carrito de Compra</h1>
      {cartItems.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div>
                <span>{item.name}</span>
                <span>€{item.price.toFixed(2)}</span>
              </div>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                <button onClick={() => removeFromCart(item.id)} className="remove-button">
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CarritoPage;