// src/pages/ListingDetail/ListingDetailPage.jsx
import React, { useState, useEffect } from 'react';
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
  FaUser,
} from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { itemsAPI, mediaAPI, usersAPI } from '../../services/api';
import './ListingDetailPage.css';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [owner, setOwner] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photoUrls, setPhotoUrls] = useState({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => {
    const fetchListingData = async () => {
      try {
        setLoading(true);
        
        // Получаем данные объявления
        console.log('Fetching listing with ID:', id);
        const listingResponse = await itemsAPI.getById(id);
        const listingData = listingResponse.data;
        setListing(listingData);
        
        // Получаем данные владельца
        if (listingData.owner_id) {
          try {
            const ownerResponse = await usersAPI.getById(listingData.owner_id);
            setOwner(ownerResponse.data);
          } catch (ownerErr) {
            console.error('Failed to load owner data:', ownerErr);
            // Устанавливаем базовые данные владельца
            setOwner({
              name: 'Пользователь',
              rating: 5.0,
              reviews: 0,
              completedRentals: 0,
              memberSince: new Date().getFullYear(),
              responseRate: '100%',
              responseTime: 'обычно в течение часа',
            });
          }
        }
        
        // Получаем фото объявления
        try {
          const photosResponse = await mediaAPI.getItemPhotos(id);
          const photosData = photosResponse.data || [];
          setPhotos(photosData);
          
          // Загружаем URL для каждого фото
          const urls = {};
          photosData.forEach((photo, index) => {
            urls[photo.id] = mediaAPI.getPhotoUrl(photo.id);
          });
          setPhotoUrls(urls);
          
        } catch (photoErr) {
          console.error('Failed to load photos:', photoErr);
        }
        
      } catch (err) {
        console.error('Failed to load listing:', err);
        setError('Не удалось загрузить информацию об объявлении');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListingData();
    }
  }, [id]);

  // Очищаем URL-объекты при размонтировании
  useEffect(() => {
    return () => {
      Object.values(photoUrls).forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [photoUrls]);

  const getCategoryIcon = () => {
    if (!listing) return '';
    const category = categories.find((c) => c.id === listing.category);
    return category ? category.icon : '';
  };

  const getCategoryName = () => {
    if (!listing) return '';
    const category = categories.find((c) => c.id === listing.category);
    return category ? category.name : listing.category || 'Другое';
  };

  const handleContact = () => {
    if (owner?.phone) {
      alert(`Связаться с владельцем: ${owner.name} — ${owner.phone}`);
    } else {
      alert(`Связаться с владельцем: ${owner?.name || 'Пользователь'}`);
    }
  };

  const handlePayment = () => {
    navigate(`/payment/${id}`);
  };

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  const nextImage = () => {
    if (photos.length === 0) return;
    setActiveImageIndex((prev) =>
      prev === photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (photos.length === 0) return;
    setActiveImageIndex((prev) =>
      prev === 0 ? photos.length - 1 : prev - 1
    );
  };

  const handleImageError = (e, photoId) => {
    console.log(`Image load error for photo ${photoId}`);
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/900x600?text=Image+not+available';
  };

  if (loading) {
    return (
      <div className="listing-detail-page">
        <main className="main-content">
          <div className="container">
            <div className="loading-spinner">Загрузка...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="listing-detail-page">
        <main className="main-content">
          <div className="container">
            <div className="error-message">
              <h2>Ошибка</h2>
              <p>{error || 'Объявление не найдено'}</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate('/catalog')}
              >
                Вернуться в каталог
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
                  {photos.length > 0 && photoUrls[photos[activeImageIndex]?.id] ? (
                    <img
                      src={photoUrls[photos[activeImageIndex].id]}
                      alt={listing.title}
                      className="main-image"
                      onError={(e) => handleImageError(e, photos[activeImageIndex].id)}
                    />
                  ) : (
                    <div className="main-image-placeholder">
                      <span className="placeholder-icon">{getCategoryIcon()}</span>
                      <span className="placeholder-text">Нет фото</span>
                    </div>
                  )}

                  <div className="listing-badges">
                    {listing.has_insurance && (
                      <span className="badge badge-insurance">
                        <FaShieldAlt />
                        Страховка / залог
                      </span>
                    )}
                    {listing.has_fast_delivery && (
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

                {photos.length > 1 && (
                  <>
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
                      {photos.map((photo, index) => (
                        <button
                          key={photo.id}
                          type="button"
                          className={`thumbnail ${
                            activeImageIndex === index ? 'active' : ''
                          }`}
                          onClick={() => setActiveImageIndex(index)}
                        >
                          {photoUrls[photo.id] ? (
                            <img 
                              src={photoUrls[photo.id]} 
                              alt={`Миниатюра ${index + 1}`}
                              onError={(e) => handleImageError(e, photo.id)}
                            />
                          ) : (
                            <div className="thumbnail-placeholder">📷</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </section>

              <section className="listing-info">
                <div className="listing-header">
                  <div className="title-section">
                    <div className="category-badge">
                      <span className="category-icon-small">
                        {getCategoryIcon()}
                      </span>
                      <span>{getCategoryName()}</span>
                    </div>
                    <h1 className="listing-title">{listing.title}</h1>
                  </div>

                  <div className="price-section">
                    <div className="price-display">
                      <span className="price-amount">{listing.price_per_day} ₽</span>
                      <span className="price-period">в сутки</span>
                    </div>
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
                    <span className="meta-text">{listing.location || 'Не указано'}</span>
                  </div>
                  <div className="meta-item">
                    <FaStar className="meta-icon star" />
                    <span className="meta-text">
                      {listing.rating || 'Нет'} · {listing.reviews || 0} отзывов
                    </span>
                  </div>
                  <div className="meta-item">
                    <FaCalendarAlt className="meta-icon" />
                    <span className="meta-text">
                      Добавлено: {new Date(listing.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="listing-description">
                  <h2>Описание</h2>
                  <p>{listing.description || 'Описание отсутствует'}</p>
                </div>

                {listing.specifications && listing.specifications.length > 0 && (
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
                )}

                <div className="listing-conditions">
                  <h2>Условия аренды</h2>
                  <div className="conditions-grid">
                    <div className="condition-item">
                      <FaCalendarAlt className="condition-icon" />
                      <div>
                        <span className="condition-label">Минимальный срок</span>
                        <span className="condition-value">
                          {listing.min_rental_days || 1} {listing.min_rental_days === 1 ? 'день' : 'дня'}
                        </span>
                      </div>
                    </div>

                    <div className="condition-item">
                      <FaClock className="condition-icon" />
                      <div>
                        <span className="condition-label">Максимальный срок</span>
                        <span className="condition-value">
                          до {listing.max_rental_days || 30} дней
                        </span>
                      </div>
                    </div>

                    <div className="condition-item">
                      <FaShieldAlt className="condition-icon" />
                      <div>
                        <span className="condition-label">Залог</span>
                        <span className="condition-value">
                          {listing.deposit ? `${listing.deposit} ₽` : 'Не требуется'}
                        </span>
                      </div>
                    </div>

                    <div className="condition-item">
                      <FaCheckCircle className="condition-icon" />
                      <div>
                        <span className="condition-label">Документы</span>
                        <span className="condition-value">
                          {listing.required_docs || 'Паспорт'}
                        </span>
                      </div>
                    </div>

                    <div className="condition-item">
                      <FaMapMarkerAlt className="condition-icon" />
                      <div>
                        <span className="condition-label">Выдача</span>
                        <span className="condition-value">
                          {listing.pickup_method || 'Самовывоз'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <section className="owner-section">
                  <h2>Владелец</h2>
                  <div className="owner-card">
                    <div className="owner-avatar">
                      {owner?.avatar ? (
                        <img src={owner.avatar} alt={owner.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          <FaUser />
                        </div>
                      )}
                    </div>
                    <div className="owner-info">
                      <h3>{owner?.name || 'Пользователь'}</h3>
                      <div className="owner-stats">
                        <div className="stat-item">
                          <FaStar className="stat-icon" />
                          <span>
                            {owner?.rating || 5.0} · {owner?.reviews || 0} отзывов
                          </span>
                        </div>
                        <div className="stat-item">
                          <FaSyncAlt className="stat-icon" />
                          <span>{owner?.completedRentals || 0} аренд</span>
                        </div>
                        <div className="stat-item">
                          <FaCalendarAlt className="stat-icon" />
                          <span>с {owner?.memberSince || '2024'} года</span>
                        </div>
                      </div>
                      <div className="response-rate">
                        {owner?.responseRate || '100%'} ответов, {owner?.responseTime || 'обычно в течение часа'}
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
                  <span className="price-value">{listing.price_per_day} ₽</span>
                </div>

                <div className="price-details">
                  <div className="price-row">
                    <span>1 день</span>
                    <span>{listing.price_per_day} ₽</span>
                  </div>
                  <div className="price-row">
                    <span>7 дней</span>
                    <span>{Math.round(listing.price_per_day * 7 * 0.9)} ₽</span>
                  </div>
                  <div className="price-row">
                    <span>30 дней</span>
                    <span>{Math.round(listing.price_per_day * 30 * 0.8)} ₽</span>
                  </div>
                </div>

                <div className="deposit-info">
                  <span className="deposit-label">Залог</span>
                  <span className="deposit-amount">
                    {listing.deposit ? `${listing.deposit} ₽` : 'Не требуется'}
                  </span>
                </div>
                
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={handlePayment}
                >
                  Оплатить
                </button>

                <button
                  type="button"
                  className="btn btn-outline btn-block"
                  onClick={handleContact}
                >
                  <FaPhone />
                  Связаться
                </button>

                <button 
                  className="btn btn-outline btn-block back-button" 
                  onClick={() => navigate(-1)}
                >
                  ← Назад
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