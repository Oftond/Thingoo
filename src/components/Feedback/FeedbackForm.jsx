// src/components/Feedback/FeedbackForm.jsx
import React, { useState } from 'react';
import { useToast } from '../Toast/Toast';
import './FeedbackForm.css';

const FeedbackForm = ({ onClose }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'suggestion',
    rating: 5,
    message: '',
    attachFile: false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Имитация отправки
    setTimeout(() => {
      setSubmitted(true);
      showToast('Спасибо за обратную связь!', 'success');
      
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="feedback-success">
        <div className="success-icon">✓</div>
        <h3>Спасибо за отзыв!</h3>
        <p>Мы ценим ваше мнение и постараемся стать лучше.</p>
      </div>
    );
  }

  return (
    <div className="feedback-modal">
      <div className="feedback-header">
        <h2>Обратная связь</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label>Ваше имя *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Иван Петров"
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="ivan@email.com"
          />
        </div>

        <div className="form-group">
          <label>Тип обращения</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="suggestion">Предложение</option>
            <option value="bug">Ошибка/Проблема</option>
            <option value="question">Вопрос</option>
            <option value="other">Другое</option>
          </select>
        </div>

        <div className="form-group">
          <label>Оценка сервиса</label>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                className={`star ${star <= formData.rating ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Сообщение *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Опишите ваше предложение или проблему..."
          />
        </div>

        <div className="form-group checkbox">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="attachFile"
              checked={formData.attachFile}
              onChange={handleChange}
            />
            <span className="checkbox-custom"></span>
            <span>Прикрепить скриншот (необязательно)</span>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="btn btn-primary">
            Отправить
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;