// src/pages/Manager/ManagerDashboard.jsx - УЖЕ ЕСТЬ, НО УБЕДИМСЯ ЧТО ВСЕ ХОРОШО
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Manager.css';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const stats = [
    { label: 'На модерации', value: 12, icon: '⏳' },
    { label: 'Жалобы', value: 3, icon: '⚠️' },
    { label: 'Новые пользователи', value: 28, icon: '👥' },
    { label: 'Спорные аренды', value: 2, icon: '⚖️' }
  ];

  return (
    <div className="manager-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Панель менеджера</h1>
          <p className="page-subtitle">
            Добро пожаловать, {user?.fullName}. Управляйте контентом и решайте спорные ситуации.
          </p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="manager-tasks">
          <h2>Задачи на сегодня</h2>
          <div className="tasks-list">
            <div className="task-item">
              <input type="checkbox" id="task1" />
              <label htmlFor="task1">Проверить новые объявления (5)</label>
            </div>
            <div className="task-item">
              <input type="checkbox" id="task2" />
              <label htmlFor="task2">Ответить на жалобы (2)</label>
            </div>
            <div className="task-item">
              <input type="checkbox" id="task3" />
              <label htmlFor="task3">Связаться с новыми пользователями</label>
            </div>
          </div>
        </div>

        <div className="manager-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/manager/moderate')}
          >
            Перейти к модерации
          </button>
          <button 
            className="btn btn-outline"
            onClick={() => navigate('/manager/reports')}
          >
            Жалобы и споры
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;