// src/services/api.js
import axios from 'axios';

const USE_MOCK = true;
const STORAGE_KEY = 'thingoo_users';

// Загрузка пользователей
const loadUsers = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading users:', e);
  }
  
  // Начальные данные с админом
  const initialUsers = [
    {
      id: 1,
      fullName: 'Администратор',
      name: 'Администратор',
      email: 'admin@thingoo.com',
      city: 'Москва',
      role: 'admin', // Роль администратора
      rating: 5.0,
      reviewsCount: 0,
      activeListings: 0,
      completedRentals: 0,
      emailVerified: true,
      phoneVerified: true,
      twoFactorEnabled: true,
      createdAt: new Date().toISOString(),
      bio: 'Главный администратор системы',
      lastLogin: new Date().toISOString(),
      status: 'active',
      permissions: ['all']
    },
    {
      id: 2,
      fullName: 'Тестовый Пользователь',
      name: 'Тестовый Пользователь',
      email: 'test@test.com',
      city: 'Москва',
      role: 'user',
      rating: 4.8,
      reviewsCount: 15,
      activeListings: 3,
      completedRentals: 7,
      emailVerified: true,
      phoneVerified: false,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      bio: 'Тестовый пользователь',
      lastLogin: new Date().toISOString(),
      status: 'active'
    }
  ];
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUsers));
  return initialUsers;
};

const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

let mockUsers = loadUsers();

// Мок-функции
const mockApi = {
  post: async (url, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (url === '/auth/login') {
      mockUsers = loadUsers();
      const user = mockUsers.find(u => u.email === data.email);
      
      if (user) {
        // В мок-режиме любой пароль подходит
        user.lastLogin = new Date().toISOString();
        saveUsers(mockUsers);
        
        return {
          data: {
            token: 'mock-token-' + user.id + '-' + Date.now(),
            user: { ...user, password: undefined }
          }
        };
      }
      
      throw {
        response: {
          status: 401,
          data: { message: 'Пользователь не найден' }
        }
      };
    }
    
    if (url === '/auth/register') {
      mockUsers = loadUsers();
      
      const existingUser = mockUsers.find(u => u.email === data.email);
      if (existingUser) {
        throw {
          response: {
            status: 400,
            data: { message: 'Пользователь уже существует' }
          }
        };
      }

      const newUser = {
        id: mockUsers.length + 1,
        fullName: data.fullName,
        name: data.fullName,
        email: data.email,
        city: data.city,
        role: 'user', // Обычный пользователь
        rating: 0,
        reviewsCount: 0,
        activeListings: 0,
        completedRentals: 0,
        emailVerified: false,
        phoneVerified: false,
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        status: 'active',
        bio: '',
        passportData: data.passportData
      };
      
      mockUsers.push(newUser);
      saveUsers(mockUsers);
      
      return {
        data: {
          token: 'mock-token-' + newUser.id + '-' + Date.now(),
          user: { ...newUser, password: undefined }
        }
      };
    }
    
    return { data: { success: true } };
  },
  
  get: async (url) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockUsers = loadUsers();
    
    if (url === '/admin/users') {
      return { data: mockUsers };
    }
    
    if (url.startsWith('/admin/users/')) {
      const id = parseInt(url.split('/')[3]);
      const user = mockUsers.find(u => u.id === id);
      return { data: user };
    }
    
    if (url.startsWith('/users/')) {
      const id = parseInt(url.split('/')[2]);
      const user = mockUsers.find(u => u.id === id);
      return { data: user };
    }
    
    return { data: mockUsers };
  },
  
  put: async (url, data) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockUsers = loadUsers();
    
    if (url.startsWith('/admin/users/')) {
      const id = parseInt(url.split('/')[3]);
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
        saveUsers(mockUsers);
        return { data: mockUsers[userIndex] };
      }
    }
    
    return { data };
  },
  
  delete: async (url) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockUsers = loadUsers();
    
    if (url.startsWith('/admin/users/')) {
      const id = parseInt(url.split('/')[3]);
      const userIndex = mockUsers.findIndex(u => u.id === id);
      if (userIndex !== -1) {
        const deletedUser = mockUsers[userIndex];
        mockUsers.splice(userIndex, 1);
        saveUsers(mockUsers);
        return { data: deletedUser };
      }
    }
    
    throw { response: { status: 404, data: { message: 'User not found' } } };
  }
};

// Реальное API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const realApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

realApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const api = USE_MOCK ? mockApi : realApi;

// Обновленные API с админскими методами
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put ? api.put(`/users/${id}`, data) : Promise.resolve({ data }),
};

export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getStats: () => api.get('/admin/stats'),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const itemsAPI = {
  getAll: (params) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  create: (data) => api.post('/items', data),
  getUserItems: (userId) => api.get(`/users/${userId}/items`),
};

export const mediaAPI = {
  uploadItemPhotos: (itemId, formData) => 
    api.post(`/media/items/${itemId}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getItemPhotos: (itemId) => api.get(`/media/items/${itemId}/photos`),
};

export default api;