import React, { useState } from "react";
import "./Modal.css";

function LoginModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: запрос на бэк для логина
    console.log("Login", { email, password });
    onClose();
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

        <h2 className="modal-title">Вход</h2>
        <p className="modal-subtitle">
          Введите e‑mail и пароль, чтобы войти в Thingoo.
        </p>

        <form onSubmit={handleSubmit}>
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

          <div className="modal-field">
            <label className="modal-label">Пароль</label>
            <input
              type="password"
              className="modal-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="modal-primary-btn">
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
