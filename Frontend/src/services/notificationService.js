// src/services/notificationService.js
class NotificationService {
  constructor() {
    this.subscribers = [];
  }

  // Отправка email уведомления
  async sendEmail(to, subject, template, data = {}) {
    console.log(`📧 Отправка email на ${to}: ${subject}`);
    
    // Здесь будет реальная отправка через API
    const response = await api.post('/notifications/email', {
      to,
      subject,
      template,
      data
    });
    
    return { success: true, messageId: Date.now() };
  }

  // Уведомление о новой регистрации
  async sendWelcomeEmail(user) {
    return this.sendEmail(
      user.email,
      'Добро пожаловать в Thingoo!',
      'welcome',
      { name: user.fullName }
    );
  }

  // Уведомление о восстановлении пароля
  async sendPasswordResetEmail(email, resetToken) {
    return this.sendEmail(
      email,
      'Восстановление пароля Thingoo',
      'password-reset',
      { resetToken }
    );
  }

  // Уведомление о новом сообщении
  async sendNewMessageNotification(user, sender, message) {
    return this.sendEmail(
      user.email,
      'Новое сообщение в Thingoo',
      'new-message',
      { senderName: sender.fullName, messagePreview: message.substring(0, 100) }
    );
  }

  // Уведомление о новой аренде
  async sendNewRentalNotification(owner, renter, item) {
    return this.sendEmail(
      owner.email,
      'Новый запрос на аренду',
      'new-rental',
      { renterName: renter.fullName, itemName: item.title }
    );
  }

  // Уведомление о подтверждении аренды
  async sendRentalConfirmedNotification(renter, owner, item, dates) {
    return this.sendEmail(
      renter.email,
      'Аренда подтверждена!',
      'rental-confirmed',
      { ownerName: owner.fullName, itemName: item.title, dates }
    );
  }

  // Уведомление об оплате
  async sendPaymentNotification(user, amount, item) {
    return this.sendEmail(
      user.email,
      'Оплата получена',
      'payment-success',
      { amount, itemName: item.title }
    );
  }

  // Уведомление об отзыве
  async sendReviewNotification(user, reviewer, rating) {
    return this.sendEmail(
      user.email,
      'Вам оставили отзыв',
      'new-review',
      { reviewerName: reviewer.fullName, rating }
    );
  }

  // Подписка на уведомления (для будущих обновлений)
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