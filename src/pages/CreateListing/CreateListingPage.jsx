import React, { useState, useRef } from 'react';
import './CreateListingPage.css';

const CreateListingPage = () => {
  // Состояния для шагов формы
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [previewURL, setPreviewURL] = useState('');
  const fileInputRef = useRef(null);
  
  // Состояния для данных формы
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    location: '',
    description: '',
    hasInsurance: false,
    hasFastDelivery: false,
  });
  
  // Категории с иконками
  const categories = [
    { id: 'electronics', name: 'Электроника', icon: '📱' },
    { id: 'tools', name: 'Инструменты', icon: '🔧' },
    { id: 'sports', name: 'Спорт и отдых', icon: '⚽' },
    { id: 'clothing', name: 'Одежда', icon: '👕' },
    { id: 'books', name: 'Книги', icon: '📚' },
    { id: 'furniture', name: 'Мебель', icon: '🛋️' },
    { id: 'vehicles', name: 'Транспорт', icon: '🚲' },
    { id: 'other', name: 'Другое', icon: '📦' },
  ];
  
  // Расчет процента заполнения формы
  const calculateProgress = () => {
    let filledFields = 0;
    const totalFields = step === 1 ? 4 : 7;
    
    if (formData.title.trim() !== '') filledFields++;
    if (formData.category !== '') filledFields++;
    if (formData.price !== '') filledFields++;
    if (formData.location.trim() !== '') filledFields++;
    
    if (step === 2) {
      if (formData.description.trim() !== '') filledFields++;
      if (formData.hasInsurance) filledFields += 0.5;
      if (formData.hasFastDelivery) filledFields += 0.5;
      if (images.length > 0) filledFields++;
    }
    
    return Math.round((filledFields / totalFields) * 100);
  };
  
  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  // Обработчик загрузки изображений
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setImages([...images, ...newImages]);
    
    if (images.length === 0 && newImages.length > 0) {
      setPreviewURL(newImages[0].preview);
    }
  };
  
  // Обработчик удаления изображения
  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    
    if (previewURL === images[index].preview) {
      setPreviewURL(updatedImages.length > 0 ? updatedImages[0].preview : '');
    }
  };
  
  // Обработчик drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      const newImages = imageFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      
      setImages([...images, ...newImages]);
      
      if (images.length === 0 && newImages.length > 0) {
        setPreviewURL(newImages[0].preview);
      }
    }
  };
  
  // Обработчик выбора изображения для предпросмотра
  const handleSelectPreview = (preview) => {
    setPreviewURL(preview);
  };
  
  // Переход к следующему шагу
  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.title || !formData.category || !formData.price || !formData.location) {
        alert('Пожалуйста, заполните все обязательные поля перед переходом к следующему шагу');
        return;
      }
    }
    
    if (step < 2) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };
  
  // Переход к предыдущему шагу
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Обработчик отправки формы
  const handleSubmit = () => {
    console.log('Данные формы:', formData);
    console.log('Изображения:', images);
    
    alert('Объявление успешно создано! Оно будет опубликовано после модерации.');
  };
  
  const progress = calculateProgress();

  return (
    <div className="create-ad-page">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <a href="/">Thingoo</a>
            </div>
            <div className="header-actions">
              <button className="btn btn-back" onClick={() => window.history.back()}>
                ← Назад
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="create-ad-container">
            <div className="create-ad-header">
              <h1>Создание объявления</h1>
              <p className="subtitle">Заполните информацию о вещи, которую хотите сдать в аренду</p>
              
              <div className="progress-section">
                <div className="progress-info">
                  <span>Заполнено: {progress}%</span>
                  <span>Шаг {step} из 2</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="step-indicators">
                  <div className={`step-indicator ${step === 1 ? 'active' : ''}`}>
                    <span className="step-number">1</span>
                    <span className="step-label">Основное</span>
                  </div>
                  <div className={`step-indicator ${step === 2 ? 'active' : ''}`}>
                    <span className="step-number">2</span>
                    <span className="step-label">Детали</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="create-ad-content">
              <div className="form-section">
                {step === 1 ? (
                  <div className="step step-1">
                    <h2>Основные параметры</h2>
                    
                    <div className="form-group">
                      <label htmlFor="title">Название объявления *</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Например, Камера Sony Alpha 7 III"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="form-hint">Придумайте четкое и понятное название</div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="category">Категория *</label>
                      <div className="dropdown">
                        <button className="dropdown-toggle">
                          {formData.category ? (
                            <>
                              <span className="category-icon">
                                {categories.find(c => c.id === formData.category)?.icon}
                              </span>
                              <span className="category-name">
                                {categories.find(c => c.id === formData.category)?.name}
                              </span>
                            </>
                          ) : (
                            'Выберите категорию'
                          )}
                          <span className="dropdown-arrow">▼</span>
                        </button>
                        <div className="dropdown-menu">
                          {categories.map(category => (
                            <div
                              key={category.id}
                              className="dropdown-item"
                              onClick={() => setFormData({...formData, category: category.id})}
                            >
                              <span className="category-icon">{category.icon}</span>
                              <span className="category-name">{category.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="price">Цена за день (₽) *</label>
                      <div className="price-input">
                        <input
                          type="number"
                          id="price"
                          name="price"
                          placeholder="500"
                          value={formData.price}
                          onChange={handleInputChange}
                          min="0"
                          required
                        />
                        <span className="price-suffix">₽/день</span>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="location">Местоположение *</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        placeholder="Москва, центр"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="step step-2">
                    <h2>Дополнительные детали</h2>
                    
                    <div className="form-group">
                      <label htmlFor="description">Описание</label>
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Опишите вашу вещь: состояние, особенности, условия аренды..."
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="5"
                      ></textarea>
                      <div className="form-hint">Подробное описание поможет привлечь больше арендаторов</div>
                    </div>
                    
                    <div className="form-group">
                      <label>Фотографии вещи</label>
                      <div 
                        className="dropzone"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => fileInputRef.current.click()}
                      >
                        <div className="dropzone-content">
                          <div className="upload-icon">📷</div>
                          <p>Перетащите сюда фото или <span className="link">выберите файлы</span></p>
                          <p className="dropzone-hint">До 10 изображений в формате JPG, PNG</p>
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          multiple
                          accept="image/*"
                          style={{ display: 'none' }}
                        />
                      </div>
                      
                      {images.length > 0 && (
                        <div className="image-previews">
                          <p>Загруженные фото ({images.length}):</p>
                          <div className="image-thumbnails">
                            {images.map((image, index) => (
                              <div 
                                key={index} 
                                className={`image-thumbnail ${previewURL === image.preview ? 'selected' : ''}`}
                                onClick={() => handleSelectPreview(image.preview)}
                              >
                                <img src={image.preview} alt={`preview ${index + 1}`} />
                                <button 
                                  className="remove-image"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveImage(index);
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="checkboxes">
                      <div className="checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="hasInsurance"
                            checked={formData.hasInsurance}
                            onChange={handleInputChange}
                          />
                          <span className="checkbox-custom"></span>
                          <span className="checkbox-text">
                            <span className="checkbox-title">Страхование</span>
                            <span className="checkbox-description">Вещь застрахована от повреждений</span>
                          </span>
                        </label>
                      </div>
                      
                      <div className="checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="hasFastDelivery"
                            checked={formData.hasFastDelivery}
                            onChange={handleInputChange}
                          />
                          <span className="checkbox-custom"></span>
                          <span className="checkbox-text">
                            <span className="checkbox-title">Быстрая доставка</span>
                            <span className="checkbox-description">Доставка в течение дня</span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="form-navigation">
                  {step > 1 && (
                    <button className="btn btn-secondary" onClick={handlePrevStep}>
                      Назад
                    </button>
                  )}
                  <button className="btn btn-primary" onClick={handleNextStep}>
                    {step === 2 ? 'Опубликовать объявление' : 'Далее'}
                  </button>
                </div>
              </div>
              
              <div className="preview-section">
                <div className="preview-card">
                  <h3>Предпросмотр объявления</h3>
                  
                  <div className="ad-preview">
                    <div className="ad-image">
                      {previewURL ? (
                        <img src={previewURL} alt="Предпросмотр" />
                      ) : (
                        <div className="ad-image-placeholder">📷</div>
                      )}
                    </div>
                    
                    <div className="ad-content">
                      <div className="ad-price">{formData.price ? `${formData.price} ₽/день` : 'Цена не указана'}</div>
                      <h4 className="ad-title">{formData.title || 'Название объявления'}</h4>
                      <div className="ad-location">{formData.location || 'Местоположение не указано'}</div>
                      
                      <div className="ad-badges">
                        {formData.hasInsurance && <span className="badge badge-insurance">💎 Страхование</span>}
                        {formData.hasFastDelivery && <span className="badge badge-delivery">🚚 Быстрая доставка</span>}
                      </div>
                      
                      <div className="ad-description">
                        {formData.description || 'Описание не добавлено'}
                      </div>
                      
                      <div className="ad-category">
                        {formData.category && (
                          <>
                            <span className="category-icon-small">
                              {categories.find(c => c.id === formData.category)?.icon}
                            </span>
                            <span>{categories.find(c => c.id === formData.category)?.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="preview-note">
                    <p>Так будет выглядеть ваше объявление на сайте</p>
                  </div>
                </div>
                
                <div className="tips-section">
                  <h3>💡 Советы для успешного объявления</h3>
                  <ul className="tips-list">
                    <li>Используйте качественные фотографии с разных ракурсов</li>
                    <li>Указывайте реальные дефекты и состояние вещи</li>
                    <li>Четко опишите правила использования и возврата</li>
                    <li>Установите адекватную цену, сравните с аналогичными предложениями</li>
                    <li>Быстро отвечайте на вопросы потенциальных арендаторов</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="logo">
              <a href="/">Thingoo</a>
            </div>
            <div className="footer-links">
              <a href="/">Помощь</a>
              <a href="/">О сервисе</a>
              <a href="/">Контакты</a>
              <a href="/">Правила</a>
            </div>
            <div className="footer-copyright">
              © {new Date().getFullYear()} Thingoo. Сервис аренды вещей.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CreateListingPage;