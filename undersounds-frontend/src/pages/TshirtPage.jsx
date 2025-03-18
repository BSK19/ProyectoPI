import React from 'react';
import { useParams } from 'react-router-dom';
import tshirts from '../mockData/tshirts';
import '../styles/tshirt.css';

const TshirtPage = () => {
    const { id } = useParams();
    const tshirtId = parseInt(id);
    const tshirt = tshirts.find((t) => t.id === tshirtId);

    if (!tshirt) {
        return <div>Camiseta no encontrada</div>;
    }

    return (
        <div className="tshirt-page">
            <img 
                src={tshirt.tshirtImage} 
                alt={`${tshirt.name} shirt`} 
            />
            <div className="tshirt-details">
                <h1>{tshirt.name}</h1>
                <p>Descripción: {tshirt.description}</p>
                <p>Tiempo de envío: {tshirt.shippingTime}</p>
                <p>Precio: €{tshirt.price.toFixed(2)}</p>
                <button className="buy-button">Añadir al carrito</button>
            </div>
        </div>
    );
};

export default TshirtPage;