// src/pages/DebugUsers.jsx
import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'thingoo_users'; // Добавляем константу

const DebugUsers = () => {
  const [users, setUsers] = useState([]);
  const [storageContent, setStorageContent] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Загружаем из localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    setStorageContent(stored || '[]');
    
    if (stored) {
      try {
        setUsers(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing users:', e);
        setUsers([]);
      }
    } else {
      setUsers([]);
    }
  };

  const addTestUser = () => {
    const testUser = {
      id: Date.now(),
      fullName: 'Тест Тестович',
      name: 'Тест Тестович',
      email: `test${Date.now()}@test.com`,
      city: 'Москва',
      rating: 0,
      reviewsCount: 0,
      activeListings: 0,
      completedRentals: 0,
      emailVerified: false,
      phoneVerified: false,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      bio: '',
    };
    
    const currentUsers = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newUsers = [...currentUsers, testUser];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsers));
    loadData();
    alert('Тестовый пользователь добавлен!');
  };

  const clearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    loadData();
    alert('Storage cleared!');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(storageContent);
    alert('Скопировано в буфер обмена!');
  };

  return (
    <div style={{ padding: '50px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔍 Отладка пользователей</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button 
          onClick={loadData}
          style={{
            padding: '10px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🔄 Обновить
        </button>
        
        <button 
          onClick={addTestUser}
          style={{
            padding: '10px 20px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ➕ Добавить тестового
        </button>
        
        <button 
          onClick={clearAll}
          style={{
            padding: '10px 20px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🗑️ Очистить всё
        </button>

        <button 
          onClick={copyToClipboard}
          style={{
            padding: '10px 20px',
            background: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          📋 Копировать JSON
        </button>
      </div>

      <div style={{ 
        background: '#f3f4f6', 
        padding: '20px', 
        borderRadius: '10px', 
        marginBottom: '20px' 
      }}>
        <h3>📦 Содержимое localStorage (ключ: {STORAGE_KEY}):</h3>
        <div style={{ 
          background: '#1f2937', 
          color: '#10b981', 
          padding: '15px', 
          borderRadius: '5px',
          overflow: 'auto',
          maxHeight: '300px',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          <pre style={{ margin: 0 }}>
            {JSON.stringify(JSON.parse(storageContent || '[]'), null, 2)}
          </pre>
        </div>
      </div>

      <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '10px' }}>
        <h3>👥 Пользователи ({users.length}):</h3>
        {users.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
            Нет пользователей
          </p>
        ) : (
          users.map(user => (
            <div key={user.id} style={{ 
              background: 'white', 
              padding: '15px', 
              marginBottom: '10px', 
              borderRadius: '5px',
              border: '1px solid #e5e7eb'
            }}>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Имя:</strong> {user.fullName || user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Город:</strong> {user.city}</p>
              <p><strong>Создан:</strong> {new Date(user.createdAt).toLocaleString()}</p>
              <p><strong>Верифицирован:</strong> {user.emailVerified ? '✅' : '❌'}</p>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '20px', background: '#fff3cd', borderRadius: '5px' }}>
        <h4 style={{ color: '#856404', marginBottom: '10px' }}>ℹ️ Инструкция</h4>
        <ol style={{ color: '#856404', marginLeft: '20px' }}>
          <li>Зарегистрируйтесь через модальное окно</li>
          <li>Нажмите "Обновить" чтобы увидеть нового пользователя</li>
          <li>Если пользователь не появился - проверьте консоль браузера (F12)</li>
          <li>Можете добавить тестового пользователя для проверки</li>
          <li>Кнопка "Очистить всё" удалит всех пользователей</li>
        </ol>
      </div>
    </div>
  );
};

export default DebugUsers;