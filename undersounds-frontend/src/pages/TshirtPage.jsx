import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import tshirts from '../mockData/tshirts';
import artists from '../mockData/artists';
import '../styles/tshirt.css';

const TshirtPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const itemId = parseInt(id);
    const from = location.state?.from;

    let item;

    // Si viene de la página de merchandising del artista, buscar entre el merchandising
    if (from === "artistMerch") {
        const allMerchandising = artists.flatMap(artist => artist.merchandising);
        item = allMerchandising.find((m) => m.id === itemId);
    } else {
        // Primero buscar en tshirts
        item = tshirts.find((t) => t.id === itemId);
        // Si no se encuentra, buscar entre el merchandising de todos los artistas
        if (!item) {
            const allMerchandising = artists.flatMap(artist => artist.merchandising);
            item = allMerchandising.find((m) => m.id === itemId);
        }
    }

    if (!item) {
        return <div>Camiseta no encontrada</div>;
    }

    return (
        <div className="tshirt-page">
            <img 
                src={item.merchImage || item.tshirtImage} 
                alt={`${item.name} shirt`} 
            />
            <div className="tshirt-details">
                <h1>{item.name}</h1>
                <p>Descripción: {item.description}</p>
                {item.shippingTime && <p>Tiempo de envío: {item.shippingTime}</p>}
                <p>Precio: €{item.price.toFixed(2)}</p>
                <button className="buy-button">Añadir al carrito</button>
            </div>
        </div>
    );
};

export default TshirtPage;