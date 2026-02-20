// src/components/Auth/RegisterModal.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../Toast/Toast";
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
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSeriesChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFormData(prev => ({ ...prev, passportSeries: value }));
  };

  const handleNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, passportNumber: value }));
  };

  const validateForm = () => {
    if (!formData.fullName?.trim()) return "Введите ФИО";
    if (!formData.email?.includes('@')) return "Введите корректный email";
    if (!formData.city?.trim()) return "Введите город";
    if (!formData.password || formData.password.length < 6) return "Пароль должен быть не менее 6 символов";
    if (formData.password !== formData.confirmPassword) return "Пароли не совпадают";
    if (!formData.passportSeries || formData.passportSeries.length !== 4) return "Серия паспорта должна содержать 4 цифры";
    if (!formData.passportNumber || formData.passportNumber.length !== 6) return "Номер паспорта должен содержать 6 цифр";
    if (!formData.passportIssuedBy?.trim()) return "Укажите кем выдан паспорт";
    if (!formData.passportIssuedDate) return "Укажите дату выдачи паспорта";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log('📤 Submitting registration with data:', formData);
      
      // Формируем данные для отправки
      const userData = {
        full_name: formData.fullName.trim(),
        city: formData.city.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        passport_series: formData.passportSeries,
        passport_number: formData.passportNumber,
        passport_issued_by: formData.passportIssuedBy.trim(),
        passport_issue_date: formData.passportIssuedDate        
      };

      console.log('📤 Formatted data for API:', userData);
      
      const result = await register(userData);
      
      console.log('📥 Registration result:', result);

      if (result.success) {
        showToast('Регистрация успешна! Теперь вы можете войти', 'success');
        setTimeout(() => {
          onSwitchToLogin(); // Переключаем на окно входа
        }, 2000);
      } else {
        setError(result.error);
        showToast(result.error, 'error');
      }
    } catch (err) {
      console.error('❌ Unexpected error:', err);
      setError('Произошла ошибка при регистрации');
      showToast('Произошла ошибка при регистрации', 'error');
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
      </div>
    </div>
  );
}

export default RegisterModal;