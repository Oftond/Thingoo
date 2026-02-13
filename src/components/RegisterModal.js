// src/components/RegisterModal.js
import React, { useState } from "react";
import "./Modal.css";
import { registerUser } from "../api/auth";

function RegisterModal({ onClose }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passportSeries, setPassportSeries] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [passportIssuedBy, setPassportIssuedBy] = useState("");
  const [passportIssuedDate, setPassportIssuedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        fullName,
        email,
        password,
        passportSeries,
        passportNumber,
        passportIssuedBy,
        passportIssuedDate,
      };

      const data = await registerUser(payload);
      console.log("Register success", data);
      // сюда можно добавить авто‑логин или показ уведомления
      onClose();
    } catch (err) {
      setError(err.message || "Ошибка при регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2 className="modal-title">Регистрация</h2>
        <p className="modal-subtitle">
          Заполните данные, чтобы создать аккаунт и сдавать вещи в аренду.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="modal-field">
            <label className="modal-label">ФИО</label>
            <input
              type="text"
              className="modal-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
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
            />
          </div>

          {/* Пароль */}
          <div className="modal-field">
            <label className="modal-label">Пароль</label>
            <input
              type="password"
              className="modal-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          {/* серия + номер в одну строку */}
          <div className="modal-field">
            <label className="modal-label">Паспорт (серия и номер)</label>
            <div className="modal-passport-row">
              <input
                type="text"
                className="modal-input modal-passport-series"
                placeholder="Серия (1234)"
                value={passportSeries}
                onChange={(e) => setPassportSeries(e.target.value)}
                maxLength={4}
                required
              />
              <input
                type="text"
                className="modal-input modal-passport-number"
                placeholder="Номер (567890)"
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value)}
                maxLength={6}
                required
              />
            </div>
          </div>

          {/* кем выдан */}
          <div className="modal-field">
            <label className="modal-label">Кем выдан</label>
            <input
              type="text"
              className="modal-input"
              placeholder="Например: УФМС России по Новосибирской обл."
              value={passportIssuedBy}
              onChange={(e) => setPassportIssuedBy(e.target.value)}
              required
            />
          </div>

          {/* дата выдачи */}
          <div className="modal-field">
            <label className="modal-label">Дата выдачи</label>
            <input
              type="date"
              className="modal-input"
              value={passportIssuedDate}
              onChange={(e) => setPassportIssuedDate(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="modal-secondary-text" style={{ color: "#b91c1c" }}>
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="submit"
              className="modal-primary-btn"
              disabled={loading}
            >
              {loading ? "Отправка..." : "Зарегистрироваться"}
            </button>
            <div className="modal-secondary-text">
              Нажимая «Зарегистрироваться», вы соглашаетесь с условиями сервиса.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;
