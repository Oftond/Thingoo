import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">Thingoo</div>

        <div className="header-right">
          <nav className="header-nav">
            <a href="#home" className="header-link">
              Главная
            </a>
            <a href="#catalog" className="header-link">
              Каталог
            </a>
            <a href="#how" className="header-link">
              Как работает
            </a>
            <a href="#about" className="header-link">
              О нас
            </a>
          </nav>

          <div className="header-auth">
            <button className="btn btn-outline-light">Войти</button>
            <button className="btn btn-light">Регистрация</button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
