// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';
import notificationService from '../services/notificationService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Функция для проверки админа
const checkIsAdmin = (user) => {
  if (!user) return false;
  
  // Проверяем различные варианты хранения роли
  const role = user.role || user.role_name || (user.role && user.role.name);
  console.log('Checking admin status for user:', user.email, 'Role:', role);
  
  // Проверяем разные варианты значения админа
  console.log(role);
  return role.name === 'ADMIN';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Добавляем состояние isAdmin

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAdmin(checkIsAdmin(parsedUser)); // Устанавливаем isAdmin при загрузке
        console.log('User loaded from localStorage, isAdmin:', checkIsAdmin(parsedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const userData = response.data.user;

    setUser(userData);
    setIsAdmin(checkIsAdmin(userData)); // Устанавливаем isAdmin при входе
    localStorage.setItem('user', JSON.stringify(userData));
    
    console.log('User logged in:', userData.email, 'isAdmin:', checkIsAdmin(userData));
    return { success: true };
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      notificationService.sendWelcomeEmail({
        email: userData.email,
        full_name: userData.full_name
      }).catch(err => console.warn('Welcome email failed:', err));
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  // Для отладки - логируем текущее состояние
  useEffect(() => {
    console.log('Auth state updated - isAdmin:', isAdmin, 'user:', user?.email);
  }, [isAdmin, user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading, 
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};