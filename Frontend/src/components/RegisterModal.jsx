// src/components/RegisterModal.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Modal.css";

function RegisterModal({ onClose, onSwitchToLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passportSeries, setPassportSeries] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [passportIssuedBy, setPassportIssuedBy] = useState("");
  const [passportIssuedDate, setPassportIssuedDate] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Валидация пароля
    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      setLoading(false);
      return;
    }

    // Валидация паспорта
    if (passportSeries.length !== 4 || !/^\d+$/.test(passportSeries)) {
      setError("Серия паспорта должна содержать 4 цифры");
      setLoading(false);
      return;
    }

    if (passportNumber.length !== 6 || !/^\d+$/.test(passportNumber)) {
      setError("Номер паспорта должен содержать 6 цифр");
      setLoading(false);
      return;
    }

    try {
      const userData = {
        fullName,
        email,
        password,
        city,
        passportData: {
          series: passportSeries,
          number: passportNumber,
          issuedBy: passportIssuedBy,
          issuedDate: passportIssuedDate,
        },
      };

      const result = await register(userData);
      
      if (result.success) {
        onClose();
      } else {
        setError(result.error || "Ошибка при регистрации");
      }
    } catch (err) {
      setError("Произошла ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content register-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2 className="modal-title">Регистрация</h2>
        <p className="modal-subtitle">
          Заполните данные, чтобы создать аккаунт и сдавать вещи в аренду.
        </p>

        {error && (
          <div className="modal-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="modal-field">
            <label className="modal-label">ФИО</label>
            <input
              type="text"
              className="modal-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
              placeholder="Иванов Иван Иванович"
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Город</label>
            <input
              type="text"
              className="modal-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              disabled={loading}
              placeholder="Новосибирск"
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">E‑mail</label>
            <input
              type="email"
              className="modal-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="your@email.com"
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Пароль</label>
            <input
              type="password"
              className="modal-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="минимум 6 символов"
              minLength={6}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Подтвердите пароль</label>
            <input
              type="password"
              className="modal-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="••••••••"
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Паспорт (серия и номер)</label>
            <div className="modal-passport-row">
              <input
                type="text"
                className="modal-input modal-passport-series"
                placeholder="Серия (4 цифры)"
                value={passportSeries}
                onChange={(e) => setPassportSeries(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                required
                disabled={loading}
              />
              <input
                type="text"
                className="modal-input modal-passport-number"
                placeholder="Номер (6 цифр)"
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="modal-field">
            <label className="modal-label">Кем выдан</label>
            <input
              type="text"
              className="modal-input"
              placeholder="Например: УФМС России по Новосибирской обл."
              value={passportIssuedBy}
              onChange={(e) => setPassportIssuedBy(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Дата выдачи</label>
            <input
              type="date"
              className="modal-input"
              value={passportIssuedDate}
              onChange={(e) => setPassportIssuedDate(e.target.value)}
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
            
            <div className="modal-secondary-text">
              Нажимая «Зарегистрироваться», вы соглашаетесь с{" "}
              <button 
                type="button"
                className="modal-link-btn"
                onClick={() => window.open('/terms', '_blank')}
              >
                условиями сервиса
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;