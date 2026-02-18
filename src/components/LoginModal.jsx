// src/components/LoginModal.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Modal.css";

function LoginModal({ onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login({ email, password });
      if (result.success) {
        onClose();
      } else {
        setError(result.error || "Ошибка при входе");
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

        {error && (
          <div className="modal-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="submit" 
              className="modal-primary-btn"
              disabled={loading}
            >
              {loading ? "Вход..." : "Войти"}
            </button>
            
            <div className="modal-secondary-text">
              Нет аккаунта?{" "}
              <button 
                type="button"
                className="modal-link-btn"
                onClick={onSwitchToRegister}
                disabled={loading}
              >
                Зарегистрироваться
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;