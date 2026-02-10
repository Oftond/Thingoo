import React from "react";
import "./Home.css";

const heroImages = [
  {
    id: 1,
    title: "Игровые приставки",
    src: "https://via.placeholder.com/260x260?text=1",
  },
  { id: 2, src: "https://via.placeholder.com/260x260?text=2" },
  { id: 3, src: "https://via.placeholder.com/260x260?text=3" },
  { id: 4, src: "https://via.placeholder.com/260x260?text=4" },
];

function Home() {
  return (
    <main id="home" className="home">
      <div className="home-inner">
        <section className="hero">
          <h1 className="hero-title">Арендуйте быстро и выгодно</h1>

          <p className="hero-subtitle">
            Вы сможете найти на нашем сайте различные предметы которые сможете
            арендовать или сделать объявление о сдаче в аренду.
          </p>

          <div className="hero-buttons">
            <button className="hero-btn hero-btn-primary">
              Вперед к поискам
            </button>
            <button className="hero-btn hero-btn-secondary">
              Сделать объявление
            </button>
          </div>
        </section>

        <section id="catalog" className="gallery">
          {heroImages.map((item, index) => (
            <div key={item.id} className="gallery-item">
              {index === 0 && (
                <div className="gallery-label">Игровые приставки</div>
              )}
              <div className="gallery-image-wrapper">
                <img
                  src={item.src}
                  alt={item.title || `Изображение ${item.id}`}
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
