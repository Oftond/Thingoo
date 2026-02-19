// src/components/Layout/Layout.jsx - ИСПРАВЛЕННЫЙ
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../Sidebar/Sidebar';
import LoginModal from '../LoginModal';
import RegisterModal from '../RegisterModal';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeSidebar();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const openRegisterModal = () => {
    setShowRegisterModal(true);
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <button
                type="button"
                className="menu-button"
                onClick={toggleSidebar}
                aria-label="Меню"
              >
                ☰
              </button>

              <div className="logo">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/');
                  }}
                >
                  Thingoo
                </a>
              </div>
            </div>

            <div className="header-right">
              <nav className="header-nav">
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => navigate('/home')}
                >
                  Главная
                </button>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => navigate('/')}
                >
                  Каталог
                </button>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => navigate('/create-listing')}
                >
                  Сдать в аренду
                </button>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => navigate('/about')}
                >
                  Как это работает
                </button>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => navigate('/about')}
                >
                  О нас
                </button>
              </nav>

              <div className="header-actions">
                {user ? (
                  <>
                    <span className="user-name">{user.fullName || user.name}</span>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => navigate('/profile')}
                    >
                      Профиль
                    </button>
                    <button
                      type="button"
                      className="btn btn-login"
                      onClick={handleLogout}
                    >
                      Выйти
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={openRegisterModal}
                    >
                      Регистрация
                    </button>
                    <button
                      type="button"
                      className="btn btn-login"
                      onClick={openLoginModal}
                    >
                      Войти
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
        user={user}
        onLoginClick={openLoginModal}
        onRegisterClick={openRegisterModal}
      />

      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/');
                  }}
                >
                  Thingoo
                </a>
              </div>
              <p className="footer-description">
                Платформа для аренды вещей между людьми.
              </p>
            </div>

            <div className="footer-section">
              <h4>Сервис</h4>
              <ul className="footer-links">
                <li><button onClick={() => handleNavigation('/home')}>Главная</button></li>
                <li><button onClick={() => handleNavigation('/about')}>Как это работает</button></li>
                <li><button onClick={() => handleNavigation('/insurance')}>Страхование</button></li>
                <li><button onClick={() => handleNavigation('/help')}>Помощь</button></li>
                <li><button onClick={() => handleNavigation('/contacts')}>Контакты</button></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>О компании</h4>
              <ul className="footer-links">
                <li><button onClick={() => handleNavigation('/about')}>О нас</button></li>
                <li><button onClick={() => handleNavigation('/news')}>Новости</button></li>
                <li><button onClick={() => handleNavigation('/career')}>Карьера</button></li>
                <li><button onClick={() => handleNavigation('/blog')}>Блог</button></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Правовая информация</h4>
              <ul className="footer-links">
                <li><button onClick={() => handleNavigation('/rules')}>Правила</button></li>
                <li><button onClick={() => handleNavigation('/faq')}>FAQ</button></li>
                <li><button onClick={() => handleNavigation('/privacy')}>Политика</button></li>
                <li><button onClick={() => handleNavigation('/terms')}>Соглашение</button></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copyright">
              © {new Date().getFullYear()} Thingoo
            </div>
            <div className="footer-legal">
              <button onClick={() => handleNavigation('/privacy')}>Политика</button>
              <button onClick={() => handleNavigation('/terms')}>Условия</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Модальные окна */}
      {showLoginModal && (
        <LoginModal 
          onClose={closeModals} 
          onSwitchToRegister={switchToRegister}
        />
      )}
      
      {showRegisterModal && (
        <RegisterModal 
          onClose={closeModals} 
          onSwitchToLogin={switchToLogin}
        />
      )}
    </div>
  );
};

export default Layout;