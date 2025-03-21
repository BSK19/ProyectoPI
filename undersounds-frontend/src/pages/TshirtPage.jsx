import React, { useContext, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import tshirts from '../mockData/tshirts';
import artists from '../mockData/artists';
import '../styles/tshirt.css';

const TshirtPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);
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
      image: item.tshirtImage || item.image,
    });
    setFeedback(true); // Activar feedback
    setTimeout(() => setFeedback(false), 1000); // Desactivar feedback después de 1 segundo
  };

  return (
    <div className="tshirt-page">
      <img src={item.tshirtImage || item.image} alt={`${item.name} shirt`} />
      <div className="tshirt-details">
        <h1>{item.name}</h1>
        <p>{item.description}</p>
        <p>Tiempo de envío: {item.shippingTime}</p>
        <p>Precio: €
          {typeof item.price === 'number' ? item.price.toFixed(2) : 'Precio no disponible'}</p>
        <button
          className={`buy-button ${feedback ? 'active' : ''}`}
          onClick={handleAddToCart}
        >
          Añadir al carrito
        </button>
        {feedback && <p style={{ color: 'green', marginTop: '10px' }}>¡Añadido al carrito!</p>}
      </div>
    </div>
  );
};

export default TshirtPage;