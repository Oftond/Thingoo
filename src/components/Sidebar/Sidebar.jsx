// src/components/Sidebar/Sidebar.jsx - ИСПРАВЛЕННЫЙ
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaPlus,
  FaList,
  FaCog,
  FaQuestionCircle,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaShieldAlt, // Иконка для админ-панели
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, user, onLoginClick, onRegisterClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Базовые пункты меню для авторизованного пользователя
  const baseAuthMenuItems = [
    { id: 'home', label: 'Главная', icon: FaHome, path: '/' },
    { id: 'catalog', label: 'Каталог', icon: FaHome, path: '/catalog' },
    { id: 'create', label: 'Сдать в аренду', icon: FaPlus, path: '/create-listing' },
    { id: 'my-listings', label: 'Мои объявления', icon: FaList, path: '/my-listings' },
    { id: 'profile', label: 'Профиль', icon: FaUser, path: '/profile' },
    { id: 'settings', label: 'Настройки', icon: FaCog, path: '/settings' },
    { id: 'help', label: 'Помощь', icon: FaQuestionCircle, path: '/help' },
  ];

  // Пункты меню для гостей
  const guestMenuItems = [
    { id: 'home', label: 'Главная', icon: FaHome, path: '/' },
    { id: 'catalog', label: 'Каталог', icon: FaHome, path: '/catalog' },
    { id: 'create', label: 'Сдать в аренду', icon: FaPlus, path: '/create-listing' },
    { id: 'help', label: 'Помощь', icon: FaQuestionCircle, path: '/help' },
    { id: 'login', label: 'Войти', icon: FaSignInAlt, action: 'login' },
    { id: 'register', label: 'Регистрация', icon: FaUserPlus, action: 'register' },
  ];

  // Формируем меню для авторизованного пользователя (с учетом админа)
  const getAuthMenuItems = () => {
    const items = [...baseAuthMenuItems];
    
    // Добавляем пункт для админа, если пользователь администратор
    if (user?.role === 'admin') {
      items.splice(2, 0, { // Вставляем после 'catalog'
        id: 'admin',
        label: 'Админ панель',
        icon: FaShieldAlt,
        path: '/admin'
      });
    }
    
    return items;
  };

  const menuItems = user ? getAuthMenuItems() : guestMenuItems;

  const handleItemClick = (item) => {
    if (item.action === 'login') {
      onLoginClick();
    } else if (item.action === 'register') {
      onRegisterClick();
    } else {
      navigate(item.path);
    }
    onClose();
  };

  const isActive = (item) => {
    if (item.path) {
      return location.pathname === item.path;
    }
    return false;
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">T</div>
          <span className="logo-text">Thingoo</span>
        </div>
        <button
          type="button"
          className="sidebar-close"
          onClick={onClose}
          aria-label="Закрыть меню"
        >
          ×
        </button>
      </div>

      {user && (
        <div className="sidebar-user">
          <div className="user-avatar">
            {user.fullName?.[0] || user.name?.[0] || 'U'}
          </div>
          <div className="user-info">
            <div className="user-name">{user.fullName || user.name}</div>
            <div className="user-email">{user.email}</div>
            {user.role === 'admin' && (
              <div className="user-role">Администратор</div>
            )}
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);

            return (
              <li
                key={item.id}
                className={`nav-item ${active ? 'active' : ''}`}
              >
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => handleItemClick(item)}
                >
                  <span className="nav-icon">
                    <Icon />
                  </span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <span className="version-text">Версия 1.0</span>
      </div>
    </aside>
  );
};

export default Sidebar;