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
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, user, onLoginClick, onRegisterClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Меню для авторизованного пользователя
  const authMenuItems = [
    { id: 'home', label: 'Главная', icon: FaHome, path: '/home' },
    { id: 'catalog', label: 'Каталог', icon: FaHome, path: '/' },
    { id: 'create', label: 'Сдать в аренду', icon: FaPlus, path: '/create-listing' },
    { id: 'my-listings', label: 'Мои объявления', icon: FaList, path: '/my-listings' },
    { id: 'profile', label: 'Профиль', icon: FaUser, path: '/profile' },
    { id: 'settings', label: 'Настройки', icon: FaCog, path: '/settings' },
    { id: 'help', label: 'Помощь', icon: FaQuestionCircle, path: '/help' },
  ];

  // Меню для неавторизованного пользователя
  const guestMenuItems = [
    { id: 'home', label: 'Главная', icon: FaHome, path: '/home' },
    { id: 'catalog', label: 'Каталог', icon: FaHome, path: '/' },
    { id: 'create', label: 'Сдать в аренду', icon: FaPlus, path: '/create-listing' },
    { id: 'help', label: 'Помощь', icon: FaQuestionCircle, path: '/help' },
    { id: 'login', label: 'Войти', icon: FaSignInAlt, action: 'login' },
    { id: 'register', label: 'Регистрация', icon: FaUserPlus, action: 'register' },
  ];

  const menuItems = user ? authMenuItems : guestMenuItems;

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