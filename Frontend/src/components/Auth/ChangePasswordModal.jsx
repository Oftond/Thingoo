// src/components/Modals/ChangePasswordModal.jsx
import React, { useState } from 'react';
import './Modal.css';
import { usersAPI } from '../../services/api';
import { useToast } from '../Toast/Toast';
import { useAuth } from '../../context/AuthContext';
import notificationService from '../../services/notificationService';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { user } = useAuth(); // Получаем текущего пользователя
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { showToast } = useToast();

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[$@#&!]+/)) strength += 1;
    return strength;
  };

  const handleNewPasswordChange = (e) => {
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

  const validateForm = () => {
    if (!currentPassword) {
      setError('Введите текущий пароль');
      return false;
    }
    
    if (newPassword.length < 8) {
      setError('Новый пароль должен содержать минимум 8 символов');
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return false;
    }
    
    if (currentPassword === newPassword) {
      setError('Новый пароль должен отличаться от текущего');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      setError('Пользователь не авторизован');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await usersAPI.changePassword(user.id, {
        current_password: currentPassword,
        new_password: newPassword
      });

      await notificationService.sendPasswordChangedNotification(
        user.email,
        user.full_name || user.email
      );
      
      showToast('Пароль успешно изменён!', 'success');
      
      // Очищаем форму
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordStrength(0);
      
      onClose();
      
    } catch (err) {
      console.error('Change password error:', err);
      
      let errorMsg = 'Ошибка при смене пароля';
      
      // Обрабатываем различные форматы ошибок
      if (err.response?.data?.detail) {
        // Если detail - это массив ошибок валидации
        if (Array.isArray(err.response.data.detail)) {
          errorMsg = err.response.data.detail.map(d => d.msg || d.message).join(', ');
        } else {
          errorMsg = err.response.data.detail;
        }
      } else if (err.response?.data?.msg) {
        errorMsg = err.response.data.msg;
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2 className="modal-title">Изменение пароля</h2>
        <p className="modal-subtitle">
          Введите текущий пароль и новый пароль
        </p>

        {error && (
          <div className="modal-error">
            <strong>Ошибка:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="modal-field">
            <label className="modal-label">Текущий пароль</label>
            <input
              type="password"
              className="modal-input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Введите текущий пароль"
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Новый пароль</label>
            <input
              type="password"
              className="modal-input"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
              disabled={loading}
              placeholder="Минимум 8 символов"
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

          <div className="modal-field">
            <label className="modal-label">Подтвердите новый пароль</label>
            <input
              type="password"
              className="modal-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Введите пароль еще раз"
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

          <div className="modal-actions">
            <button 
              type="button" 
              className="modal-secondary-btn"
              onClick={onClose}
              disabled={loading}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="modal-primary-btn"
              disabled={loading}
            >
              {loading ? 'Сохранение...' : 'Изменить пароль'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;