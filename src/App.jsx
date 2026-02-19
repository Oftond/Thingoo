// src/App.jsx - ОБНОВЛЕННЫЙ
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ManagerRoute from './components/ManagerRoute';
import AnimatedBackground from './components/Background/AnimatedBackground';
import './App.css';

// Layout
import Layout from './components/Layout/Layout';

// Публичные страницы
import Home from './pages/Home/Home';
import CatalogPage from './pages/CatalogPage/CatalogPage';
import ListingDetailPage from './pages/ListingDetail/ListingDetailPage';
import Help from './pages/Help/Help';
import AboutUs from './pages/AboutUs/AboutUs';
import HowItWorks from './pages/HowItWorks/HowItWorks';

// Защищенные страницы
import CreateListingPage from './pages/CreateListing/CreateListingPage';
import MyListings from './pages/MyListings/MyListings';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';

// Страницы оплаты
import PaymentPage from './pages/Payment/PaymentPage';
import PaymentSuccess from './pages/Payment/PaymentSuccess';

// Админ-страницы
import AdminDashboard from './pages/Admin/AdminDashboard';
import UsersList from './pages/Admin/UsersList';

// Менеджер-страницы
import ManagerDashboard from './pages/Manager/ManagerDashboard';
import ModeratorQueue from './pages/Manager/ModeratorQueue';

const NotFound = () => (
  <div className="page">
    <div className="container">
      <div className="not-found">
        <h1>404</h1>
        <p>Страница не найдена</p>
        <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
          На главную
        </button>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <AnimatedBackground />
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Главная страница */}
              <Route index element={<Home />} />
              
              {/* Публичные маршруты */}
              <Route path="catalog" element={<CatalogPage />} />
              <Route path="listing/:id" element={<ListingDetailPage />} />
              <Route path="help" element={<Help />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="how-it-works" element={<HowItWorks />} />
              
              {/* Защищенные маршруты */}
              <Route path="create-listing" element={
                <ProtectedRoute>
                  <CreateListingPage />
                </ProtectedRoute>
              } />
              <Route path="my-listings" element={
                <ProtectedRoute>
                  <MyListings />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              {/* Страницы оплаты */}
              <Route path="payment/:id" element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              } />
              <Route path="payment/success" element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              } />
              
              {/* Админ-маршруты */}
              <Route path="admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="admin/users" element={
                <AdminRoute>
                  <UsersList />
                </AdminRoute>
              } />
              
              {/* Менеджер-маршруты */}
              <Route path="manager" element={
                <ManagerRoute>
                  <ManagerDashboard />
                </ManagerRoute>
              } />
              <Route path="manager/moderate" element={
                <ManagerRoute>
                  <ModeratorQueue />
                </ManagerRoute>
              } />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;