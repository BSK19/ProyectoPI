import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/payment.css'; // Archivo CSS para estilos

const Payment = () => {
  const { cartItems, clearCart } = useContext(CartContext); // Ahora también obtenemos clearCart
  const navigate = useNavigate();

  // Calcular el precio total del carrito
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  // Estados para los pasos del formulario
  const [currentStep, setCurrentStep] = useState('shipping'); // 'shipping' o 'payment'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    postalCode: '',
    city: '',
    email: '',
    phone: '',
  });
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardData({ ...cardData, [name]: value });
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    // Validar que todos los campos obligatorios estén completos
    if (Object.values(formData).some((field) => field.trim() === '')) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }
    setError('');
    setCurrentStep('payment'); // Cambiar al paso de pago
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Validar que todos los campos obligatorios estén completos
    if (Object.values(cardData).some((field) => field.trim() === '')) {
      setError('Por favor, completa los datos de la tarjeta.');
      return;
    }
    setError('');
    // Simulación de procesamiento de pago
    alert('Pago procesado con éxito');
    clearCart();  // Eliminar todos los artículos del carrito
    navigate('/'); // Redirigir a la página principal
  };

  return (
    <div className="payment-page">
      <h1>Pasar por caja</h1>
      <div className="payment-container">
        {/* Columna izquierda: Opciones de entrega y formulario */}
        <div className="payment-form">
          {currentStep === 'shipping' && (
            <div className="shipping-section">
              <h2>Información de envío</h2>
              <form onSubmit={handleShippingSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Nombre*"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Apellidos*"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="address"
                    placeholder="Calle y número*"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Código postal*"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    pattern="\d{5}" // Solo 5 dígitos
                    title="El código postal debe tener 5 dígitos."
                    required
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="Ciudad*"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico*"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Número de teléfono*"
                    value={formData.phone}
                    onChange={handleInputChange}
                    pattern="\d{9}" // Solo 9 dígitos
                    title="El número de teléfono debe tener 9 dígitos."
                    required
                  />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-button">
                  Guardar y continuar
                </button>
              </form>
            </div>
          )}

          {currentStep === 'payment' && (
            <div className="payment-section">
              <h2>Datos de la tarjeta</h2>
              <form onSubmit={handlePaymentSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Número de tarjeta*"
                    value={cardData.cardNumber}
                    onChange={handleCardInputChange}
                    pattern="\d{16}" // Solo 16 dígitos
                    title="El número de tarjeta debe tener 16 dígitos."
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="expirationDate"
                    placeholder="Fecha de expiración (MM/AA)*"
                    value={cardData.expirationDate}
                    onChange={handleCardInputChange}
                    pattern="(0[1-9]|1[0-2])\/\d{2}" // Formato MM/AA
                    title="La fecha de expiración debe tener el formato MM/AA."
                    required
                  />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV*"
                    value={cardData.cvv}
                    onChange={handleCardInputChange}
                    pattern="\d{3}" // Solo 3 dígitos
                    title="El CVV debe tener 3 dígitos."
                    required
                  />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-button">
                  Confirmar pago
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Columna derecha: Resumen del carrito */}
        <div className="payment-summary">
          <h2>En tu cesta</h2>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <p>
                    Cant.: {item.quantity || 1} a €{item.price.toFixed(2)}
                  </p>
                  <p>€{(item.price * (item.quantity || 1)).toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="summary-totals">
            <p>Subtotal: €{totalPrice.toFixed(2)}</p>
            <p>Gastos de envío estimados: €5.00</p>
            <p>
              <strong>Total: €{(totalPrice + 5).toFixed(2)}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;