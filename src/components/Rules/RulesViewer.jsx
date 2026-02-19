// src/components/Rules/RulesViewer.jsx
import React, { useState } from 'react';
import './RulesViewer.css';

// Пример PDF данных (в реальности загружается с сервера)
const rulesPdfBase64 = "data:application/pdf;base64,JVBERi0..."; // Здесь будет реальный PDF

const RulesViewer = ({ onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDownload = () => {
    // Создаем ссылку для скачивания
    const link = document.createElement('a');
    link.href = rulesPdfBase64;
    link.download = 'Правила_пользования_Thingoo.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`rules-modal ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="rules-header">
        <h2>Правила пользования сервисом Thingoo</h2>
        <div className="rules-actions">
          <button className="icon-btn" onClick={toggleFullscreen} title="На весь экран">
            {isFullscreen ? '🗗️' : '🗖'}
          </button>
          <button className="icon-btn" onClick={handleDownload} title="Скачать PDF">
            ⬇️
          </button>
          <button className="icon-btn close-btn" onClick={onClose} title="Закрыть">
            ✕
          </button>
        </div>
      </div>

      <div className="rules-content">
        <div className="pdf-viewer">
          <iframe
            src={rulesPdfBase64}
            title="Правила пользования"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </div>

        <div className="rules-text">
          <h3>Краткое содержание:</h3>
          <ul>
            <li>1. Общие положения</li>
            <li>2. Регистрация и учетная запись</li>
            <li>3. Права и обязанности пользователей</li>
            <li>4. Условия аренды</li>
            <li>5. Оплата и возвраты</li>
            <li>6. Ответственность сторон</li>
            <li>7. Разрешение споров</li>
            <li>8. Заключительные положения</li>
          </ul>
        </div>
      </div>

      <div className="rules-footer">
        <p>Последнее обновление: 1 января 2025 г.</p>
        <button className="btn btn-primary" onClick={handleDownload}>
          Скачать PDF
        </button>
      </div>
    </div>
  );
};

export default RulesViewer;