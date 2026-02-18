// src/services/api.js - ИСПРАВЛЕННЫЙ
import axios from 'axios';

// Замените на ваш реальный URL бекенда
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const itemsAPI = {
  getAll: (params) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  create: (data) => api.post('/items', data),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
  getFeedback: (id) => api.get(`/items/${id}/feedback`),
};

export const rentalRequestsAPI = {
  getAll: () => api.get('/rental-requests'),
  getById: (id) => api.get(`/rental-requests/${id}`),
  create: (data) => api.post('/rental-requests', data),
  update: (id, data) => api.patch(`/rental-requests/${id}`, data),
  approve: (id) => api.patch(`/rental-requests/${id}/approve`),
  getStatus: (id) => api.get(`/rental-requests/${id}/status`),
};

export const paymentsAPI = {
  create: (data) => api.post('/payments', data),
  getById: (id) => api.get(`/payments/${id}`),
  getUserPayments: (userId) => api.get(`/users/${userId}/payments`),
  confirm: (id) => api.patch(`/payments/${id}/confirm`),
};

export const feedbackAPI = {
  create: (data) => api.post('/feedback', data),
  getUserFeedback: (userId) => api.get(`/users/${userId}/feedback`),
  getItemFeedback: (itemId) => api.get(`/items/${itemId}/feedback`),
};

export const notificationsAPI = {
  getUserNotifications: (userId) => api.get(`/users/${userId}/notifications`),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
};

export const mediaAPI = {
  uploadItemPhotos: (itemId, formData) => 
    api.post(`/media/items/${itemId}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getItemPhotos: (itemId) => api.get(`/media/items/${itemId}/photos`),
  getPhoto: (photoId) => api.get(`/media/photos/${photoId}`, { responseType: 'blob' }),
};

export default api;