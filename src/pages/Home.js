import React, { useEffect, useState } from "react";
import "./Home.css";
import { getItemPhotosMeta, getPhotoUrl } from "../api/media";

function Home() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadGallery() {
      try {
        // допустим, для главной у тебя item_id = 1
        const meta = await getItemPhotosMeta(1);

        // ожидаем, что meta = [{ id, title?, photo_id }, ...]
        const normalized = meta.map((m) => ({
          id: m.id,
          title: m.title || "Изображение",
          imageUrl: getPhotoUrl(m.photo_id),
        }));

        if (alive) {
          setGalleryItems(normalized);
        }
      } catch (e) {
        console.error("Ошибка загрузки изображений", e);
        if (alive) {
          setError("Не удалось загрузить изображения");
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    loadGallery();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <main id="home" className="home">
      <div className="home-inner">
        {/* HERO как был */}
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

        {/* Галерея с картинками из бэка */}
        <section id="catalog" className="gallery">
          {loading && (
            <div className="gallery-loading">Загрузка изображений...</div>
          )}

          {error && !loading && (
            <div className="gallery-error">{error}</div>
          )}

          {!loading &&
            !error &&
            galleryItems.map((item, index) => (
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
