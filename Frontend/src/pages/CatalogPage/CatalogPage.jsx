// src/pages/CatalogPage/CatalogPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { itemsAPI, mediaAPI } from '../../services/api';
import './CatalogPage.css';

const CatalogPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [photoUrls, setPhotoUrls] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'Все категории', icon: '📦' },
    { id: 'electronics', name: 'Электроника', icon: '📱' },
    { id: 'tools', name: 'Инструменты', icon: '🔧' },
    { id: 'sports', name: 'Спорт и отдых', icon: '⚽' },
    { id: 'clothing', name: 'Одежда', icon: '👕' },
    { id: 'books', name: 'Книги', icon: '📚' },
    { id: 'furniture', name: 'Мебель', icon: '🛋️' },
    { id: 'vehicles', name: 'Транспорт', icon: '🚲' },
    { id: 'photography', name: 'Фототехника', icon: '📷' },
    { id: 'music', name: 'Музыка', icon: '🎵' },
    { id: 'party', name: 'Для праздника', icon: '🎉' },
    { id: 'camping', name: 'Кемпинг', icon: '⛺' },
  ];
  
  const ratingFilters = [
    { id: 'all', name: 'Любой рейтинг', min: 0 },
    { id: '4.5', name: '4.5+ Отлично', min: 4.5 },
    { id: '4.0', name: '4.0+ Хорошо', min: 4.0 },
    { id: '3.5', name: '3.5+ Удовлетворительно', min: 3.5 },
    { id: '3.0', name: '3.0+ и выше', min: 3.0 },
  ];
  
  const sortOptions = [
    { id: 'popular', name: 'Популярные' },
    { id: 'rating', name: 'По рейтингу' },
    { id: 'price-low', name: 'Цена: низкая → высокая' },
    { id: 'price-high', name: 'Цена: высокая → низкая' },
    { id: 'distance', name: 'Ближе всего' },
    { id: 'newest', name: 'Сначала новые' },
  ];
  
  const popularCategories = [
    { id: 'electronics', name: 'Электроника', icon: '📱', count: 156, color: '#FF6B6B' },
    { id: 'tools', name: 'Инструменты', icon: '🔧', count: 89, color: '#4ECDC4' },
    { id: 'sports', name: 'Спорт и отдых', icon: '⚽', count: 124, color: '#FFD166' },
    { id: 'photography', name: 'Фототехника', icon: '📷', count: 67, color: '#06D6A0' },
    { id: 'party', name: 'Для праздника', icon: '🎉', count: 45, color: '#118AB2' },
    { id: 'camping', name: 'Кемпинг', icon: '⛺', count: 78, color: '#EF476F' },
  ];

  // Функция для загрузки фото для конкретного item
  const loadItemPhoto = useCallback(async (itemId) => {
    try {
      console.log(`Loading photos for item ${itemId}`);
      const photosRes = await mediaAPI.getItemPhotos(itemId);
      const photos = photosRes.data || [];
      
      if (photos.length > 0) {
        // Берем первое фото (или главное, если есть)
        const primaryPhoto = photos.find(p => p.is_primary) || photos[0];
        
        // Получаем URL фото через API метод
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
    const fetchListings = async () => {
      try {
        setLoading(true);
        const params = {};
        if (user?.id) {
          params.exclude_owner_id = user.id;
        }
        const response = await itemsAPI.getAll(params);
        const items = response.data || [];
        setListings(items);
        
        // Загружаем фото для каждого объявления
        items.forEach(item => {
          loadItemPhoto(item.id);
        });
        
      } catch (err) {
        console.error('Failed to load listings:', err);
        setError('Не удалось загрузить объявления');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
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
  
  const getCurrentCategory = () => {
    return categories.find(c => c.id === selectedCategory) || categories[0];
  };
  
  const getCurrentRating = () => {
    return ratingFilters.find(r => r.id === selectedRating) || ratingFilters[0];
  };
  
  const getCurrentSort = () => {
    return sortOptions.find(s => s.id === selectedSort) || sortOptions[0];
  };
  
  const filteredAndSortedListings = listings
    .filter(listing => {
      const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
      const ratingFilter = getCurrentRating();
      const matchesRating = ratingFilter.id === 'all' || (listing.rating || 0) >= ratingFilter.min;
      const matchesPrice = listing.price_per_day >= priceRange[0] && listing.price_per_day <= priceRange[1];
      const matchesSearch = searchQuery === '' || 
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        categories.find(c => c.id === listing.category)?.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesRating && matchesPrice && matchesSearch;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'price-low':
          return a.price_per_day - b.price_per_day;
        case 'price-high':
          return b.price_per_day - a.price_per_day;
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return ((b.rating || 0) * (b.reviews || 0)) - ((a.rating || 0) * (a.reviews || 0));
      }
    });

  const closeAllDropdowns = () => {
    setShowCategoryDropdown(false);
    setShowRatingDropdown(false);
    setShowSortDropdown(false);
  };
  
  const handlePriceRangeChange = (e) => {
    const value = parseInt(e.target.value);
    if (e.target.id === 'price-min') {
      setPriceRange([Math.min(value, priceRange[1]), priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], Math.max(value, priceRange[0])]);
    }
  };
  
  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedRating('all');
    setSelectedSort('popular');
    setPriceRange([0, 5000]);
    setSearchQuery('');
  };

  const goToListingDetail = (id) => {
    navigate(`/listing/${id}`);
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

  const getCategoryName = (categoryId) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId || 'Без категории';
  };

  const getCategoryIcon = (categoryId) => {
    return categories.find(c => c.id === categoryId)?.icon || '📦';
  };
  
  return (
    <div className="catalog-page" onClick={closeAllDropdowns}>
      <div className="container">
        <div className="catalog-header">
          <div className="catalog-title-section">
            <h1>Доступно для аренды</h1>
            <div className="catalog-stats">
              <span className="stat-item">
                <strong>{filteredAndSortedListings.length}</strong> предложений
              </span>
              <span className="stat-item">
                <strong>{new Set(filteredAndSortedListings.map(l => l.category)).size}</strong> категорий
              </span>
              <span className="stat-item">
                Средний рейтинг: <strong>
                  {(filteredAndSortedListings.reduce((acc, item) => acc + (item.rating || 0), 0) / 
                    (filteredAndSortedListings.length || 1)).toFixed(1)}
                </strong>
              </span>
            </div>
          </div>
          
          <div className="sort-dropdown-container" onClick={(e) => e.stopPropagation()}>
            <button 
              className="sort-dropdown-toggle"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <span className="sort-icon">↕️</span>
              <span className="sort-text">{getCurrentSort().name}</span>
              <span className="dropdown-arrow">{showSortDropdown ? '▲' : '▼'}</span>
            </button>
            
            {showSortDropdown && (
              <div className="sort-dropdown-menu">
                {sortOptions.map(option => (
                  <div
                    key={option.id}
                    className={`sort-dropdown-item ${selectedSort === option.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedSort(option.id);
                      setShowSortDropdown(false);
                    }}
                  >
                    {option.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="catalog-main">
          <aside className="filters-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="filters-header">
              <h3>Фильтры</h3>
              <button className="reset-filters" onClick={resetFilters}>
                Сбросить все
              </button>
            </div>
            
            <div className="filter-section">
              <h4 className="filter-title">Категория</h4>
              <div className="dropdown-filter">
                <button 
                  className="dropdown-filter-toggle"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  <span className="filter-icon">{getCurrentCategory().icon}</span>
                  <span className="filter-text">{getCurrentCategory().name}</span>
                  <span className="dropdown-arrow">{showCategoryDropdown ? '▲' : '▼'}</span>
                </button>
                
                {showCategoryDropdown && (
                  <div className="dropdown-filter-menu">
                    {categories.map(category => (
                      <div
                        key={category.id}
                        className={`dropdown-filter-item ${selectedCategory === category.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setShowCategoryDropdown(false);
                        }}
                      >
                        <span className="item-icon">{category.icon}</span>
                        <span className="item-text">{category.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="filter-section">
              <h4 className="filter-title">Рейтинг</h4>
              <div className="dropdown-filter">
                <button 
                  className="dropdown-filter-toggle"
                  onClick={() => setShowRatingDropdown(!showRatingDropdown)}
                >
                  <span className="filter-icon">⭐</span>
                  <span className="filter-text">{getCurrentRating().name}</span>
                  <span className="dropdown-arrow">{showRatingDropdown ? '▲' : '▼'}</span>
                </button>
                
                {showRatingDropdown && (
                  <div className="dropdown-filter-menu">
                    {ratingFilters.map(filter => (
                      <div
                        key={filter.id}
                        className={`dropdown-filter-item ${selectedRating === filter.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedRating(filter.id);
                          setShowRatingDropdown(false);
                        }}
                      >
                        <span className="item-icon">⭐</span>
                        <span className="item-text">{filter.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="filter-section">
              <h4 className="filter-title">Цена, ₽/день</h4>
              <div className="price-range">
                <div className="price-inputs">
                  <div className="price-input-group">
                    <label htmlFor="price-min">От</label>
                    <input
                      type="number"
                      id="price-min"
                      value={priceRange[0]}
                      onChange={handlePriceRangeChange}
                      min="0"
                      max="5000"
                    />
                  </div>
                  <div className="price-input-group">
                    <label htmlFor="price-max">До</label>
                    <input
                      type="number"
                      id="price-max"
                      value={priceRange[1]}
                      onChange={handlePriceRangeChange}
                      min="0"
                      max="5000"
                    />
                  </div>
                </div>
                <div className="price-slider">
                  <div className="slider-track"></div>
                  <div 
                    className="slider-range" 
                    style={{
                      left: `${(priceRange[0] / 5000) * 100}%`,
                      width: `${((priceRange[1] - priceRange[0]) / 5000) * 100}%`
                    }}
                  ></div>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[0]}
                    onChange={handlePriceRangeChange}
                    className="slider-thumb"
                    id="price-min"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[1]}
                    onChange={handlePriceRangeChange}
                    className="slider-thumb"
                    id="price-max"
                  />
                </div>
                <div className="price-labels">
                  <span>0</span>
                  <span>2500</span>
                  <span>5000</span>
                </div>
              </div>
            </div>
            
            <div className="filter-section">
              <h4 className="filter-title">Дополнительно</h4>
              <div className="checkbox-filters">
                <label className="checkbox-filter">
                  <input type="checkbox" />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">💎 Со страховкой</span>
                </label>
                <label className="checkbox-filter">
                  <input type="checkbox" />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">🚚 С быстрой доставкой</span>
                </label>
                <label className="checkbox-filter">
                  <input type="checkbox" />
                  <span className="checkbox-custom"></span>
                  <span className="checkbox-text">🆕 Новые предложения</span>
                </label>
              </div>
            </div>
            
            <div className="active-filters">
              <h4 className="filter-title">Активные фильтры</h4>
              <div className="active-filters-list">
                {selectedCategory !== 'all' && (
                  <span className="active-filter-tag">
                    {getCurrentCategory().name}
                    <button onClick={() => setSelectedCategory('all')}>×</button>
                  </span>
                )}
                {selectedRating !== 'all' && (
                  <span className="active-filter-tag">
                    {getCurrentRating().name}
                    <button onClick={() => setSelectedRating('all')}>×</button>
                  </span>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                  <span className="active-filter-tag">
                    {priceRange[0]} - {priceRange[1]} ₽
                    <button onClick={() => setPriceRange([0, 5000])}>×</button>
                  </span>
                )}
                {searchQuery && (
                  <span className="active-filter-tag">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}>×</button>
                  </span>
                )}
              </div>
            </div>
          </aside>
          
          <div className="listings-container">
            <div className="listings-header">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Поиск по названию..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="listings-count">
                Найдено: <strong>{filteredAndSortedListings.length}</strong>
              </div>
            </div>

            <div className="listings-grid">
              {loading ? (
                <div className="loading">Загрузка...</div>
              ) : error ? (
                <div className="error">{error}</div>
              ) : filteredAndSortedListings.length > 0 ? (
                filteredAndSortedListings.map(listing => (
                  <div 
                    key={listing.id} 
                    className="listing-card" 
                    onClick={() => goToListingDetail(listing.id)}
                  >
                    <div className="listing-image">
                      {photoUrls[listing.id] ? (
                        <img 
                          src={photoUrls[listing.id]} 
                          alt={listing.title}
                          onError={(e) => handleImageError(e, listing.id)}
                          loading="lazy"
                        />
                      ) : (
                        <div className="listing-image-placeholder">
                          <span className="placeholder-icon">{getCategoryIcon(listing.category)}</span>
                          <span className="placeholder-text">Нет фото</span>
                        </div>
                      )}
                      
                      <div className="listing-badges">
                        {listing.has_insurance && (
                          <span className="badge badge-insurance">💎 Страхование</span>
                        )}
                        {listing.has_fast_delivery && (
                          <span className="badge badge-delivery">🚚 Быстрая доставка</span>
                        )}
                        {listing.isNew && (
                          <span className="badge badge-new">🆕 Новое</span>
                        )}
                      </div>
                      <button 
                        className="favorite-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Добавить в избранное
                        }}
                      >
                        ♥
                      </button>
                    </div>
                    
                    <div className="listing-content">
                      <div className="listing-header">
                        <h3 className="listing-title">{listing.title}</h3>
                        <div className="listing-price">{listing.price_per_day} ₽/день</div>
                      </div>
                      
                      <div className="listing-category">
                        <span className="category-icon-small">
                          {getCategoryIcon(listing.category)}
                        </span>
                        <span>{getCategoryName(listing.category)}</span>
                      </div>
                      
                      <div className="listing-info">
                        <div className="info-item rating-item">
                          <span className="info-icon">⭐</span>
                          <span className="info-text">{listing.rating || 'Нет'}</span>
                          {listing.reviews > 0 && (
                            <span className="info-reviews">({listing.reviews})</span>
                          )}
                        </div>
                        <div className="info-item">
                          <span className="info-icon">📍</span>
                          <span className="info-text">{listing.location || 'Не указано'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-icon">👤</span>
                          <span className="info-text">{listing.userRating || '5.0'}</span>
                        </div>
                      </div>
                      
                      <button 
                        className="btn btn-rent"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/rent/${listing.id}`);
                        }}
                      >
                        Арендовать
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>Ничего не найдено</h3>
                  <p>Попробуйте изменить параметры фильтров или выберите другую категорию</p>
                  <button className="btn btn-secondary" onClick={resetFilters}>
                    Сбросить фильтры
                  </button>
                </div>
              )}
            </div>
            
            {filteredAndSortedListings.length > 0 && (
              <div className="pagination">
                <button className="pagination-btn prev" disabled>← Назад</button>
                <div className="pagination-pages">
                  <button className="pagination-page active">1</button>
                  <button className="pagination-page">2</button>
                  <button className="pagination-page">3</button>
                  <span className="pagination-dots">...</span>
                  <button className="pagination-page">5</button>
                </div>
                <button className="pagination-btn next">Вперед →</button>
              </div>
            )}
          </div>
        </div>
        
        <div className="popular-categories">
          <h2>Популярные категории</h2>
          <p className="section-subtitle">Самые востребованные вещи для аренды</p>
          
          <div className="categories-grid">
            {popularCategories.map(category => (
              <div 
                key={category.id} 
                className="category-card"
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="category-card-icon" style={{ backgroundColor: category.color }}>
                  {category.icon}
                </div>
                <div className="category-card-content">
                  <h4>{category.name}</h4>
                  <p>{category.count} предложений</p>
                </div>
                <div className="category-card-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="about-service">
          <div className="about-content">
            <h2>Почему выбирают Thingoo?</h2>
            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon">🔒</div>
                <h3>Безопасность</h3>
                <p>Все сделки защищены, проверенные пользователи и система отзывов</p>
              </div>
              <div className="feature">
                <div className="feature-icon">💰</div>
                <h3>Доход</h3>
                <p>Зарабатывайте на вещах, которые не используете постоянно</p>
              </div>
              <div className="feature">
                <div className="feature-icon">🌱</div>
                <h3>Экология</h3>
                <p>Аренда вместо покупки — бережное отношение к ресурсам планеты</p>
              </div>
              <div className="feature">
                <div className="feature-icon">🏆</div>
                <h3>Качество</h3>
                <p>Только проверенные вещи в хорошем состоянии</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;