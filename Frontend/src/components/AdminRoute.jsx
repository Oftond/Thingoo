// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  // Добавим отладку
  console.log('AdminRoute - user:', user?.email, 'isAdmin:', isAdmin, 'loading:', loading);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  // Если пользователь не авторизован
  if (!user) {
    console.log('AdminRoute - user not authenticated, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // Если пользователь не администратор
  if (!isAdmin) {
    console.log('AdminRoute - user is not admin, redirecting to profile');
    return <Navigate to="/profile" replace />;
  }

  // Если всё хорошо - показываем контент
  console.log('AdminRoute - access granted to admin:', user.email);
  return children;
};

export default AdminRoute;