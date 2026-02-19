// src/pages/ListingDetail/ListingDetailPage.jsx
import React, { useState } from 'react';
import {
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaStar,
  FaClock,
  FaCalendarAlt,
  FaShieldAlt,
  FaTruck,
  FaSyncAlt,
} from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import './ListingDetailPage.css';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const categories = [
    { id: 'electronics', name: 'Электроника', icon: '💻' },
    { id: 'tools', name: 'Инструменты', icon: '🛠️' },
    { id: 'sports', name: 'Спорт и активный отдых', icon: '🏀' },
    { id: 'clothing', name: 'Одежда и костюмы', icon: '👕' },
    { id: 'books', name: 'Книги и обучение', icon: '📚' },
    { id: 'furniture', name: 'Мебель и интерьер', icon: '🛋️' },
    { id: 'vehicles', name: 'Транспорт и самокаты', icon: '🛴' },
    { id: 'music', name: 'Музыка и звук', icon: '🎸' },
  ];

  const listing = {
    id: Number(id) || 1,
    title: 'Sony Alpha 7 III + объектив 28–70 мм',
    price: 1200,
    location: 'Новосибирск, центр',
    rating: 4.8,
    reviews: 24,
    category: 'electronics',
    isNew: true,
    hasInsurance: true,
    hasFastDelivery: true,
    description:
      'Полнокадровая камера Sony A7 III в отличном состоянии. В комплект входит объектив 28–70 мм, два аккумулятора, зарядное устройство и сумка. Идеально подойдёт для съёмки путешествий, портретов и мероприятий.',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1516031190212-da133013de50?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1473654729523-203e25dfda10?auto=format&fit=crop&w=900&q=80',
    ],
    specifications: [
      { label: 'Тип камеры', value: 'Беззеркальная, full-frame' },
      { label: 'Разрешение', value: '24.2 Мп' },
      { label: 'Видео', value: '4K 30fps' },
      { label: 'Стабилизация', value: '5-осевая' },
      { label: 'Батарея', value: 'До 700 снимков' },
      { label: 'Вес', value: '650 г' },
    ],
    availability: {
      minRentalDays: 2,
      maxRentalDays: 30,
      availableFrom: 'С сегодняшнего дня',
    },
    conditions: {
      deposit: '15 000 ₽',
      idRequired: 'Паспорт РФ',
      signingRequired: 'Простое расписка / договор аренды',
      pickup: 'Самовывоз или встреча у метро',
    },
    owner: {
      name: 'Алексей',
      avatar:
        'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80',
      rating: 4.9,
      reviews: 58,
      completedRentals: 120,
      responseTime: 'обычно в течение 15 минут',
      memberSince: 'с 2022 года',
      responseRate: 'Ответов на сообщения: 98%',
    },
  };

  const getCategoryIcon = () => {
    const category = categories.find((c) => c.id === listing.category);
    return category ? category.icon : '';
  };

  const handleContact = () => {
    alert(`Связаться с владельцем: ${listing.owner.name} — +7 999 123-45-67`);
  };

  const handlePayment = () => {
    navigate(`/payment/${id}`);
  };

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  const nextImage = () => {
    setActiveImageIndex((prev) =>
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="listing-detail-page">
      <main className="main-content">
        <div className="container">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ← Назад к каталогу
          </button>

          <div className="detail-main">
            <div className="listing-detail-left">
              <section className="image-gallery">
                <div className="main-image-container">
                  <img
                    src={listing.images[activeImageIndex]}
                    alt={listing.title}
                    className="main-image"
                  />

                  <div className="listing-badges">
                    {listing.hasInsurance && (
                      <span className="badge badge-insurance">
                        <FaShieldAlt />
                        Страховка / залог
                      </span>
                    )}
                    {listing.hasFastDelivery && (
                      <span className="badge badge-delivery">
                        <FaTruck />
                        Быстрая доставка
                      </span>
                    )}
                    {listing.isNew && (
                      <span className="badge badge-new">
                        <FaSyncAlt />
                        Новинка
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                    onClick={toggleFavorite}
                  >
                    {isFavorite ? '♥' : '♡'}
                  </button>
                </div>

                <div className="image-pagination">
                  <button
                    type="button"
                    className="image-pagination-btn"
                    onClick={prevImage}
                  >
                    ◀ Предыдущее
                  </button>
                  <button
                    type="button"
                    className="image-pagination-btn"
                    onClick={nextImage}
                  >
                    Следующее ▶
                  </button>
                </div>

                <div className="thumbnail-gallery">
                  {listing.images.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`thumbnail ${
                        activeImageIndex === index ? 'active' : ''
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img src={image} alt={`Миниатюра ${index + 1}`} />
                    </button>
                  ))}
                </div>
              </section>

              <section className="listing-info">
                <div className="listing-header">
                  <div className="title-section">
                    <div className="category-badge">
                      <span className="category-icon-small">
                        {getCategoryIcon()}
                      </span>
                      <span>
                        {categories.find((c) => c.id === listing.category)?.name}
                      </span>
                    </div>
                    <h1 className="listing-title">{listing.title}</h1>
                  </div>

                  <div className="price-section">
                    <div className="price-display">
                      <span className="price-amount">{listing.price} ₽</span>
                      <span className="price-period">в сутки</span>
                    </div>
                    {/* Кнопка оплаты вместо бронирования */}
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handlePayment}
                    >
                      Оплатить
                    </button>
                  </div>
                </div>

                <div className="listing-meta">
                  <div className="meta-item">
                    <FaMapMarkerAlt className="meta-icon" />
                    <span className="meta-text">{listing.location}</span>
                  </div>
                  <div className="meta-item">
                    <FaStar className="meta-icon star" />
                    <span className="meta-text">
                      {listing.rating} · {listing.reviews} отзывов
                    </span>
                  </div>
                  <div className="meta-item">
                    <FaCalendarAlt className="meta-icon" />
                    <span className="meta-text">
                      Доступно: {listing.availability.availableFrom}
                    </span>
                  </div>
                </div>

                <div className="listing-description">
                  <h2>Описание</h2>
                  <p>{listing.description}</p>
                </div>

                <div className="listing-specifications">
                  <h2>Характеристики</h2>
                  <div className="specs-grid">
                    {listing.specifications.map((spec, index) => (
                      <div key={index} className="spec-item">
                        <span className="spec-label">{spec.label}</span>
                        <span className="spec-value">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="listing-conditions">
                  <h2>Условия аренды</h2>
                  <div className="conditions-grid">
                    <div className="condition-item">
                      <FaCalendarAlt className="condition-icon" />
                      <div>
                        <span className="condition-label">Минимальный срок</span>
                        <span className="condition-value">
                          {listing.availability.minRentalDays} дня
                        </span>
                      </div>
                    </div>

                    <div className="condition-item">
                      <FaClock className="condition-icon" />
                      <div>
                        <span className="condition-label">Максимальный срок</span>
                        <span className="condition-value">
                          до {listing.availability.maxRentalDays} дней
                        </span>
                      </div>
                    </div>

                    <div className="condition-item">
                      <FaShieldAlt className="condition-icon" />
                      <div>
                        <span className="condition-label">Залог</span>
                        <span className="condition-value">
                          {listing.conditions.deposit}
                        </span>
                      </div>
                    </div>

                    <div className="condition-item">
                      <FaCheckCircle className="condition-icon" />
                      <div>
                        <span className="condition-label">Документы</span>
                        <span className="condition-value">
                          {listing.conditions.idRequired}
                        </span>
                      </div>
                    </div>

                    <div className="condition-item">
                      <FaMapMarkerAlt className="condition-icon" />
                      <div>
                        <span className="condition-label">Выдача</span>
                        <span className="condition-value">
                          {listing.conditions.pickup}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <section className="owner-section">
                  <h2>Владелец</h2>
                  <div className="owner-card">
                    <div className="owner-avatar">
                      <img src={listing.owner.avatar} alt={listing.owner.name} />
                    </div>
                    <div className="owner-info">
                      <h3>{listing.owner.name}</h3>
                      <div className="owner-stats">
                        <div className="stat-item">
                          <FaStar className="stat-icon" />
                          <span>
                            {listing.owner.rating} · {listing.owner.reviews} отзывов
                          </span>
                        </div>
                        <div className="stat-item">
                          <FaSyncAlt className="stat-icon" />
                          <span>{listing.owner.completedRentals} аренд</span>
                        </div>
                        <div className="stat-item">
                          <FaCalendarAlt className="stat-icon" />
                          <span>{listing.owner.memberSince}</span>
                        </div>
                      </div>
                      <div className="response-rate">
                        {listing.owner.responseRate}, {listing.owner.responseTime}
                      </div>
                    </div>
                    <div className="owner-actions">
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={handleContact}
                      >
                        <FaPhone />
                        Связаться
                      </button>
                    </div>
                  </div>
                </section>
              </section>
            </div>

            <aside className="detail-sidebar">
              <div className="price-card">
                <div className="price-header">
                  <span className="price-label">Стоимость аренды</span>
                  <span className="price-value">{listing.price} ₽</span>
                </div>

                <div className="price-details">
                  <div className="price-row">
                    <span>1 день</span>
                    <span>{listing.price} ₽</span>
                  </div>
                  <div className="price-row">
                    <span>7 дней</span>
                    <span>{Math.round(listing.price * 7 * 0.9)} ₽</span>
                  </div>
                  <div className="price-row">
                    <span>30 дней</span>
                    <span>{Math.round(listing.price * 30 * 0.8)} ₽</span>
                  </div>
                </div>

                <div className="deposit-info">
                  <span className="deposit-label">Залог</span>
                  <span className="deposit-amount">{listing.conditions.deposit}</span>
                </div>

                {/* Кнопка оплаты в сайдбаре */}
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={handlePayment}
                >
                  Оплатить
                </button>
              </div>

              <div className="info-card">
                <h3>Гарантии и безопасность</h3>
                <ul className="guarantees-list">
                  <li>
                    <FaCheckCircle className="check-icon" />
                    Безопасные платежи и защита данных
                  </li>
                  <li>
                    <FaCheckCircle className="check-icon" />
                    Возможность оформления залога
                  </li>
                  <li>
                    <FaCheckCircle className="check-icon" />
                    Поддержка сервиса 24/7
                  </li>
                </ul>
              </div>

              <div className="info-card">
                <h3>Доставка и получение</h3>
                <div className="delivery-info">
                  <div className="delivery-item">
                    <span>Самовывоз</span>
                    <span className="delivery-price">Бесплатно</span>
                  </div>
                  <div className="delivery-item">
                    <span>Встреча у метро</span>
                    <span className="delivery-price">от 300 ₽</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingDetailPage;