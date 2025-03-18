import React from 'react';
import PropTypes from 'prop-types';

const Tshirt = ({ tshirt }) => {
    return (
        <div className="tshirt">
            <img src={tshirt.s} alt={`${tshirt.name} shirt`} className="tshirt-image" />
            <h2 className="tshirt-name">{tshirt.name}</h2>
            <p className="tshirt-description">{tshirt.description}</p>
            <p className="tshirt-shipping-time">Tiempo de envío: {tshirt.shippingTime}</p>
            <p className="tshirt-price">€{tshirt.price}</p>
        </div>
    );
};

Tshirt.propTypes = {
    tshirt: PropTypes.shape({
        tshirtImage: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        shippingTime: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
    }).isRequired,
};

export default Tshirt;