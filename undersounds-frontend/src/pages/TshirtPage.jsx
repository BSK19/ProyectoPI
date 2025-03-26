import React, { useContext, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import tshirts from '../mockData/tshirts';
import artists from '../mockData/artists';
import '../styles/tshirt.css';

const TshirtPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [feedback, setFeedback] = useState(false); // Estado para el feedback visual
  const itemId = parseInt(id);
  const from = location.state?.from;

  let item;

  if (from === "artistMerch") {
    const allMerchandising = artists.flatMap(artist => artist.merchandising);
    item = allMerchandising.find((m) => m.id === itemId);
  } else {
    item = tshirts.find((t) => t.id === itemId);
    if (!item) {
      const allMerchandising = artists.flatMap(artist => artist.merchandising);
      item = allMerchandising.find((m) => m.id === itemId);
    }
  }

  if (!item) {
    return <div>Camiseta no encontrada</div>;
  }

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.merchImage || item.tshirtImage || item.image,
    });
    setFeedback(true); // Activar feedback
    setTimeout(() => setFeedback(false), 1000); // Desactivar feedback después de 1 segundo
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.merchImage || item.tshirtImage || item.image,
    });
    navigate('/payment');
  };

  return (
    <div className="tshirt-page">
      <img
        src={item.merchImage || item.tshirtImage || item.image}
        alt={`${item.name} shirt`}
      />
      <div className="tshirt-details">
        <h1>{item.name}</h1>
        <p className="tshirt-description">{item.description}</p>
        <p className="shipping-time">Tiempo de envío: {item.shippingTime}</p>
        <p className="price-text">
          Precio: ${typeof item.price === 'number' ? item.price.toFixed(2) : 'Precio no disponible'}
        </p>
        <div className="buttons-container">
          <button
            className={`buy-button ${feedback ? 'active' : ''}`}
            onClick={handleAddToCart}
          >
            Añadir al carrito
          </button>
          <button
            className="buy-button buy-now"
            onClick={handleBuyNow}
          >
            Comprar ahora
          </button>
        </div>
        {feedback && <p style={{ color: 'green', marginTop: '10px' }}>¡Añadido al carrito!</p>}
      </div>
    </div>
  );
};

export default TshirtPage;