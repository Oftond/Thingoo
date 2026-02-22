// src/pages/MyListings/MyListings.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { itemsAPI, mediaAPI } from '../../services/api';
import './MyListings.css';

const MyListings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [photoUrls, setPhotoUrls] = useState({});

  // Функция для загрузки фото для конкретного item
  const loadItemPhoto = useCallback(async (itemId) => {
    try {
      console.log(`Loading photos for item ${itemId}`);
      const photosRes = await mediaAPI.getItemPhotos(itemId);
      const photos = photosRes.data || [];
      
      if (photos.length > 0) {
        // Берем первое фото (или главное, если есть)
        const primaryPhoto = photos.find(p => p.is_primary) || photos[0];
        
        // Получаем URL фото через наш API метод
        const photoUrl = mediaAPI.getPhotoUrl(primaryPhoto.id);
        
        console.log(`Photo URL for item ${itemId}:`, photoUrl);
        
        // Сохраняем URL в состоянии
        setPhotoUrls(prev => ({
          ...prev,
          [itemId]: photoUrl
        }));
      } else {
        console.log(`No photos for item ${itemId}`);
      }
    } catch (photoErr) {
      console.warn(`Failed to load photos for item ${itemId}:`, photoErr);
    }
  }, []);

  useEffect(() => {
    const fetchMyListings = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching listings for user:', user.id);
        
        // Получаем объявления
        const response = await itemsAPI.getUserItems(user.id);
        const items = response.data || [];
        
        console.log('Received items:', items);
        
        setListings(items);
        
        // Загружаем фото для каждого объявления
        items.forEach(item => {
          loadItemPhoto(item.id);
        });
        
      } catch (err) {
        console.error('Failed to load my listings:', err);
        if (err.response) {
          console.error('Error response:', {
            status: err.response.status,
            data: err.response.data,
            headers: err.response.headers
          });
        }
        setError('Не удалось загрузить ваши объявления');
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [user?.id, loadItemPhoto]);

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

  const goToCreateListing = () => {
    navigate('/create-listing');
  };

  const goToListingDetail = (id) => {
    navigate(`/listing/${id}`);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      electronics: '📱',
      tools: '🔧',
      sports: '⚽',
      vehicles: '🚲',
      furniture: '🛋️',
      books: '📚',
      clothing: '👕',
      other: '✨',
    };
    return icons[category] || '📦';
  };

  const getCategoryName = (category) => {
    const names = {
      electronics: 'Электроника',
      tools: 'Инструменты',
      sports: 'Спорт',
      vehicles: 'Транспорт',
      furniture: 'Мебель',
      books: 'Книги',
      clothing: 'Одежда',
      other: 'Другое',
    };
    return names[category] || category || 'Без категории';
  };

  const handleImageError = (e, itemId) => {
    console.log(`Image load error for item ${itemId}, using placeholder`);
    e.target.onerror = null; // Предотвращаем бесконечный цикл
    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
    // Удаляем URL из состояния, чтобы больше не пытаться загрузить
    setPhotoUrls(prev => {
      const newState = { ...prev };
      delete newState[itemId];
      return newState;
    });
  };

  if (loading) {
    return (
      <div className="my-listings-page">
        <main className="main-content">
          <div className="container">
            <h1>Мои объявления</h1>
            <div className="loading-spinner">Загрузка...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="my-listings-page">
      <main className="main-content">
        <div className="container">
          <div className="page-header">
            <h1>Мои объявления</h1>
            <p>
              Здесь будут все вещи, которые вы сдаёте в аренду.
              Управляйте ценами, статусом и бронированиями в одном месте.
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}

          {listings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h2>У вас пока нет объявлений</h2>
              <p>
                Создайте первое объявление, чтобы начать зарабатывать
                на вещах, которые простаивают без дела.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={goToCreateListing}
              >
                Создать объявление
              </button>
            </div>
          ) : (
            <div className="listings-grid">
              {listings.map((item) => (
                <div
                  key={item.id}
                  className="listing-card"
                  onClick={() => goToListingDetail(item.id)}
                >
                  <div className="listing-image-wrapper">
                    {photoUrls[item.id] ? (
                      <img
                        src={photoUrls[item.id]}
                        alt={item.title}
                        className="listing-image"
                        onError={(e) => handleImageError(e, item.id)}
                        loading="lazy"
                      />
                    ) : (
                      <div className="listing-image-placeholder">
                        <span className="placeholder-icon">📷</span>
                        <span className="placeholder-text">Нет фото</span>
                      </div>
                    )}
                  </div>
                  <div className="listing-info">
                    <h3 className="listing-title">{item.title}</h3>
                    <p className="listing-price">{item.price_per_day} ₽/день</p>
                    <div className="listing-meta">
                      <span className="category-badge">
                        {getCategoryIcon(item.category)} {getCategoryName(item.category)}
                      </span>
                      <span className={`status-badge status-${item.status || 'active'}`}>
                        {item.status === 'active' ? 'Активно' : 'Неактивно'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {listings.length > 0 && (
            <div className="actions-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={goToCreateListing}
              >
                + Добавить новое объявление
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyListings;