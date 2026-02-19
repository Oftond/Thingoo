// src/pages/Profile/Profile.jsx - ОБНОВЛЕННЫЙ
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.fullName || user?.name || '',
    city: user?.city || '',
    bio: user?.bio || '',
  });
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="page">
        <div className="container">
          <div className="not-authorized">
            <h2>Необходима авторизация</h2>
            <p>Пожалуйста, войдите в систему чтобы просматривать профиль</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    const result = await updateUser({
      fullName: formData.name,
      name: formData.name,
      city: formData.city,
      bio: formData.bio,
    });
    if (result.success) {
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user.fullName || user.name,
      city: user.city,
      bio: user.bio,
    });
    setIsEditing(false);
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleVerifyPhone = async () => {
    alert('Функция подтверждения телефона будет доступна скоро');
  };

  const handleEnable2FA = async () => {
    alert('Функция двухфакторной аутентификации будет доступна скоро');
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Профиль</h1>
          <p className="page-subtitle">
            Управляйте своими данными, доверием и репутацией на Thingoo.
          </p>
        </div>

        <div className="profile-layout">
          <div className="card profile-main">
            <div className="profile-header">
              <div className="profile-avatar">
                <span>{user.fullName?.[0] || user.name?.[0] || 'U'}</span>
              </div>
              <div className="profile-header-info">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="profile-name-input"
                    placeholder="Ваше имя"
                  />
                ) : (
                  <div className="profile-name-wrapper">
                    <h2 className="profile-name">{user.fullName || user.name}</h2>
                    {user.role === 'admin' && (
                      <span className="profile-role-badge">Администратор</span>
                    )}
                  </div>
                )}
                <div className="profile-meta-row">
                  {isEditing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="profile-city-input"
                      placeholder="Ваш город"
                    />
                  ) : (
                    <span className="profile-city">📍 {user.city || 'Город не указан'}</span>
                  )}
                  <span className="tag">
                    ⭐ {user.rating || '0'} · {user.reviewsCount || 0} отзывов
                  </span>
                  <span className="tag">
                    На платформе с {user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'} года
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3 className="profile-section-title">О себе</h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="profile-bio-input"
                  placeholder="Расскажите о себе..."
                  rows="4"
                />
              ) : (
                <p className="profile-section-text">
                  {user.bio || 'Здесь может быть краткое описание: какие вещи вы обычно сдаёте, насколько быстро отвечаете и какие условия для вас важны.'}
                </p>
              )}
            </div>

            <div className="profile-actions">
              {isEditing ? (
                <>
                  <button 
                    className="btn btn-primary"
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    {loading ? 'Сохранение...' : 'Сохранить'}
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={handleCancelEdit}
                  >
                    Отмена
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="btn btn-primary"
                    onClick={handleEditProfile}
                  >
                    Редактировать профиль
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={handleSettings}
                  >
                    Настройки аккаунта
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="profile-sidebar-column">
            <div className="card profile-stats-card">
              <h3 className="profile-section-title">Статистика</h3>
              <div className="profile-stats-grid">
                <div className="profile-stat">
                  <span className="profile-stat-label">Активные объявления</span>
                  <span className="profile-stat-value">{user.activeListings || 0}</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-label">Успешные аренды</span>
                  <span className="profile-stat-value">{user.completedRentals || 0}</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-label">Процент ответа</span>
                  <span className="profile-stat-value">{user.responseRate || '98%'}</span>
                </div>
                <div className="profile-stat">
                  <span className="profile-stat-label">Среднее время ответа</span>
                  <span className="profile-stat-value">{user.responseTime || '15 мин'}</span>
                </div>
              </div>
            </div>

            <div className="card profile-security-card">
              <h3 className="profile-section-title">Безопасность</h3>
              <ul className="profile-security-list">
                <li className="profile-security-item">
                  <span>Почта подтверждена</span>
                  <span className="profile-security-status success">
                    {user.emailVerified ? '✓' : '✗'}
                  </span>
                </li>
                <li className="profile-security-item">
                  <span>Телефон</span>
                  {user.phoneVerified ? (
                    <span className="profile-security-status success">✓</span>
                  ) : (
                    <button 
                      className="btn btn-secondary btn-small"
                      onClick={handleVerifyPhone}
                    >
                      Подтвердить
                    </button>
                  )}
                </li>
                <li className="profile-security-item">
                  <span>Двухфакторная аутентификация</span>
                  {user.twoFactorEnabled ? (
                    <span className="profile-security-status success">✓</span>
                  ) : (
                    <button 
                      className="btn btn-secondary btn-small"
                      onClick={handleEnable2FA}
                    >
                      Включить
                    </button>
                  )}
                </li>
              </ul>
            </div>

            {/* Кнопка выхода */}
            <div className="card profile-logout-card">
              <button 
                className="btn btn-logout btn-block"
                onClick={handleLogout}
              >
                🚪 Выйти из аккаунта
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;