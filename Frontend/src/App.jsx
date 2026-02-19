// src/App.jsx - ПОЛНОСТЬЮ ИСПРАВЛЕННЫЙ
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Импорт Layout
import Layout from './components/Layout/Layout';

// Импорт страниц
import Home from './pages/Home/Home';
import CatalogPage from './pages/CatalogPage/CatalogPage';
import CreateListingPage from './pages/CreateListing/CreateListingPage';
import ListingDetailPage from './pages/ListingDetail/ListingDetailPage';
import MyListings from './pages/MyListings/MyListings';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Help from './pages/Help/Help';
import AboutUs from './pages/AboutUs/AboutUs';

// Страницы-заглушки
const Insurance = () => (
  <div className="page">
    <div className="container">
      <h1 className="page-title">Страхование и залог</h1>
      <p className="page-subtitle">Страница в разработке.</p>
    </div>
  </div>
);

const Contacts = () => (
  <div className="page">
    <div className="container">
      <h1 className="page-title">Контакты</h1>
      <p className="page-subtitle">Страница в разработке.</p>
    </div>
  </div>
);

const News = () => (
  <div className="page">
    <div className="container">
      <h1 className="page-title">Новости</h1>
      <p className="page-subtitle">Страница в разработке.</p>
    </div>
  </div>
);

const Career = () => (
  <div className="page">
    <div className="container">
      <h1 className="page-title">Карьера</h1>
      <p className="page-subtitle">Страница в разработке.</p>
    </div>
  </div>
);

const Blog = () => (
  <div className="page">
    <div className="container">
      <h1 className="page-title">Блог</h1>
      <p className="page-subtitle">Страница в разработке.</p>
    </div>
  </div>
);

const Rules = () => (
  <div className="page">
    <div className="container">
      <h1 className="page-title">Правила сервиса</h1>
      <p className="page-subtitle">Страница в разработке.</p>
    </div>
  </div>
);

const FAQ = () => (
  <div className="page">
    <div className="container">
      <h1 className="page-title">FAQ</h1>
      <p className="page-subtitle">Страница в разработке.</p>
    </div>
  </div>
);

const Privacy = () => (
  <div className="page">
    <div className="container">
      <h1 className="page-title">Политика конфиденциальности</h1>
      <p className="page-subtitle">Страница в разработке.</p>
    </div>
  </div>
);

const Terms = () => (
  <div className="page">
    <div className="container">
      <h1 className="page-title">Пользовательское соглашение</h1>
      <p className="page-subtitle">Страница в разработке.</p>
    </div>
  </div>
);

const NotFound = () => (
  <div className="page">
    <div className="container">
      <div className="not-found">
        <h1 className="page-title">404</h1>
        <p className="page-subtitle">Страница не найдена</p>
        <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
          Вернуться на главную
        </button>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<CatalogPage />} />
            <Route path="home" element={<Home />} />
            <Route path="catalog" element={<CatalogPage />} />
            {/* ВАЖНО: этот маршрут должен быть здесь */}
            <Route path="create-listing" element={<CreateListingPage />} />
            <Route path="listing/:id" element={<ListingDetailPage />} />
            <Route path="my-listings" element={<MyListings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
            <Route path="about" element={<AboutUs />} />
            
            {/* Страницы из футера */}
            <Route path="insurance" element={<Insurance />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="news" element={<News />} />
            <Route path="career" element={<Career />} />
            <Route path="blog" element={<Blog />} />
            <Route path="rules" element={<Rules />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;