// src/components/AuthModal.jsx
import React, { useState } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);

  if (!isOpen) return null;

  const switchToLogin = () => setMode('login');
  const switchToRegister = () => setMode('register');

  return (
    <>
      {mode === 'login' ? (
        <LoginModal 
          onClose={onClose} 
          onSwitchToRegister={switchToRegister}
        />
      ) : (
        <RegisterModal 
          onClose={onClose} 
          onSwitchToLogin={switchToLogin}
        />
      )}
    </>
  );
};

export default AuthModal;