import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ManagerRoute from './components/ManagerRoute';
import AnimatedBackground from './components/Background/AnimatedBackground';
import './App.css';

import Layout from './components/Layout/Layout';

import Home from './pages/Home/Home';
import CatalogPage from './pages/CatalogPage/CatalogPage';
import ListingDetailPage from './pages/ListingDetail/ListingDetailPage';
import Help from './pages/Help/Help';
import AboutUs from './pages/AboutUs/AboutUs';
import HowItWorks from './pages/HowItWorks/HowItWorks';

import CreateListingPage from './pages/CreateListing/CreateListingPage';
import MyListings from './pages/MyListings/MyListings';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';

import PaymentPage from './pages/Payment/PaymentPage';
import PaymentSuccess from './pages/Payment/PaymentSuccess';

import AdminDashboard from './pages/Admin/AdminDashboard';
import UsersList from './pages/Admin/UsersList';

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
              <Route index element={<Home />} />
              
              <Route path="catalog" element={<CatalogPage />} />
              <Route path="listing/:id" element={<ListingDetailPage />} />
              <Route path="help" element={<Help />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="how-it-works" element={<HowItWorks />} />
              
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

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;