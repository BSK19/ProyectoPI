import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import '../styles/carrito.css';

const CarritoPage = () => {
    const { cartItems, removeFromCart } = useContext(CartContext);

    return (
        <div className="carrito-page">
            <h1>Carrito de compra</h1> {/* Título actualizado */}
            {cartItems.length === 0 ? (
                <p>El carrito está vacío</p>
            ) : (
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id}>
                            {item.name || item.title} - €{item.price.toFixed(2)}
                            <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CarritoPage;