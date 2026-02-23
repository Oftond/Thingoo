// src/services/notificationService.js
import api from './api';

class NotificationService {
  constructor() {
    this.subscribers = [];
    this.FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000';
  }

  // Приветственное письмо
  async sendWelcomeEmail(user) {
    try {
      console.log(`📧 Sending welcome email to ${user.email}`);
      
      const response = await api.post('/notifications/welcome', {
        to: [user.email],
        name: user.full_name || user.email
      });
      
      console.log('✅ Welcome email sent:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      throw error;
    }
  }

  // Восстановление пароля
  async sendPasswordResetEmail(email, resetToken) {
    try {
      console.log(`📧 Sending password reset email to ${email}`);
      
      const response = await api.post('/notifications/password-reset', {
        to: [email],
        resetToken: resetToken
      });
      
      console.log('✅ Password reset email sent:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      throw error;
    }
  }

  async sendPasswordChangedNotification(email, userName) {
    if (!email) {
      console.warn('Cannot send password changed notification: no email');
      return;
    }
    
    try {
      console.log(`📧 Sending password changed notification to ${email}`);
      
      // Используем существующий endpoint для email уведомлений
      // или создайте новый в бэкенде
      const response = await api.post('/notifications/password-changed', {
        to: [email],
        userName: userName || 'Пользователь'
      });
      
      console.log('✅ Password changed notification sent:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to send password changed notification:', error);
      // Не пробрасываем ошибку, чтобы не блокировать основной процесс
    }
  }

  // Уведомление о новом сообщении
  async sendNewMessageNotification(user, sender, message) {
    if (!user?.email) return;
    
    try {
      console.log(`📧 Sending new message notification to ${user.email}`);
      
      const response = await api.post('/notifications/new-message', {
        to: [user.email],
        senderName: sender.full_name || sender.email,
        messagePreview: message.substring(0, 100)
      });
      
      console.log('✅ New message notification sent:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to send message notification:', error);
      throw error;
    }
  }

  // Уведомление о новой аренде (владельцу)
  async sendNewRentalNotification(owner, renter, item) {
    if (!owner?.email) return;
    
    try {
      console.log(`📧 Sending new rental notification to ${owner.email}`);
      
      const response = await api.post('/notifications/new-rental', {
        to: [owner.email],
        ownerName: owner.full_name || owner.email,
        renterName: renter.full_name || renter.email,
        itemName: item.title
      });
      
      console.log('✅ New rental notification sent:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to send rental notification:', error);
      throw error;
    }
  }

  // Уведомление о подтверждении аренды (арендатору)
  async sendRentalConfirmedNotification(renter, owner, item, dates) {
    if (!renter?.email) return;
    
    try {
      console.log(`📧 Sending rental confirmed notification to ${renter.email}`);
      
      const response = await api.post('/notifications/rental-confirmed', {
        to: [renter.email],
        renterName: renter.full_name || renter.email,
        ownerName: owner.full_name || owner.email,
        itemName: item.title,
        dates: dates || 'даты не указаны'
      });
      
      console.log('✅ Rental confirmed notification sent:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to send rental confirmed notification:', error);
      throw error;
    }
  }

  // Уведомление об успешной оплате (арендатору)
  async sendPaymentSuccessNotification(user, amount, item) {
    if (!user?.email) return;
    
    try {
      console.log(`📧 Sending payment success notification to ${user.email}`);
      
      const response = await api.post('/notifications/payment-success', {
        to: [user.email],
        amount: amount,
        itemName: item.title
      });
      
      console.log('✅ Payment success notification sent:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to send payment notification:', error);
      throw error;
    }
  }

  // Уведомление о новом отзыве
  async sendNewReviewNotification(user, reviewer, rating) {
    if (!user?.email) return;
    
    try {
      console.log(`📧 Sending new review notification to ${user.email}`);
      
      const response = await api.post('/notifications/new-review', {
        to: [user.email],
        reviewerName: reviewer.full_name || reviewer.email,
        rating: rating.toString()
      });
      
      console.log('✅ New review notification sent:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Failed to send review notification:', error);
      throw error;
    }
  }

  // Подписка на уведомления
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  // Уведомление всех подписчиков
  notify(event, data) {
    this.subscribers.forEach(callback => callback(event, data));
  }
}

const notificationService = new NotificationService();
export default notificationService;