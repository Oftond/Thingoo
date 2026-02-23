// src/pages/ResetPassword/ResetPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useToast } from '../../components/Toast/Toast';
import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Недействительная ссылка для восстановления пароля');
    }
  }, [token]);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[$@#&!]+/)) strength += 1;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    setPasswordStrength(checkPasswordStrength(password));
  };

  const getStrengthText = () => {
    if (passwordStrength <= 2) return 'Слабый';
    if (passwordStrength <= 4) return 'Средний';
    return 'Сильный';
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return '#dc2626';
    if (passwordStrength <= 4) return '#f59e0b';
    return '#10b981';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
        setError('Пароли не совпадают');
        return;
    }
    
    if (newPassword.length < 6) {
        setError('Пароль должен быть не менее 6 символов');
        return;
    }

    setLoading(true);
    setError("");

    try {
        await authAPI.resetPassword({
            token,
            newPassword
        });
        
        showToast('Пароль успешно изменён! Теперь вы можете войти.', 'success');
        navigate('/login');
    } catch (err) {
        console.error('Reset password error:', err);
        
        let errorMsg = 'Ошибка при сбросе пароля';
        if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
            errorMsg = detail.map(d => d.msg).join('; ');
        } else {
            errorMsg = String(detail);
        }
        }
        
        setError(errorMsg); // ← строка, не объект!
        showToast(errorMsg, 'error');
    } finally {
        setLoading(false);
    }
    };

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-card">
          <h1 className="reset-password-title">Восстановление пароля</h1>
          
          {!success ? (
            <>
              <p className="reset-password-subtitle">
                Введите новый пароль для вашей учетной записи
              </p>

              {error && (
                <div className="reset-password-error">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="reset-password-form">
                <div className="form-group">
                  <label htmlFor="newPassword">Новый пароль</label>
                  <input
                    type="password"
                    id="newPassword"
                    className="form-input"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Минимум 8 символов"
                    disabled={loading || !token}
                    required
                  />
                  
                  {newPassword && (
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div 
                          className="strength-fill"
                          style={{ 
                            width: `${(passwordStrength / 5) * 100}%`,
                            backgroundColor: getStrengthColor()
                          }}
                        />
                      </div>
                      <span className="strength-text" style={{ color: getStrengthColor() }}>
                        Надежность пароля: {getStrengthText()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Подтвердите пароль</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Введите пароль еще раз"
                    disabled={loading || !token}
                    required
                  />
                </div>

                <div className="password-requirements">
                  <h4>Требования к паролю:</h4>
                  <ul>
                    <li className={newPassword.length >= 8 ? 'valid' : ''}>
                      ✓ Минимум 8 символов
                    </li>
                    <li className={/[a-z]/.test(newPassword) ? 'valid' : ''}>
                      ✓ Хотя бы одна строчная буква
                    </li>
                    <li className={/[A-Z]/.test(newPassword) ? 'valid' : ''}>
                      ✓ Хотя бы одна заглавная буква
                    </li>
                    <li className={/[0-9]/.test(newPassword) ? 'valid' : ''}>
                      ✓ Хотя бы одна цифра
                    </li>
                    <li className={/[$@#&!]/.test(newPassword) ? 'valid' : ''}>
                      ✓ Хотя бы один спецсимвол ($@#&!)
                    </li>
                  </ul>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-block"
                  disabled={loading || !token}
                >
                  {loading ? 'Сохранение...' : 'Сохранить новый пароль'}
                </button>
              </form>

              <div className="reset-password-footer">
                <button 
                  className="link-button"
                  onClick={() => navigate('/login')}
                  disabled={loading}
                >
                  ← Вернуться ко входу
                </button>
              </div>
            </>
          ) : (
            <div className="reset-password-success">
              <div className="success-icon">✓</div>
              <h2>Пароль успешно изменен!</h2>
              <p>
                Теперь вы можете войти в систему с новым паролем.
                <br />
                Перенаправление на страницу входа...
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/login')}
              >
                Перейти ко входу
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;