// src/components/ManagerRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ManagerRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== 'manager' && user.role !== 'admin') {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ManagerRoute;