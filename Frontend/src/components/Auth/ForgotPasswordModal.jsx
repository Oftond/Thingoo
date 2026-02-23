// src/components/Auth/ForgotPasswordModal.jsx
import React, { useState } from "react";
import { authAPI } from "../../services/api";
import notificationService from "../../services/notificationService";
import { useToast } from "../Toast/Toast";
import "./Modal.css";

function ForgotPasswordModal({ onClose, onBackToLogin, initialEmail = "" }) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { showToast } = useToast();

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
        // Просто отправляем email — бэкенд сам отправит письмо
        await authAPI.forgotPassword({ email }); // ← передаём объект { email }
        
        setSuccess(true);
        showToast('Инструкции по восстановлению отправлены на ваш email', 'success');
        
    } catch (error) {
        console.error('Forgot password error:', error);
        
        let errorMsg = 'Ошибка при отправке запроса';
        // Обрабатываем ошибки от FastAPI
        if (error.response?.data?.detail) {
        // FastAPI возвращает массив ошибок
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
            errorMsg = detail.map(d => d.msg).join('; ');
        } else {
            errorMsg = String(detail);
        }
        }
        
        setError(errorMsg); // ← всегда строка!
        showToast(errorMsg, 'error');
    } finally {
        setLoading(false);
    }
    };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {!success ? (
          <>
            <h2 className="modal-title">Восстановление пароля</h2>
            <p className="modal-subtitle">
              Введите ваш email, и мы отправим инструкции по восстановлению пароля
            </p>

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

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="modal-secondary-btn"
                  onClick={onBackToLogin}
                  disabled={loading}
                >
                  ← Назад
                </button>
                <button 
                  type="submit" 
                  className="modal-primary-btn" 
                  disabled={loading}
                >
                  {loading ? "Отправка..." : "Отправить"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="success-container">
            <div className="success-icon">✓</div>
            <h2 className="modal-title">Письмо отправлено!</h2>
            <p className="success-message">
              Проверьте вашу почту <strong>{email}</strong>.<br />
              Мы отправили инструкции по восстановлению пароля.
            </p>
            <button 
              className="modal-primary-btn"
              onClick={onBackToLogin}
            >
              Вернуться ко входу
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordModal;