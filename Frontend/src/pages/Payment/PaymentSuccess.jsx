// src/pages/Payment/PaymentSuccess.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentPage.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  
  const amount = typeof state.amount === 'number' ? state.amount : 0;
  const itemName = typeof state.itemName === 'string' ? state.itemName : 'товар';
  const paymentId = state.paymentId || null;

  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-success">
          <div className="success-icon-large">✓</div>
          <h1>Оплата прошла успешно!</h1>
          <p className="success-message">
            Спасибо за оплату. Ваш платеж на сумму <strong>{amount} ₽</strong> за 
            аренду <strong>{itemName}</strong> успешно обработан.
          </p>
          
          <div className="success-details">
            <h3>Что дальше?</h3>
            <ul>
              <li>📧 Чек отправлен на вашу электронную почту</li>
              <li>📱 Владелец получил уведомление о бронировании</li>
              <li>📅 Детали аренды доступны в личном кабинете</li>
            </ul>
          </div>

          <div className="success-actions">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/my-listings')}
            >
              Мои аренды
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/')}
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;