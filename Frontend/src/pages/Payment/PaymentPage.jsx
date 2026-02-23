// src/pages/Payment/PaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { paymentsAPI, itemsAPI, usersAPI } from '../../services/api';
import notificationService from '../../services/notificationService';
import './PaymentPage.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [item, setItem] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  // Загружаем информацию о товаре
  useEffect(() => {
    const fetchItemData = async () => {
      try {
        setLoading(true);
        
        // Получаем информацию о товаре
        const itemResponse = await itemsAPI.getById(id);
        const itemData = itemResponse.data;
        setItem(itemData);
        
        // Получаем информацию о владельце
        if (itemData && itemData.owner_id) {
          const ownerResponse = await usersAPI.getById(itemData.owner_id);
          setOwner(ownerResponse.data);
        }
        
      } catch (error) {
        console.error('Failed to load item:', error);
        setError('Не удалось загрузить информацию о товаре');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItemData();
    }
  }, [id]);

  const calculateTotal = () => {
    if (!item || !item.price_per_day) return 0;
    const rentalDays = 3; // В реальном приложении берется из формы
    const insurance = 500; // В реальном приложении из формы
    const delivery = 300; // В реальном приложении из формы
    return (item.price_per_day * rentalDays) + insurance + delivery;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!agreed) {
      setError('Пожалуйста, согласитесь с условиями оплаты');
      return;
    }

    if (!user) {
      setError('Необходимо войти в систему');
      return;
    }

    if (!item || !owner) {
      setError('Информация о товаре не загружена');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // Создаем платеж на бэкенде
      const paymentResponse = await paymentsAPI.create({
        item_id: id,
        renter_id: user.id,
        amount: calculateTotal(),
        method: paymentMethod,
        rental_days: 3, // В реальном приложении из формы
        insurance: 500, // В реальном приложении из формы
        delivery: 300 // В реальном приложении из формы
      });

      console.log('Payment created:', paymentResponse.data);

      // Отправляем email арендатору о создании платежа
      if (user && user.email) {
        await notificationService.sendPaymentSuccessNotification(
          user,
          calculateTotal(),
          item
        ).catch(err => console.warn('Payment email failed:', err));
      }

      // Отправляем email владельцу о новом запросе аренды
      if (owner && owner.email) {
        await notificationService.sendNewRentalNotification(
          owner,
          user,
          item
        ).catch(err => console.warn('Owner notification failed:', err));
      }

      // Переходим на страницу успеха
      navigate('/payment/success', { 
        state: { 
          amount: calculateTotal(),
          itemName: item.title || 'товар',
          paymentId: paymentResponse.data.id
        } 
      });

    } catch (error) {
      console.error('Payment failed:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        // Проверяем, не является ли ошибка объектом
        const errorMsg = error.response.data?.detail;
        setError(typeof errorMsg === 'string' ? errorMsg : 'Ошибка при обработке платежа');
      } else {
        setError('Ошибка при обработке платежа. Попробуйте снова.');
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="payment-page">
        <div className="container">
          <div className="payment-not-authorized">
            <h2>Необходима авторизация</h2>
            <p>Пожалуйста, войдите в систему для оплаты</p>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Войти
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="payment-page">
        <div className="container">
          <div className="payment-not-authorized">
            <h2>Товар не найден</h2>
            <p>Запрошенный товар не существует или был удален</p>
            <button className="btn btn-primary" onClick={() => navigate('/catalog')}>
              В каталог
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

        {error && <div className="payment-error">{error}</div>}

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
              <div className="payment-form">
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
              </div>
            )}

            {paymentMethod === 'sbp' && (
              <div className="payment-sbp">
                <p>Оплата через Систему Быстрых Платежей</p>
                <div className="sbp-qr">
                  <div className="qr-placeholder">
                    <span className="qr-icon">📱</span>
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
                <h3>{item?.title || 'Товар'}</h3>
                <p className="item-owner">Владелец: {owner?.full_name || 'Неизвестно'}</p>
              </div>
            </div>

            <div className="order-details">
              <div className="detail-row">
                <span>Аренда (3 дней)</span>
                <span>{item?.price_per_day ? item.price_per_day * 3 : 0} ₽</span>
              </div>
              
              <div className="detail-row">
                <span>Страховка</span>
                <span>500 ₽</span>
              </div>
              
              <div className="detail-row">
                <span>Доставка</span>
                <span>300 ₽</span>
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