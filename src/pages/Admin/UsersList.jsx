// src/pages/UsersList.jsx
import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('thingoo_users');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    alert('Storage cleared. Refresh page to see changes.');
    window.location.reload();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '50px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Зарегистрированные пользователи</h1>
      
      <button 
        onClick={clearStorage}
        style={{
          padding: '10px 20px',
          background: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Очистить всех пользователей
      </button>

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '10px' }}>
        <p><strong>Всего пользователей:</strong> {users.length}</p>
        {users.map(user => (
          <div key={user.id} style={{ 
            border: '1px solid #ddd', 
            padding: '15px', 
            marginBottom: '10px',
            borderRadius: '5px',
            background: 'white'
          }}>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Имя:</strong> {user.fullName || user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Город:</strong> {user.city}</p>
            <p><strong>Создан:</strong> {new Date(user.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersList;