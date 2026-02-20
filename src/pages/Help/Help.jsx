// src/pages/Help/Help.jsx
import React from 'react';
import './Help.css';

const Help = () => {
  return (
    <div className="help-page">
      <div className="page-container">
        <div className="page-header">
          <h1>Помощь и поддержка</h1>
        </div>
        
        <div className="help-sections">
          <div className="help-card">
            <div className="help-icon">❓</div>
            <h3>Часто задаваемые вопросы</h3>
            <ul className="faq-list">
              <li>Как создать объявление?</li>
              <li>Как арендовать вещь?</li>
              <li>Как работает оплата?</li>
              <li>Что делать при повреждении вещи?</li>
            </ul>
          </div>
          
          <div className="help-card">
            <div className="help-icon">📞</div>
            <h3>Контакты поддержки</h3>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-label">Email:</span>
                <span className="contact-value">support@thingoo.ru</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Телефон:</span>
                <span className="contact-value">+7 (495) 123-45-67</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Чат:</span>
                <span className="contact-value">Онлайн с 9:00 до 21:00</span>
              </div>
            </div>
          </div>
          
          <div className="help-card">
            <div className="help-icon">📚</div>
            <h3>Полезные статьи</h3>
            <ul className="article-list">
              <li>Как сделать качественное объявление</li>
              <li>Советы по безопасной аренде</li>
              <li>Как правильно оценить вещь</li>
              <li>Правила сообщества Thingoo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;