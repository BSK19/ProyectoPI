import React, { useContext, useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { merchService } from '../services/merchandisingService'; // Servicio real
import axios from 'axios'; // Asegúrate de importar axios
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

  console.log("ITEM:", item);

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

  // Actualización de handleBuyNow para replicar la funcionalidad de proceder al pago
  const handleBuyNow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Se crea un resumen de pedido para un solo producto con cantidad 1
    const orderSummary = {
      items: [
        {
          id: item._id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
        },
      ],
      total: item.price + 5, // Agregando, por ejemplo, un coste de envío fijo de 5
    };

    // Guardar el resumen en localStorage
    localStorage.setItem('orderSummary', JSON.stringify(orderSummary));

    // Iniciar el proceso de pago, similar al botón "proceder al pago"
    try {
      const response = await axios.post('http://localhost:5000/create-checkout-session', {
        items: orderSummary.items,
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error al iniciar el pago:", error);
      alert("Error al iniciar el pago.");
    }
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