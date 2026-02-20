// src/pages/AboutUs/AboutUs.jsx - ОБНОВЛЕННЫЙ (убраны шаги)
import React from "react";
import { useNavigate } from "react-router-dom";
import "./AboutUs.css";

const testimonials = [
    {
      text: "Отличный сервис! Арендовал камеру для съемок, всё прошло гладко. Владелец приехал вовремя, камера в идеальном состоянии.",
      author: "Анна",
      city: "Новосибирск",
      rating: 5
    },
    {
      text: "Сдаю электроинструменты через Thingoo уже полгода. Отличный дополнительный доход, все арендаторы адекватные, поддержка всегда помогает если возникают вопросы.",
      author: "Михаил",
      city: "Москва",
      rating: 5
    },
    {
      text: "Арендовал велосипед на выходные. Очень удобно, что не нужно покупать свой, если катаешься редко. Обязательно вернусь за палаткой в отпуск!",
      author: "Дмитрий",
      city: "Санкт-Петербург",
      rating: 5
    }
  ];

function AboutUs() {
  const navigate = useNavigate();

  const stats = [
    { value: "10 000+", label: "Пользователей" },
    { value: "5 000+", label: "Активных объявлений" },
    { value: "50+", label: "Городов России" },
    { value: "15 000+", label: "Успешных аренд" },
    { value: "4.8", label: "Средний рейтинг" },
    { value: "24/7", label: "Поддержка" }
  ];

  const categories = [
    { icon: "📱", name: "Электроника", examples: "Камеры, ноутбуки, проекторы, игровые консоли, дроны" },
    { icon: "🔧", name: "Инструменты", examples: "Дрели, перфораторы, шуруповерты, пилы" },
    { icon: "⚽", name: "Спорт и отдых", examples: "Велосипеды, самокаты, лыжи, палатки" },
    { icon: "🚲", name: "Транспорт", examples: "Электросамокаты, гироскутеры, велосипеды" },
    { icon: "📷", name: "Фототехника", examples: "Профессиональные камеры, объективы, штативы" },
    { icon: "🎉", name: "Для праздника", examples: "Колонки, микрофоны, проекторы, декор" },
    { icon: "🎸", name: "Музыка", examples: "Гитары, синтезаторы, барабаны, звук" },
    { icon: "📚", name: "Книги", examples: "Учебники, художественная литература" },
    { icon: "👕", name: "Одежда", examples: "Костюмы, вечерние платья, тематические наряды" },
    { icon: "🛋️", name: "Мебель", examples: "Раскладные столы, стулья для мероприятий" }
  ];

  const values = [
    {
      icon: "🤝",
      title: "Доверие",
      description: "Создаем сообщество, где люди могут доверять друг другу. Все пользователи проходят верификацию по паспорту, а каждая сделка защищена."
    },
    {
      icon: "🌱",
      title: "Экологичность",
      description: "Помогаем сократить количество неиспользуемых вещей и уменьшить потребление. Аренда вместо покупки — это вклад в будущее планеты."
    },
    {
      icon: "💰",
      title: "Доступность",
      description: "Делаем качественные вещи доступными каждому. Дорогие вещи становятся доступными, а владельцы зарабатывают на том, что не используют."
    },
    {
      icon: "🛡️",
      title: "Безопасность",
      description: "Защищаем данные и платежи пользователей. Верификация, отзывы, страховка и система залогов гарантируют безопасность каждой сделки."
    },
    {
      icon: "🚀",
      title: "Инновации",
      description: "Постоянно развиваемся и внедряем новые технологии, чтобы делать аренду еще проще, удобнее и доступнее."
    },
    {
      icon: "❤️",
      title: "Забота",
      description: "Каждый пользователь важен для нас. Мы всегда готовы помочь и поддержать в любой ситуации, 24 часа в сутки, 7 дней в неделю."
    }
  ];

  const audience = [
    {
      group: "Студенты",
      description: "Нужна техника на сессию, велосипед на лето"
    },
    {
      group: "Путешественники",
      description: "Палатка, спальник, фотоаппарат на поездку"
    },
    {
      group: "Фотографы",
      description: "Разное оборудование под разные задачи"
    },
    {
      group: "Мастера и строители",
      description: "Дорогой инструмент на разовые работы"
    },
    {
      group: "Организаторы мероприятий",
      description: "Звук, свет, декор на праздник"
    },
    {
      group: "Спортсмены",
      description: "Сезонный инвентарь (лыжи летом не нужны)"
    },
    {
      group: "Экономные люди",
      description: "Не хотят переплачивать за редкие покупки"
    },
    {
      group: "Эко-активисты",
      description: "Разделяют идеи разумного потребления"
    }
  ];

  const benefits = [
    {
      for: "Арендаторы",
      items: [
        "Не покупать дорогие вещи, которые нужны на один раз",
        "Экономить деньги и место в квартире",
        "Иметь доступ к широкому ассортименту вещей в своем городе",
        "Пробовать разные модели перед покупкой"
      ]
    },
    {
      for: "Арендодатели",
      items: [
        "Зарабатывать на вещах, которые просто лежат без дела",
        "Окупать стоимость вещей через аренду",
        "Находить применение инструментам в межсезонье",
        "Знакомиться с интересными людьми"
      ]
    }
  ];

  const mission = "Сделать аренду вещей доступной, безопасной и удобной для каждого, создавая сообщество осознанного потребления и взаимопомощи.";
  
  const vision = "Мир, где люди не покупают вещи 'на всякий случай', а берут их в аренду когда нужно, экономя ресурсы — свои и планеты.";

  return (
    <main className="about">
      <div className="about-inner">
        {/* Герой-секция */}
        <section className="about-hero">
          <h1 className="about-title">Thingoo</h1>
          <p className="about-subtitle">Платформа для аренды вещей между людьми</p>
          <p className="about-description">
            <strong>Thingoo</strong> — это маркетплейс, где люди могут сдавать свои вещи в аренду 
            или арендовать нужные предметы у других пользователей. Сервис объединяет тех, 
            у кого вещи простаивают без дела, и тех, кому они нужны на короткий срок.
          </p>
          <div className="about-hero-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              На главную
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/catalog')}
            >
              Перейти в каталог
            </button>
          </div>
        </section>

        {/* Миссия и видение */}
        <section className="about-mission-vision">
          <div className="mission-card">
            <h2>Наша миссия</h2>
            <p>{mission}</p>
          </div>
          <div className="vision-card">
            <h2>Наше видение</h2>
            <p>{vision}</p>
          </div>
        </section>

        {/* Статистика */}
        <section className="about-stats">
          <h2>Thingoo в цифрах</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Что можно арендовать */}
        <section className="about-categories">
          <h2>Что можно арендовать</h2>
          <p className="section-subtitle">
            Более 10 категорий товаров для любых целей
          </p>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <p>{category.examples}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Целевая аудитория */}
        <section className="about-audience">
          <h2>Кому подойдет Thingoo</h2>
          <p className="section-subtitle">
            Мы создаем сервис для разных людей с разными потребностями
          </p>
          <div className="audience-grid">
            {audience.map((item, index) => (
              <div key={index} className="audience-item">
                <div className="audience-icon">👤</div>
                <div>
                  <h3>{item.group}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Наши ценности */}
        <section className="about-values">
          <h2>Наши ценности</h2>
          <p className="section-subtitle">
            То, во что мы верим и что делает Thingoo особенным
          </p>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Преимущества */}
        <section className="about-benefits">
          <h2>Почему выбирают Thingoo</h2>
          <div className="benefits-comparison">
            <div className="benefits-column">
              <h3>✅ Для арендаторов</h3>
              <ul>
                {benefits[0].items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="benefits-column">
              <h3>💰 Для арендодателей</h3>
              <ul>
                {benefits[1].items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Безопасность */}
        <section className="about-security">
          <h2>Безопасность на Thingoo</h2>
          <div className="security-grid">
            <div className="security-card">
              <h3>Для арендаторов</h3>
              <ul>
                <li>✓ Проверка владельцев — верификация по паспорту</li>
                <li>✓ Рейтинг и отзывы — можно оценить надежность</li>
                <li>✓ Страхование — защита от повреждений</li>
                <li>✓ Залог — гарантия для владельца</li>
              </ul>
            </div>
            <div className="security-card">
              <h3>Для арендодателей</h3>
              <ul>
                <li>✓ Верификация арендаторов — паспортные данные</li>
                <li>✓ Система залогов — финансовые гарантии</li>
                <li>✓ Страхование вещей — от случайных повреждений</li>
                <li>✓ История пользователя — рейтинг и статистика</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Отзывы */}
        <section className="about-testimonials">
          <h2>Что говорят пользователи</h2>
          <p className="section-subtitle">
            Реальные истории людей, которые уже пользуются Thingoo
          </p>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {'★'.repeat(testimonial.rating)}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.city}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Призыв к действию */}
        <section className="about-cta">
          <h2>Готовы попробовать?</h2>
          <p>Присоединяйтесь к сообществу Thingoo уже сегодня</p>
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
        </section>
      </div>
    </main>
  );
}

export default AboutUs;