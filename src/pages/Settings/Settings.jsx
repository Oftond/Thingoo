// src/pages/Settings/Settings.jsx
import React from 'react';
import './Settings.css';

const Settings = () => {
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
                <select className="settings-select" defaultValue="ru">
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            <div className="settings-section">
              <h3 className="settings-section-title">Уведомления</h3>

              <label className="settings-checkbox">
                <input type="checkbox" defaultChecked />
                <span className="checkbox-mark" />
                <span className="settings-checkbox-text">
                  Уведомления по email
                </span>
              </label>

              <label className="settings-checkbox">
                <input type="checkbox" defaultChecked />
                <span className="checkbox-mark" />
                <span className="settings-checkbox-text">
                  Пуш-уведомления о новых сообщениях
                </span>
              </label>

              <label className="settings-checkbox">
                <input type="checkbox" />
                <span className="checkbox-mark" />
                <span className="settings-checkbox-text">
                  Подборки и рекомендации
                </span>
              </label>
            </div>

            <div className="settings-actions">
              <button className="btn btn-primary">Сохранить изменения</button>
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
                <button className="btn btn-secondary btn-small">
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
    </div>
  );
};

export default Settings;