// src/pages/Settings/Settings.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast/Toast';
import ChangePasswordModal from '../../components/Auth/ChangePasswordModal';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [language, setLanguage] = useState('ru');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    recommendations: false
  });
  
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    try {
      // Здесь можно отправить настройки на бэкенд
      showToast('Настройки успешно сохранены', 'success');
    } catch (error) {
      console.error('Failed to save settings:', error);
      showToast('Ошибка при сохранении настроек', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Настройки</h1>
          <p className="page-subtitle">
            Управляйте уведомлениями, безопасностью и отображением сервиса.
          </p>
        </div>

        <div className="settings-layout">
          <div className="card settings-main">
            <div className="settings-section">
              <h3 className="settings-section-title">Интерфейс</h3>

              <div className="settings-item">
                <div className="settings-item-info">
                  <span className="settings-label">Язык</span>
                  <span className="settings-description">
                    Выберите язык интерфейса сервиса.
                  </span>
                </div>
                <select 
                  className="settings-select" 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div className="settings-section">
              <h3 className="settings-section-title">Уведомления</h3>

              <label className="settings-checkbox">
                <input 
                  type="checkbox" 
                  checked={notifications.email}
                  onChange={() => handleNotificationChange('email')}
                />
                <span className="checkbox-mark" />
                <span className="settings-checkbox-text">
                  Уведомления по email
                </span>
              </label>

              <label className="settings-checkbox">
                <input 
                  type="checkbox" 
                  checked={notifications.push}
                  onChange={() => handleNotificationChange('push')}
                />
                <span className="checkbox-mark" />
                <span className="settings-checkbox-text">
                  Пуш-уведомления о новых сообщениях
                </span>
              </label>

              <label className="settings-checkbox">
                <input 
                  type="checkbox" 
                  checked={notifications.recommendations}
                  onChange={() => handleNotificationChange('recommendations')}
                />
                <span className="checkbox-mark" />
                <span className="settings-checkbox-text">
                  Подборки и рекомендации
                </span>
              </label>
            </div>

            <div className="settings-actions">
              <button 
                className="btn btn-primary"
                onClick={handleSaveSettings}
                disabled={saving}
              >
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
          </div>

          <div className="settings-sidebar-column">
            <div className="card settings-security-card">
              <h3 className="settings-section-title">Безопасность</h3>

              <div className="settings-item inline">
                <div className="settings-item-info">
                  <span className="settings-label">
                    Двухфакторная аутентификация
                  </span>
                  <span className="settings-description">
                    Дополнительный уровень защиты для входа в аккаунт.
                  </span>
                </div>
                <button className="btn btn-secondary btn-small">
                  Настроить
                </button>
              </div>

              <div className="settings-item inline">
                <div className="settings-item-info">
                  <span className="settings-label">Пароль</span>
                  <span className="settings-description">
                    Рекомендуем менять пароль раз в 3–6 месяцев.
                  </span>
                </div>
                <button 
                  className="btn btn-secondary btn-small"
                  onClick={() => setShowChangePasswordModal(true)}
                >
                  Изменить
                </button>
              </div>
            </div>

            <div className="card settings-danger-card">
              <h3 className="settings-section-title">Опасная зона</h3>
              <p className="settings-danger-text">
                Вы можете временно деактивировать аккаунт или навсегда удалить его 
                вместе со всеми данными.
              </p>
              <div className="settings-danger-actions">
                <button className="btn btn-secondary btn-small">
                  Деактивировать
                </button>
                <button className="btn btn-danger btn-small">
                  Удалить аккаунт
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модалка смены пароля */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </div>
  );
};

export default Settings;