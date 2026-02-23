// src/components/Auth/LoginModal.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../Toast/Toast";
import ForgotPasswordModal from "./ForgotPasswordModal";
import "./Modal.css";

function LoginModal({ onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login({ email, password });

      if (result.success) {
        showToast('Успешный вход!', 'success');
        onClose();
      }
    } catch (err) {
      console.error('Login error:', err);
      let errorMsg = 'Ошибка при входе';
      if (err.response?.status === 401) {
        errorMsg = 'Неверный email или пароль';
      }
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  // Если открыта модалка восстановления пароля, показываем её
  if (showForgotPassword) {
    return (
      <ForgotPasswordModal 
        onClose={handleCloseForgotPassword}
        onBackToLogin={handleBackToLogin}
        initialEmail={email}
      />
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2 className="modal-title">Вход в Thingoo</h2>
        <p className="modal-subtitle">Введите email и пароль</p>

        {error && (
          <div className="modal-error">
            <strong>Ошибка:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="modal-field">
            <label className="modal-label">Email</label>
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
            />
          </div>

          {/* Ссылка на восстановление пароля */}
          <div className="forgot-password-container">
            <button 
              type="button"
              className="forgot-password-link"
              onClick={handleForgotPasswordClick}
              disabled={loading}
            >
              Забыли пароль?
            </button>
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