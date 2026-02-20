// src/services/logger.js
class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
  }

  // Уровни логирования
  levels = {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    ACTION: 'ACTION'
  };

  // Добавить запись в лог
  log(level, message, data = null, userId = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data: data ? JSON.stringify(data) : null,
      userId,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.logs.push(logEntry);
    
    // Ограничиваем размер лога
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // В консоль для разработки
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level}] ${message}`, data || '');
    }

    // Отправка на сервер (можно раскомментировать при наличии бекенда)
    // this.sendToServer(logEntry);

    return logEntry;
  }

  // Действия пользователя
  action(message, data = null, userId = null) {
    return this.log(this.levels.ACTION, message, data, userId);
  }

  // Информационные сообщения
  info(message, data = null, userId = null) {
    return this.log(this.levels.INFO, message, data, userId);
  }

  // Предупреждения
  warn(message, data = null, userId = null) {
    return this.log(this.levels.WARN, message, data, userId);
  }

  // Ошибки
  error(message, error = null, userId = null) {
    const errorData = error ? {
      message: error.message,
      stack: error.stack,
      ...error
    } : null;
    return this.log(this.levels.ERROR, message, errorData, userId);
  }

  // Отладка
  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      return this.log(this.levels.DEBUG, message, data);
    }
  }

  // Получить все логи
  getLogs() {
    return [...this.logs];
  }

  // Очистить логи
  clearLogs() {
    this.logs = [];
  }

  // Отправка на сервер
  async sendToServer(logEntry) {
    try {
      // Здесь будет отправка на бекенд
      // await api.post('/logs', logEntry);
    } catch (error) {
      console.error('Failed to send log to server:', error);
    }
  }

  // Логирование входа/выхода
  logLogin(userId, success) {
    this.action(success ? 'Успешный вход' : 'Неудачная попытка входа', { success }, userId);
  }

  logLogout(userId) {
    this.action('Выход из системы', null, userId);
  }

  // Логирование действий с объявлениями
  logListingAction(action, listingId, userId) {
    this.action(`Действие с объявлением: ${action}`, { listingId }, userId);
  }

  // Логирование платежей
  logPayment(paymentId, amount, status, userId) {
    this.action('Платеж', { paymentId, amount, status }, userId);
  }
}

// Создаем singleton
const logger = new Logger();
export default logger;