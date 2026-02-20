// src/pages/Payment/PaymentPage.jsx - ОБНОВЛЕННЫЙ
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './PaymentPage.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Данные для демонстрации (в реальности загружаются с бекенда)
  const paymentDetails = {
    itemName: 'Sony Alpha 7 III',
    ownerName: 'Алексей',
    rentalDays: 3,
    pricePerDay: 1200,
    insurance: 500,
    delivery: 300,
    totalAmount: 1200 * 3 + 500 + 300,
  };

  const calculateTotal = () => {
    return paymentDetails.totalAmount;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!agreed) {
      alert('Пожалуйста, согласитесь с условиями оплаты');
      return;
    }

    setProcessing(true);

    // Имитация обработки платежа
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/payment/success', { 
          state: { 
            amount: calculateTotal(),
            itemName: paymentDetails.itemName 
          } 
        });
      }, 2000);
    }, 2000);
  };

  if (!user) {
    return (
      <div className="payment-page">
        <div className="container">
          <div className="payment-not-authorized">
            <h2>Необходима авторизация</h2>
            <p>Пожалуйста, войдите в систему для оплаты</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              На главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="payment-page">
        <div className="container">
          <div className="payment-success">
            <div className="success-icon">✓</div>
            <h2>Оплата прошла успешно!</h2>
            <p>Спасибо за оплату. Мы обрабатываем ваш заказ.</p>
            <div className="payment-details">
              <p>Сумма: {calculateTotal()} ₽</p>
              <p>Товар: {paymentDetails.itemName}</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/my-listings')}>
              Перейти к моим арендам
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-header">
          <h1 className="payment-title">Оплата аренды</h1>
          <p className="payment-subtitle">Заполните данные для оплаты</p>
        </div>

        <div className="payment-grid">
          {/* Левая колонка - форма оплаты */}
          <div className="payment-form-card">
            <h2>Способ оплаты</h2>
            
            <div className="payment-methods">
              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="method-icon">💳</span>
                <span className="method-name">Банковская карта</span>
              </label>

              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="sbp"
                  checked={paymentMethod === 'sbp'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="method-icon">🏦</span>
                <span className="method-name">СБП</span>
              </label>
            </div>

            {paymentMethod === 'card' && (
              <form onSubmit={handlePayment} className="payment-form">
                <div className="form-group">
                  <label>Номер карты</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className="payment-input"
                    defaultValue="4111 1111 1111 1111"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Срок действия</label>
                    <input
                      type="text"
                      placeholder="MM/ГГ"
                      maxLength="5"
                      className="payment-input"
                      defaultValue="12/25"
                    />
                  </div>

                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength="3"
                      className="payment-input"
                      defaultValue="123"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Владелец карты</label>
                  <input
                    type="text"
                    placeholder="IVAN PETROV"
                    className="payment-input"
                    defaultValue="IVAN PETROV"
                  />
                </div>
              </form>
            )}

            {paymentMethod === 'sbp' && (
              <div className="payment-sbp">
                <p>Оплата через Систему Быстрых Платежей</p>
                <div className="sbp-qr">
                  <div className="qr-placeholder">
                    <span>📱</span>
                    <p>QR-код для оплаты</p>
                    <small>(в демо-режиме)</small>
                  </div>
                </div>
              </div>
            )}

            <div className="payment-agreement">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">
                  Я согласен с условиями оплаты и правилами сервиса
                </span>
              </label>
            </div>

            <button
              className="payment-submit-btn"
              onClick={handlePayment}
              disabled={processing || !agreed}
            >
              {processing ? 'Обработка платежа...' : `Оплатить ${calculateTotal()} ₽`}
            </button>

            <p className="payment-secure">
              🔒 Платеж защищен. Данные не передаются третьим лицам.
            </p>
          </div>

          {/* Правая колонка - детали заказа */}
          <div className="payment-summary-card">
            <h2>Детали заказа</h2>
            
            <div className="order-item">
              <div className="item-info">
                <h3>{paymentDetails.itemName}</h3>
                <p className="item-owner">Владелец: {paymentDetails.ownerName}</p>
              </div>
            </div>

            <div className="order-details">
              <div className="detail-row">
                <span>Аренда ({paymentDetails.rentalDays} дней)</span>
                <span>{paymentDetails.pricePerDay * paymentDetails.rentalDays} ₽</span>
              </div>
              
              <div className="detail-row">
                <span>Страховка</span>
                <span>{paymentDetails.insurance} ₽</span>
              </div>
              
              <div className="detail-row">
                <span>Доставка</span>
                <span>{paymentDetails.delivery} ₽</span>
              </div>
            </div>

            <div className="order-total">
              <span>Итого к оплате:</span>
              <span className="total-amount">{calculateTotal()} ₽</span>
            </div>

            <div className="order-info">
              <h4>Важно:</h4>
              <ul>
                <li>✓ Залог возвращается после окончания аренды</li>
                <li>✓ Страховка покрывает случайные повреждения</li>
                <li>✓ Отмена возможна за 24 часа до начала</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;