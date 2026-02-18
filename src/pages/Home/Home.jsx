// src/pages/Home/Home.jsx - ОБНОВЛЕННЫЙ
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const galleryItems = [
    {
      id: 1,
      imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      imageUrl: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ];

  return (
    <main className="home">
      <div className="home-inner">
        <section className="hero">
          <h1 className="hero-title">Арендуйте быстро и выгодно</h1>
          <p className="hero-subtitle">
            Вы сможете найти на нашем сайте различные предметы которые сможете
            арендовать или сделать объявление о сдаче в аренду.
          </p>
          <div className="hero-buttons">
            <button 
              className="hero-btn hero-btn-primary"
              onClick={() => navigate('/')}
            >
              Вперед к поискам
            </button>
            <button 
              className="hero-btn hero-btn-secondary"
              onClick={() => navigate('/create-listing')}
            >
              Сделать объявление
            </button>
          </div>
        </section>

        <section className="gallery">
          {galleryItems.map((item, index) => (
            <div key={item.id} className="gallery-item">
              {index === 0 && (
                <div className="gallery-label">{item.title}</div>
              )}
              <div className="gallery-image-wrapper">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="gallery-image"
                />
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

export default Home;