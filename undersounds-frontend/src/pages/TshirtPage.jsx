import React, { useContext, useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { merchService } from '../services/merchandisingService'; // Servicio real
import '../styles/tshirt.css';

const TshirtPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [item, setItem] = useState(null);
  const [feedback, setFeedback] = useState(false);

  // Cargar camiseta desde Mongo por ID
  useEffect(() => {
    const fetchTshirt = async () => {
      try {
        const tshirt = await merchService.getMerchById(id); // Asegúrate de tener este método
        setItem(tshirt);
      } catch (err) {
        console.error('Error fetching merch item:', err);
      }
    };

    fetchTshirt();
  }, [id]);

  if (!item) {
    return <div>Camiseta no encontrada {id}</div>;
  }

  console.log("ITEM:", item); // <-- Aquí pon esto

  const handleAddToCart = () => {
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    setFeedback(true);
    setTimeout(() => setFeedback(false), 1000);
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    navigate('/payment');
  };

  return (
    
    <div className="tshirt-page">
      <img
        src={item.image}
        alt={`${item.name} shirt`}
      />
      <div className="tshirt-details">
        <h1>{item.name}</h1>
        <p className="tshirt-description">{item.description}</p>
        {/* Si quieres manejar shippingTime, asegúrate que existe en la base de datos */}
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
