// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    totalListings: 0,
    totalRentals: 0
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const usersResponse = await adminAPI.getAllUsers();
      setUsers(usersResponse.data);
      
      // Подсчет статистики
      setStats({
        totalUsers: usersResponse.data.length,
        activeToday: usersResponse.data.filter(u => {
          const lastLogin = new Date(u.lastLogin || u.createdAt);
          const today = new Date();
          return lastLogin.toDateString() === today.toDateString();
        }).length,
        totalListings: usersResponse.data.reduce((acc, u) => acc + (u.activeListings || 0), 0),
        totalRentals: usersResponse.data.reduce((acc, u) => acc + (u.completedRentals || 0), 0)
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser({ ...user });
    setShowEditModal(true);
  };

  const handleSaveUser = async () => {
    try {
      await adminAPI.updateUser(selectedUser.id, selectedUser);
      await loadData();
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await adminAPI.deleteUser(userId);
        await loadData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleToggleBlock = async (user) => {
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    try {
      await adminAPI.updateUser(user.id, { ...user, status: newStatus });
      await loadData();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <div className="loading">Загрузка панели администратора...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <h1 className="admin-title">Панель администратора</h1>
          <p className="admin-subtitle">
            Добро пожаловать, {user?.fullName}. Управляйте пользователями и системой.
          </p>
        </div>

        {/* Статистика */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalUsers}</span>
              <span className="stat-label">Всего пользователей</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <span className="stat-value">{stats.activeToday}</span>
              <span className="stat-label">Активны сегодня</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalListings}</span>
              <span className="stat-label">Активных объявлений</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-info">
              <span className="stat-value">{stats.totalRentals}</span>
              <span className="stat-label">Завершенных аренд</span>
            </div>
          </div>
        </div>

        {/* Фильтры и поиск */}
        <div className="admin-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Поиск по имени, email или городу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filterRole === 'all' ? 'active' : ''}`}
              onClick={() => setFilterRole('all')}
            >
              Все
            </button>
            <button 
              className={`filter-tab ${filterRole === 'admin' ? 'active' : ''}`}
              onClick={() => setFilterRole('admin')}
            >
              Администраторы
            </button>
            <button 
              className={`filter-tab ${filterRole === 'user' ? 'active' : ''}`}
              onClick={() => setFilterRole('user')}
            >
              Пользователи
            </button>
          </div>
        </div>

        {/* Таблица пользователей */}
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Пользователь</th>
                <th>Email</th>
                <th>Город</th>
                <th>Роль</th>
                <th>Статус</th>
                <th>Активность</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className={user.status === 'blocked' ? 'blocked' : ''}>
                  <td>#{user.id}</td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar-small">
                        {user.fullName?.[0] || user.name?.[0]}
                      </div>
                      <div>
                        <div className="user-name">{user.fullName || user.name}</div>
                        <div className="user-meta">
                          📊 {user.completedRentals || 0} аренд
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.city || '—'}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role === 'admin' ? 'Админ' : 'Пользователь'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${user.status || 'active'}`}>
                      {user.status === 'blocked' ? 'Заблокирован' : 'Активен'}
                    </span>
                  </td>
                  <td>
                    <div className="activity-info">
                      <div>📅 {new Date(user.createdAt).toLocaleDateString()}</div>
                      {user.lastLogin && (
                        <div className="last-login">
                          Последний вход: {new Date(user.lastLogin).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn edit"
                        onClick={() => handleEditUser(user)}
                        title="Редактировать"
                      >
                        ✏️
                      </button>
                      <button
                        className={`action-btn ${user.status === 'blocked' ? 'unblock' : 'block'}`}
                        onClick={() => handleToggleBlock(user)}
                        title={user.status === 'blocked' ? 'Разблокировать' : 'Заблокировать'}
                      >
                        {user.status === 'blocked' ? '🔓' : '🔒'}
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Модальное окно редактирования */}
        {showEditModal && selectedUser && (
          <div className="modal-backdrop" onClick={() => setShowEditModal(false)}>
            <div className="modal-content admin-modal" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title">Редактирование пользователя</h2>
              
              <div className="form-group">
                <label>Имя</label>
                <input
                  type="text"
                  value={selectedUser.fullName || ''}
                  onChange={e => setSelectedUser({ ...selectedUser, fullName: e.target.value })}
                  className="modal-input"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={selectedUser.email || ''}
                  onChange={e => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  className="modal-input"
                />
              </div>

              <div className="form-group">
                <label>Город</label>
                <input
                  type="text"
                  value={selectedUser.city || ''}
                  onChange={e => setSelectedUser({ ...selectedUser, city: e.target.value })}
                  className="modal-input"
                />
              </div>

              <div className="form-group">
                <label>Роль</label>
                <select
                  value={selectedUser.role || 'user'}
                  onChange={e => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  className="modal-input"
                >
                  <option value="user">Пользователь</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>

              <div className="form-group">
                <label>Статус</label>
                <select
                  value={selectedUser.status || 'active'}
                  onChange={e => setSelectedUser({ ...selectedUser, status: e.target.value })}
                  className="modal-input"
                >
                  <option value="active">Активен</option>
                  <option value="blocked">Заблокирован</option>
                </select>
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowEditModal(false)}>
                  Отмена
                </button>
                <button className="btn-primary" onClick={handleSaveUser}>
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;