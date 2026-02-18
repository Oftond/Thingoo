// src/pages/MyListings/MyListings.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MyListings.css';

const MyListings = () => {
  const navigate = useNavigate();

  const goToCreateListing = () => {
    navigate('/create-listing');
  };

  return (
    <div className="my-listings-page">
      <main className="main-content">
        <div className="container">
          <div className="page-header">
            <h1>Мои объявления</h1>
            <p>
              Здесь будут все вещи, которые вы сдаёте в аренду.
              Управляйте ценами, статусом и бронированиями в одном месте.
            </p>
          </div>

          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h2>У вас пока нет объявлений</h2>
            <p>
              Создайте первое объявление, чтобы начать зарабатывать
              на вещах, которые простаивают без дела.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={goToCreateListing}
            >
              Создать объявление
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyListings;