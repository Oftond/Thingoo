// src/components/Auth/RegisterModal.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Modal.css";

function RegisterModal({ onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    passportSeries: "",
    passportNumber: "",
    passportIssuedBy: "",
    passportIssuedDate: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSeriesChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFormData(prev => ({ ...prev, passportSeries: value }));
    setError("");
  };

  const handleNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, passportNumber: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Введите ФИО");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Введите корректный email");
      return false;
    }

    if (!formData.city.trim()) {
      setError("Введите город");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      return false;
    }

    if (formData.passportSeries.length !== 4) {
      setError("Серия паспорта должна содержать 4 цифры");
      return false;
    }

    if (formData.passportNumber.length !== 6) {
      setError("Номер паспорта должен содержать 6 цифр");
      return false;
    }

    if (!formData.passportIssuedBy.trim()) {
      setError("Укажите кем выдан паспорт");
      return false;
    }

    if (!formData.passportIssuedDate) {
      setError("Укажите дату выдачи паспорта");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        city: formData.city.trim(),
        passportData: {
          series: formData.passportSeries,
          number: formData.passportNumber,
          issuedBy: formData.passportIssuedBy.trim(),
          issuedDate: formData.passportIssuedDate,
        },
      };

      console.log('Submitting registration:', userData);
      
      const result = await register(userData);
      
      console.log('Registration result:', result);

      if (result.success) {
        alert('Регистрация успешна! Теперь вы можете войти.');
        onClose();
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content register-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2 className="modal-title">Регистрация</h2>
        <p className="modal-subtitle">Заполните данные для регистрации</p>

        {error && (
          <div className="modal-error">
            <strong>Ошибка:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="modal-field">
            <label className="modal-label">ФИО *</label>
            <input
              type="text"
              name="fullName"
              className="modal-input"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Иванов Иван Иванович"
              disabled={loading}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Город *</label>
            <input
              type="text"
              name="city"
              className="modal-input"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="Новосибирск"
              disabled={loading}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Email *</label>
            <input
              type="email"
              name="email"
              className="modal-input"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Пароль *</label>
            <input
              type="password"
              name="password"
              className="modal-input"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="минимум 6 символов"
              disabled={loading}
              minLength="6"
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Подтвердите пароль *</label>
            <input
              type="password"
              name="confirmPassword"
              className="modal-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Паспорт (серия и номер) *</label>
            <div className="modal-passport-row">
              <input
                type="text"
                className="modal-input modal-passport-series"
                placeholder="Серия (4 цифры)"
                value={formData.passportSeries}
                onChange={handleSeriesChange}
                maxLength={4}
                required
                disabled={loading}
              />
              <input
                type="text"
                className="modal-input modal-passport-number"
                placeholder="Номер (6 цифр)"
                value={formData.passportNumber}
                onChange={handleNumberChange}
                maxLength={6}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="modal-field">
            <label className="modal-label">Кем выдан *</label>
            <input
              type="text"
              name="passportIssuedBy"
              className="modal-input"
              placeholder="УФМС России по Новосибирской обл."
              value={formData.passportIssuedBy}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Дата выдачи *</label>
            <input
              type="date"
              name="passportIssuedDate"
              className="modal-input"
              value={formData.passportIssuedDate}
              onChange={handleChange}
              required
              disabled={loading}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="submit" 
              className="modal-primary-btn" 
              disabled={loading}
            >
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </button>
            
            <div className="modal-secondary-text">
              Уже есть аккаунт?{" "}
              <button 
                type="button" 
                className="modal-link-btn" 
                onClick={onSwitchToLogin}
                disabled={loading}
              >
                Войти
              </button>
            </div>
          </div>
        </form>

        {/* Временная кнопка для отладки */}
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => {
              const users = JSON.parse(localStorage.getItem('thingoo_users') || '[]');
              console.log('Current users:', users);
              alert('Пользователи сохранены: ' + users.length);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              fontSize: '12px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Проверить сохранение
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;