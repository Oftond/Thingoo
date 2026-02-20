// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI, usersAPI } from '../../services/api'; // Импорты работают
import './Admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      let usersData = [];
      try {
        const response = await adminAPI.getAllUsers();
        usersData = response.data || [];
      } catch (error) {
        console.log('Admin API not available, using usersAPI');
        const response = await usersAPI.getAll();
        usersData = response.data || [];
      }
      
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await adminAPI.deleteUser(userId);
        await loadData();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Ошибка при удалении пользователя');
      }
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Панель администратора</h1>
          <p className="page-subtitle">
            Добро пожаловать, {user?.full_name || user?.fullName || 'Администратор'}
          </p>
        </div>

        <div className="users-table-container">
          <h2>Управление пользователями</h2>
          {users.length === 0 ? (
            <p>Нет пользователей для отображения</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имя</th>
                  <th>Email</th>
                  <th>Город</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem) => (
                  <tr key={userItem.id || Math.random()}>
                    <td>#{userItem.id?.slice(0, 8) || userItem.id}</td>
                    <td>{userItem.full_name || userItem.fullName || 'Без имени'}</td>
                    <td>{userItem.email}</td>
                    <td>{userItem.city || '—'}</td>
                    <td>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteUser(userItem.id)}
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;