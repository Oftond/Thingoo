// src/components/Header.js
import React from "react";
import "./Header.css";

function Header({ onNavigate, onLoginClick, onRegisterClick }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div
          className="header-logo"
          onClick={() => onNavigate && onNavigate("home")}
          style={{ cursor: "pointer" }}
        >
          Thingoo
        </div>

        <div className="header-right">
          <nav className="header-nav">
            <button
              className="header-link header-link-btn"
              onClick={() => onNavigate && onNavigate("home")}
            >
              Главная
            </button>
            <button
              className="header-link header-link-btn"
              onClick={() => onNavigate && onNavigate("home")}
            >
              Каталог
            </button>
            <button
              className="header-link header-link-btn"
              onClick={() => onNavigate && onNavigate("home")}
            >
              Как работает
            </button>
            <button
              className="header-link header-link-btn"
              onClick={() => onNavigate && onNavigate("about")}
            >
              О нас
            </button>
          </nav>

          <div className="header-auth">
            <button
              className="btn btn-outline-light"
              onClick={onLoginClick}
            >
              Войти
            </button>
            <button
              className="btn btn-light"
              onClick={onRegisterClick}
            >
              Регистрация
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
