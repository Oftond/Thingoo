// src/components/Auth/LoginModal.jsx - ОБНОВЛЕННЫЙ
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../Toast/Toast";
import "./Modal.css";

function LoginModal({ onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login({ email, password });
    
    if (result.success) {
      setAttempts(0);
      showToast("Успешный вход!", "success");
      onClose();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setShowReset(true);
        showToast("Слишком много неудачных попыток. Восстановите пароль.", "warning");
      } else {
        setError(`Неверный email или пароль. Осталось попыток: ${3 - newAttempts}`);
      }
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setError("Введите email");
      return;
    }

    setLoading(true);
    // Имитация отправки письма
    setTimeout(() => {
      showToast(`Инструкции по восстановлению отправлены на ${resetEmail}`, "success");
      setShowReset(false);
      setAttempts(0);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {!showReset ? (
          <>
            <h2 className="modal-title">Вход в Thingoo</h2>
            <p className="modal-subtitle">Введите email и пароль</p>

            {error && <div className="modal-error">{error}</div>}

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
                  >
                    Зарегистрироваться
                  </button>
                </div>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="modal-title">Восстановление пароля</h2>
            <p className="modal-subtitle">
              Введите email, мы отправим инструкции по восстановлению
            </p>

            {error && <div className="modal-error">{error}</div>}

            <div className="modal-field">
              <label className="modal-label">Email</label>
              <input
                type="email"
                className="modal-input"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div className="modal-actions">
              <button 
                className="modal-primary-btn" 
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? "Отправка..." : "Восстановить"}
              </button>
              
              <button 
                className="modal-secondary-btn" 
                onClick={() => setShowReset(false)}
              >
                Вернуться ко входу
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginModal;