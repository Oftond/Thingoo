// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

console.log('🔧 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  console.log('🚀 Request:', {
    method: config.method?.toUpperCase(),
    url: config.baseURL + config.url,
    data: config.data,
    headers: config.headers
  });
  
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ===== АУТЕНТИФИКАЦИЯ =====
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// ===== ПОЛЬЗОВАТЕЛИ =====
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  changePassword: (id, data) => api.post(`/users/${id}/change-password`, data),
};

// ===== АДМИНКА =====
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getStats: () => api.get('/admin/stats'),
};

// ===== ТОВАРЫ (ОБЪЯВЛЕНИЯ) - ЭТО НУЖНО ДЛЯ CreateListingPage =====
export const itemsAPI = {
  getAll: (params) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  create: (data) => api.post('/items', data),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
  getUserItems: (userId) => api.get(`/items/users/${userId}`),
  getFeedback: (id) => api.get(`/items/${id}/feedback`),
};

// ===== МЕДИА (ФОТО) - ЭТО НУЖНО ДЛЯ CreateListingPage =====
export const mediaAPI = {
  uploadItemPhotos: async (itemId, formData, config = {}) => {
    try {
      const response = await api.post(`/media/items/${itemId}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...config,
      });
      return response;
    } catch (error) {
      console.error('Error uploading photos:', error);
      throw error;
    }
  },
  getItemPhotos: (itemId) => api.get(`/media/items/${itemId}/photos`),
  // ВАЖНО: получаем фото как blob и создаем URL
  getPhoto: async (photoId) => {
    try {
      const response = await api.get(`/media/photos/${photoId}`, { 
        responseType: 'blob',
        // Не добавляем Content-Type для blob запросов
        headers: {}
      });
      
      // Создаем URL из blob
      const url = URL.createObjectURL(response.data);
      return { url, blob: response.data };
    } catch (error) {
      console.error('Error getting photo:', error);
      throw error;
    }
  },
  
  // Получаем фото напрямую через fetch (альтернативный метод)
  getPhotoUrl: (photoId) => {
    return `${API_BASE_URL}/media/photos/${photoId}`;
  },
  deletePhoto: (photoId) => api.delete(`/media/photos/${photoId}`),
};

// ===== ЗАПРОСЫ НА АРЕНДУ =====
export const rentalRequestsAPI = {
  getAll: () => api.get('/rental-requests'),
  getById: (id) => api.get(`/rental-requests/${id}`),
  create: (data) => api.post('/rental-requests', data),
  update: (id, data) => api.patch(`/rental-requests/${id}`, data),
  approve: (id) => api.patch(`/rental-requests/${id}/approve`),
  getStatus: (id) => api.get(`/rental-requests/${id}/status`),
};

// ===== ПЛАТЕЖИ =====
export const paymentsAPI = {
  create: (data) => api.post('/payments', data),
  getById: (id) => api.get(`/payments/${id}`),
  getUserPayments: (userId) => api.get(`/users/${userId}/payments`),
  confirm: (id) => api.patch(`/payments/${id}/confirm`),
};

// ===== ОТЗЫВЫ =====
export const feedbackAPI = {
  create: (data) => api.post('/feedback', data),
  getUserFeedback: (userId) => api.get(`/users/${userId}/feedback`),
  getItemFeedback: (itemId) => api.get(`/items/${itemId}/feedback`),
};

// ===== УВЕДОМЛЕНИЯ =====
export const notificationsAPI = {
  getUserNotifications: (userId) => api.get(`/users/${userId}/notifications`),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
};

export default api;