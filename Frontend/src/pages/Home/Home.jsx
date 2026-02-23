// src/pages/Home/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { itemsAPI, mediaAPI } from "../../services/api";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photoUrls, setPhotoUrls] = useState({});

  const categories = [
    { id: 'electronics', name: 'Электроника', icon: '📱', color: '#FF6B6B', count: 156 },
    { id: 'tools', name: 'Инструменты', icon: '🔧', color: '#4ECDC4', count: 89 },
    { id: 'sports', name: 'Спорт и отдых', icon: '⚽', color: '#FFD166', count: 124 },
    { id: 'vehicles', name: 'Транспорт', icon: '🚲', color: '#06D6A0', count: 67 },
    { id: 'furniture', name: 'Мебель', icon: '🛋️', color: '#118AB2', count: 45 },
    { id: 'books', name: 'Книги', icon: '📚', color: '#EF476F', count: 78 },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Найдите нужную вещь",
      description: "Ищите в каталоге по категориям или используйте поиск",
      icon: "🔍"
    },
    {
      step: 2,
      title: "Свяжитесь с владельцем",
      description: "Обсудите детали и договоритесь о встрече",
      icon: "💬"
    },
    {
      step: 3,
      title: "Арендуйте и пользуйтесь",
      description: "Оплатите аренду и получите вещь",
      icon: "✨"
    },
    {
      step: 4,
      title: "Верните и получите отзыв",
      description: "Верните вещь в срок и получите положительный отзыв",
      icon: "⭐"
    }
  ];

  const benefits = [
    {
      title: "Безопасность",
      description: "Все сделки защищены, проверенные пользователи и система отзывов",
      icon: "🛡️"
    },
    {
      title: "Экономия",
      description: "Арендуйте вместо покупки и экономьте деньги и место",
      icon: "💰"
    },
    {
      title: "Экология",
      description: "Делитесь вещами и уменьшайте количество отходов",
      icon: "🌱"
    },
    {
      title: "Удобство",
      description: "Простой интерфейс и быстрый поиск нужных вещей",
      icon: "⚡"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Анна",
      avatar: "👩",
      rating: 5,
      text: "Отличный сервис! Арендовала фотоаппарат для путешествия, всё прошло отлично.",
      role: "Арендатор"
    },
    {
      id: 2,
      name: "Михаил",
      avatar: "👨",
      rating: 5,
      text: "Сдаю инструменты, которые редко использую. Дополнительный доход и помощь людям.",
      role: "Арендодатель"
    },
    {
      id: 3,
      name: "Елена",
      avatar: "👩‍🦰",
      rating: 5,
      text: "Нашла здесь велосипед для ребёнка на лето. Гораздо выгоднее, чем покупать новый!",
      role: "Арендатор"
    }
  ];

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        setLoading(true);
        // Получаем последние 6 добавленных объявлений
        const response = await itemsAPI.getAll({ limit: 6, sort: 'newest' });
        const items = response.data || [];
        setFeaturedItems(items);

        // Загружаем фото для каждого товара
        items.forEach(async (item) => {
          try {
            const photos = await mediaAPI.getItemPhotos(item.id);
            if (photos.data && photos.data.length > 0) {
              const photoUrl = mediaAPI.getPhotoUrl(photos.data[0].id);
              setPhotoUrls(prev => ({
                ...prev,
                [item.id]: photoUrl
              }));
            }
          } catch (error) {
            console.warn(`Failed to load photo for item ${item.id}`);
          }
        });

      } catch (error) {
        console.error('Failed to load featured items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  const handleImageError = (e, itemId) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
  };

  return (
    <main className="home">
      {/* Hero секция */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Арендуйте вещи, 
            <span className="hero-highlight"> делитесь и экономьте</span>
          </h1>
          <p className="hero-subtitle">
            Тысячи предметов доступны для аренды рядом с вами. 
            Найдите то, что нужно, или сдайте свои вещи в аренду.
          </p>
          <div className="hero-buttons">
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate('/catalog')}
            >
              Найти вещь
            </button>
            <button 
              className="btn btn-outline btn-large"
              onClick={() => navigate('/create-listing')}
            >
              Сдать в аренду
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Активных объявлений</span>
            </div>
            <div className="stat">
              <span className="stat-number">5k+</span>
              <span className="stat-label">Довольных арендаторов</span>
            </div>
            <div className="stat">
              <span className="stat-number">2k+</span>
              <span className="stat-label">Арендодателей</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-grid">
            <div className="grid-item grid-item-1"></div>
            <div className="grid-item grid-item-2"></div>
            <div className="grid-item grid-item-3"></div>
            <div className="grid-item grid-item-4"></div>
          </div>
        </div>
      </section>

      {/* Категории */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Популярные категории</h2>
          <p className="section-subtitle">Выберите категорию и найдите нужную вещь</p>
          
          <div className="categories-grid">
            {categories.map(category => (
              <div 
                key={category.id}
                className="category-card"
                onClick={() => navigate(`/catalog?category=${category.id}`)}
              >
                <div className="category-icon" style={{ backgroundColor: category.color }}>
                  {category.icon}
                </div>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-count">{category.count} вещей</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">Как это работает</h2>
          <p className="section-subtitle">Всего 4 простых шага</p>
          
          <div className="steps-grid">
            {howItWorks.map(step => (
              <div key={step.step} className="step-card">
                <div className="step-number">{step.step}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Рекомендуемые товары */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Недавно добавленные</h2>
          <p className="section-subtitle">Самые свежие предложения</p>
          
          {loading ? (
            <div className="loading-spinner">Загрузка...</div>
          ) : (
            <div className="featured-grid">
              {featuredItems.map(item => (
                <div 
                  key={item.id}
                  className="featured-card"
                  onClick={() => navigate(`/listing/${item.id}`)}
                >
                  <div className="featured-image">
                    {photoUrls[item.id] ? (
                      <img 
                        src={photoUrls[item.id]} 
                        alt={item.title}
                        onError={(e) => handleImageError(e, item.id)}
                      />
                    ) : (
                      <div className="image-placeholder">
                        <span>{categories.find(c => c.id === item.category)?.icon || '📦'}</span>
                      </div>
                    )}
                  </div>
                  <div className="featured-content">
                    <h3 className="featured-title">{item.title}</h3>
                    <p className="featured-price">{item.price_per_day} ₽/день</p>
                    <p className="featured-location">{item.location || '📍 Местоположение не указано'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="featured-more">
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/catalog')}
            >
              Смотреть все объявления →
            </button>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="benefits-section">
        <div className="container">
          <h2 className="section-title">Почему выбирают Thingoo</h2>
          
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Что говорят наши пользователи</h2>
          
          <div className="testimonials-grid">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-avatar">{testimonial.avatar}</div>
                <div className="testimonial-content">
                  <div className="testimonial-rating">
                    {'⭐'.repeat(testimonial.rating)}
                  </div>
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <div className="testimonial-author">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Готовы начать?</h2>
            <p>Присоединяйтесь к сообществу Thingoo и начните арендовать или сдавать вещи уже сегодня</p>
            <div className="cta-buttons">
              <button 
                className="btn btn-primary btn-large"
                onClick={() => navigate('/register')}
              >
                Зарегистрироваться
              </button>
              <button 
                className="btn btn-outline btn-large"
                onClick={() => navigate('/catalog')}
              >
                Посмотреть каталог
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;