// src/pages/CatalogPage/CatalogPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CatalogPage.css';

const listings = [
    {
      id: 1,
      title: 'Камера Sony Alpha 7 III с объективом',
      category: 'electronics',
      price_per_day: 1200,
      rating: 4.8,
      reviews: 24,
      distance: 2.5,
      hasInsurance: true,
      hasFastDelivery: true,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      userRating: 4.9,
      isNew: true,
    },
    {
      id: 2,
      title: 'Горный велосипед Trek 29 дюймов',
      category: 'sports',
      price_per_day: 800,
      rating: 4.7,
      reviews: 18,
      distance: 5.3,
      hasInsurance: true,
      hasFastDelivery: false,
      image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      userRating: 4.8,
      isNew: false,
    },
    {
      id: 3,
      title: 'Дрель Bosch Professional GSB 18V',
      category: 'tools',
      price_per_day: 450,
      rating: 4.9,
      reviews: 32,
      distance: 1.2,
      hasInsurance: false,
      hasFastDelivery: true,
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      userRating: 4.7,
      isNew: true,
    },
    {
      id: 4,
      title: 'Палатка 4-местная с тамбуром',
      category: 'sports',
      price_per_day: 300,
      rating: 4.6,
      reviews: 15,
      distance: 3.8,
      hasInsurance: true,
      hasFastDelivery: true,
      image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      userRating: 4.9,
      isNew: false,
    },
    {
      id: 5,
      title: 'Ноутбук MacBook Pro 2023 14"',
      category: 'electronics',
      price_per_day: 1500,
      rating: 4.8,
      reviews: 28,
      distance: 0.8,
      hasInsurance: true,
      hasFastDelivery: true,
      image: 'https://images.unsplash.com/photo-1515343480029-43cdfe6b6aae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      userRating: 4.8,
      isNew: true,
    },
    {
      id: 6,
      title: 'Гироскутер Xiaomi Mi Pro 2',
      category: 'vehicles',
      price_per_day: 600,
      rating: 4.5,
      reviews: 12,
      distance: 2.1,
      hasInsurance: false,
      hasFastDelivery: true,
      image: 'https://images.unsplash.com/photo-1571506872033-8f6a3c3c1785?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      userRating: 4.6,
      isNew: false,
    },
    {
      id: 7,
      title: 'Проектор Epson 4K для дома',
      category: 'electronics',
      price_per_day: 900,
      rating: 4.7,
      reviews: 21,
      distance: 4.5,
      hasInsurance: true,
      hasFastDelivery: false,
      image: 'https://images.unsplash.com/photo-1563981399209-5c6d83b43e7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      userRating: 4.7,
      isNew: false,
    },
    {
      id: 8,
      title: 'Набор инструментов 150 предметов',
      category: 'tools',
      price_per_day: 350,
      rating: 4.6,
      reviews: 19,
      distance: 1.7,
      hasInsurance: true,
      hasFastDelivery: true,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      userRating: 4.8,
      isNew: true,
    },
    {
      id: 9,
      title: 'Электросамокат Ninebot Max',
      category: 'vehicles',
      price_per_day: 700,
      rating: 4.3,
      reviews: 8,
      distance: 3.2,
      hasInsurance: true,
      hasFastDelivery: true,
      image: 'https://images.unsplash.com/photo-1579445710183-f9a8161b2e7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      userRating: 4.5,
      isNew: false,
    },
    {
      id: 10,
      title: 'Игровая консоль PlayStation 5',
      category: 'electronics',
      price_per_day: 1000,
      rating: 4.9,
      reviews: 42,
      distance: 1.5,
      hasInsurance: true,
      hasFastDelivery: true,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      userRating: 4.9,
      isNew: true,
    },
    {
      id: 11,
      title: 'Гитара акустическая Yamaha',
      category:'music',
      price_per_day: 400,
      rating: 4.4,
      reviews: 11,
      distance: 2.8,
      hasInsurance: false,
      hasFastDelivery: false,
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      userRating: 4.6,
      isNew: false,
    },
    {
      id: 12,
      title: 'Беговая дорожка электрическая',
      category: 'sports',
      price_per_day: 850,
      rating: 4.2,
      reviews: 7,
      distance: 4.7,
      hasInsurance: true,
      hasFastDelivery: true,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      userRating: 4.3,
      isNew: false,
    },
  ];

const CatalogPage = () => {
  const navigate = useNavigate();
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
      const matchesRating = ratingFilter.id === 'all' || listing.rating >= ratingFilter.min;
      const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1];
      const matchesSearch = searchQuery === '' || 
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        categories.find(c => c.id === listing.category)?.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesRating && matchesPrice && matchesSearch;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'distance':
          return a.distance - b.distance;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return (b.rating * b.reviews) - (a.rating * a.reviews);
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
                Средний рейтинг: <strong>4.7</strong>
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
              {filteredAndSortedListings.length > 0 ? (
                filteredAndSortedListings.map(listing => (
                  <div 
                    key={listing.id} 
                    className="listing-card"
                    onClick={() => goToListingDetail(listing.id)}
                  >
                    <div className="listing-image">
                      <img src={listing.image} alt={listing.title} />
                      <div className="listing-badges">
                        {listing.hasInsurance && <span className="badge badge-insurance">💎 Страхование</span>}
                        {listing.hasFastDelivery && <span className="badge badge-delivery">🚚 Быстрая доставка</span>}
                        {listing.isNew && <span className="badge badge-new">🆕 Новое</span>}
                      </div>
                      <button className="favorite-btn">❤️</button>
                    </div>
                    
                    <div className="listing-content">
                      <div className="listing-header">
                        <h3 className="listing-title">{listing.title}</h3>
                        <div className="listing-price">{listing.price} ₽/день</div>
                      </div>
                      
                      <div className="listing-category">
                        <span className="category-icon-small">
                          {categories.find(c => c.id === listing.category)?.icon}
                        </span>
                        <span>{categories.find(c => c.id === listing.category)?.name}</span>
                      </div>
                      
                      <div className="listing-info">
                        <div className="info-item rating-item">
                          <span className="info-icon">⭐</span>
                          <span className="info-text">{listing.rating}</span>
                          <span className="info-reviews">({listing.reviews})</span>
                        </div>
                        <div className="info-item">
                          <span className="info-icon">📍</span>
                          <span className="info-text">{listing.distance} км</span>
                        </div>
                        <div className="info-item">
                          <span className="info-icon">👤</span>
                          <span className="info-text">{listing.userRating}</span>
                        </div>
                      </div>
                      
                      <button className="btn btn-rent">Арендовать</button>
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