// src/components/Layout/Layout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../Sidebar/Sidebar';
import LoginModal from '../Auth/LoginModal';
import RegisterModal from '../Auth/RegisterModal';
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
                  onClick={() => navigate('/')}
                >
                  Главная
                </button>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => navigate('/catalog')}
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
                  О нас
                </button>
                <button
                  type="button"
                  className="nav-link"
                  onClick={() => navigate('/how-it-works')}
                >
                  Как работает
                </button>
              </nav>

              <div className="header-actions">
                {user ? (
                  <>
                    <button
                      type="button"
                      className="user-name-btn"
                      onClick={() => navigate('/profile')}
                    >
                      <span className="user-name">{user.fullName || user.name}</span>
                      {user.role === 'admin' && (
                        <span className="admin-badge">Admin</span>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => navigate('/profile')}
                    >
                      Профиль
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-register"
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
        onLogout={handleLogout}
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
            </div>

            <div className="footer-section">
              <ul className="footer-links">
                <li><button onClick={() => handleNavigation('/how-it-works')}>Как это работает</button></li>
                <li><button onClick={() => handleNavigation('/about')}>О нас</button></li>
                <li><button onClick={() => handleNavigation('/help')}>Помощь</button></li>
              </ul>
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