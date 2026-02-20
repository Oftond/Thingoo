// src/pages/Manager/ModeratorQueue.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Manager.css';

const pendingItems = [
    {
      id: 1,
      title: 'Sony Alpha 7 III',
      owner: 'Иван Петров',
      submittedAt: '2024-01-20T10:30:00',
      category: 'electronics',
      price: 1200,
      status: 'pending'
    },
    {
      id: 2,
      title: 'Горный велосипед Trek',
      owner: 'Анна Смирнова',
      submittedAt: '2024-01-20T09:15:00',
      category: 'sports',
      price: 800,
      status: 'pending'
    },
    {
      id: 3,
      title: 'Дрель Bosch Professional',
      owner: 'Петр Сидоров',
      submittedAt: '2024-01-19T16:45:00',
      category: 'tools',
      price: 450,
      status: 'pending'
    }
  ];

const reportedItems = [
    {
      id: 4,
      title: 'Ноутбук MacBook Pro',
      owner: 'Дмитрий Козлов',
      reporter: 'Елена Н.',
      reason: 'Несоответствие описанию',
      reportedAt: '2024-01-20T11:20:00',
      status: 'reported'
    }
  ];

const ModeratorQueue = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');

  const handleApprove = (itemId) => {
    console.log('Approved item:', itemId);
    // Здесь будет API вызов
  };

  const handleReject = (itemId) => {
    console.log('Rejected item:', itemId);
    // Здесь будет API вызов
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="manager-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Модерация объявлений</h1>
          <p className="page-subtitle">
            Проверка и управление объявлениями пользователей
          </p>
        </div>

        <div className="moderation-tabs">
          <button 
            className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            На проверке ({pendingItems.length})
          </button>
          <button 
            className={`tab ${activeTab === 'reported' ? 'active' : ''}`}
            onClick={() => setActiveTab('reported')}
          >
            Жалобы ({reportedItems.length})
          </button>
          <button 
            className={`tab ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Одобренные
          </button>
        </div>

        <div className="moderation-queue">
          {activeTab === 'pending' && (
            <div className="items-list">
              {pendingItems.map(item => (
                <div key={item.id} className="moderation-item">
                  <div className="item-header">
                    <h3>{item.title}</h3>
                    <span className="item-category">{item.category}</span>
                  </div>
                  
                  <div className="item-details">
                    <div className="detail-row">
                      <span className="detail-label">Владелец:</span>
                      <span>{item.owner}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Цена:</span>
                      <span>{item.price} ₽/день</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Получено:</span>
                      <span>{formatDate(item.submittedAt)}</span>
                    </div>
                  </div>

                  <div className="item-actions">
                    <button 
                      className="btn btn-primary btn-small"
                      onClick={() => handleApprove(item.id)}
                    >
                      ✓ Одобрить
                    </button>
                    <button 
                      className="btn btn-outline btn-small"
                      onClick={() => handleReject(item.id)}
                    >
                      ✗ Отклонить
                    </button>
                    <button className="btn btn-secondary btn-small">
                      👁️ Просмотр
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reported' && (
            <div className="items-list">
              {reportedItems.map(item => (
                <div key={item.id} className="moderation-item reported">
                  <div className="item-header">
                    <h3>{item.title}</h3>
                    <span className="item-category">{item.category}</span>
                  </div>
                  
                  <div className="item-details">
                    <div className="detail-row">
                      <span className="detail-label">Владелец:</span>
                      <span>{item.owner}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Пожаловался:</span>
                      <span>{item.reporter}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Причина:</span>
                      <span className="report-reason">{item.reason}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Дата:</span>
                      <span>{formatDate(item.reportedAt)}</span>
                    </div>
                  </div>

                  <div className="item-actions">
                    <button className="btn btn-primary btn-small">
                      ✓ Оставить
                    </button>
                    <button className="btn btn-outline btn-small">
                      ✗ Удалить
                    </button>
                    <button className="btn btn-warning btn-small">
                      ⚠️ Предупредить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'approved' && (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <h3>Здесь будут одобренные объявления</h3>
              <p>Объявления, прошедшие модерацию, появятся здесь</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorQueue;