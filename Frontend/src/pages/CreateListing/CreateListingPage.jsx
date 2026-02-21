// src/pages/CreateListing/CreateListingPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { itemsAPI, mediaAPI } from '../../services/api'; // Эти импорты теперь работают
import { useToast } from '../../components/Toast/Toast';
import './CreateListingPage.css';

const CreateListingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [previewURL, setPreviewURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price_per_day: '',
    location: '',
    description: '',
    has_insurance: false,
    has_fast_delivery: false
  });

  const categories = [
    { id: 'electronics', name: 'Электроника', icon: '💻' },
    { id: 'tools', name: 'Инструменты', icon: '🛠️' },
    { id: 'sports', name: 'Спорт и активный отдых', icon: '🏀' },
    { id: 'clothing', name: 'Одежда и костюмы', icon: '👕' },
    { id: 'books', name: 'Книги и обучение', icon: '📚' },
    { id: 'furniture', name: 'Мебель и интерьер', icon: '🛋️' },
    { id: 'vehicles', name: 'Транспорт и самокаты', icon: '🛴' },
    { id: 'other', name: 'Другое', icon: '✨' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calculateProgress = () => {
    let filledFields = 0;
    const totalFields = step === 1 ? 4 : 7;

    if (formData.title.trim() !== '') filledFields += 1;
    if (formData.category !== '') filledFields += 1;
    if (formData.price_per_day !== '') filledFields += 1;
    if (formData.location.trim() !== '') filledFields += 1;

    if (step === 2) {
      if (formData.description.trim() !== '') filledFields += 1;
      if (formData.has_insurance) filledFields += 0.5;
      if (formData.has_fast_delivery) filledFields += 0.5;
      if (images.length > 0) filledFields += 1;
    }

    return Math.round((filledFields / totalFields) * 100);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategorySelect = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      category: categoryId,
    }));
    setIsCategoryDropdownOpen(false);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

  setImages((prev) => {
      const updated = [...prev, ...newImages];
      if (!previewURL && updated.length > 0) {
        setPreviewURL(updated[0].preview);
      }
      return updated;
    });
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (previewURL && prev[index] && prev[index].preview === previewURL) {
        setPreviewURL(updated.length > 0 ? updated[0].preview : '');
      }
      return updated;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    if (imageFiles.length === 0) return;

    const newImages = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => {
      const updated = [...prev, ...newImages];
      if (!previewURL && updated.length > 0) {
        setPreviewURL(updated[0].preview);
      }
      return updated;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSelectPreview = (preview) => {
    setPreviewURL(preview);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (
        !formData.title.trim() ||
        !formData.category ||
        !formData.price_per_day ||
        !formData.location.trim()
      ) {
        setError('Заполните название, категорию, цену и город/район перед продолжением.');
        return;
      }
      setError('');
      setStep(2);
    } else {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = async () => {
    // Проверяем авторизацию перед отправкой
    if (!user) {
      setError('Необходимо войти в систему для создания объявления');
      return;
    }

    if (images.length === 0) {
      setError('Добавьте хотя бы одно фото');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const itemData = {
        ...formData,
        price_per_day: parseInt(formData.price_per_day),
        owner_id: user.id,
        status: 'active',
      };

      const response = await itemsAPI.create(itemData);
      const itemId = response.data.id;

      if (images.length > 0) {
        console.log('Uploading files:', images.map(img=>img.file.name));

        const formData = new FormData();
        images.forEach((img) => {
          formData.append('files', img.file);
        });

        for (let [key, value] of formData.entries()) {
          console.log(key, value.name || value);
        }

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };

        await mediaAPI.uploadItemPhotos(itemId, formData, config);
      }

      alert('Объявление успешно создано!');
      navigate(`/listing/${itemId}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      setError(error.response?.data?.message || 'Ошибка при создании объявления');
    } finally {
      setLoading(false);
    }
  };

  const progress = calculateProgress();
  const currentCategory = categories.find((c) => c.id === formData.category);

  return (
    <div className="create-listing-page">
      <div className="create-listing-container">
        <header className="create-listing-header">
          <h1>Создайте новое объявление</h1>
          <p className="subtitle">
            Опишите свой предмет, добавьте фото и укажите условия аренды — это займёт пару минут.
          </p>
        </header>

        <section className="progress-section">
          <div className="progress-info">
            <span>Заполнено: {progress}%</span>
            <span>Шаг {step} из 2</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="step-indicators">
            <div className={`step-indicator ${step === 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Основная информация</span>
            </div>
            <div className={`step-indicator ${step === 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Фото и условия</span>
            </div>
          </div>
        </section>

        {error && <div className="error-message">{error}</div>}

        <section className="create-listing-content">
          <div className="form-section">
            {step === 1 && (
              <div className="step step-1">
                <h2>Расскажите о предмете</h2>

                <div className="form-group">
                  <label htmlFor="title">Название объявления</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Например, Sony Alpha 7 III с объективом 28–70 мм"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                  <div className="form-hint">
                    Старайтесь делать название понятным и конкретным.
                  </div>
                </div>

                <div className="form-group">
                  <label>Категория</label>
                  <div className="dropdown" ref={dropdownRef}>
                    <button
                      type="button"
                      className="dropdown-toggle"
                      onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
                    >
                      {currentCategory ? (
                        <>
                          <span className="category-icon">{currentCategory.icon}</span>
                          <span className="category-name">{currentCategory.name}</span>
                        </>
                      ) : (
                        <span className="category-name">Выберите категорию</span>
                      )}
                      <span className={`dropdown-arrow ${isCategoryDropdownOpen ? 'open' : ''}`}>
                        ▼
                      </span>
                    </button>

                    {isCategoryDropdownOpen && (
                      <div className="dropdown-menu">
                        {categories.map((category) => (
                          <div
                            key={category.id}
                            className={`dropdown-item ${formData.category === category.id ? 'active' : ''}`}
                            onClick={() => handleCategorySelect(category.id)}
                          >
                            <span className="category-icon">{category.icon}</span>
                            <span className="category-name">{category.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="form-hint">
                    Категория помогает людям быстрее находить ваш предмет.
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="price">Цена аренды в сутки</label>
                  <div className="price-input">
                    <input
                      type="number"
                      id="price"
                      name="price_per_day"
                      placeholder="500"
                      value={formData.price_per_day}
                      onChange={handleInputChange}
                      min="0"
                    />
                    <span className="price-suffix">₽ / сутки</span>
                  </div>
                  <div className="form-hint">
                    Укажите базовую стоимость аренды за один день.
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location">Город и район</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Новосибирск, Академгородок"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                  <div className="form-hint">
                    Так арендатор поймёт, где можно забрать предмет.
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="step step-2">
                <h2>Фото и условия аренды</h2>

                <div
                  className="form-group"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <label>Фотографии</label>
                  <div
                    className="dropzone"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  >
                    <div className="upload-icon">📷</div>
                    <div className="dropzone-content">
                      <p>Перетащите сюда фото или нажмите, чтобы выбрать</p>
                      <span className="link">Выбрать файлы</span>
                    </div>
                    <div className="dropzone-hint">
                      Добавьте несколько фото с разных ракурсов, чтобы вызвать больше доверия.
                    </div>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />

                  {images.length > 0 && (
                    <div className="image-previews">
                      <div className="image-thumbnails">
                        {images.map((img, index) => (
                          <div
                            key={index}
                            className={`image-thumbnail ${previewURL === img.preview ? 'selected' : ''}`}
                            onClick={() => handleSelectPreview(img.preview)}
                          >
                            <img src={img.preview} alt={`Фото ${index + 1}`} />
                            <button
                              type="button"
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

                <div className="form-group">
                  <label htmlFor="description">Описание</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="5"
                    placeholder="Опишите состояние, комплектацию, особенности использования и любые ограничения."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                  <div className="form-hint">
                    Подробное описание уменьшает количество вопросов и повышает доверие.
                  </div>
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
                      <span className="checkbox-custom" />
                      <span className="checkbox-text">
                        <span className="checkbox-title">
                          Готов оформить залог или страховку
                        </span>
                        <span className="checkbox-description">
                          Это снижает риски и делает аренду безопаснее для обеих сторон.
                        </span>
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
                      <span className="checkbox-custom" />
                      <span className="checkbox-text">
                        <span className="checkbox-title">
                          Возможна быстрая доставка
                        </span>
                        <span className="checkbox-description">
                          Например, вы можете сами привезти предмет или воспользоваться курьером.
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="form-navigation">
              <button
                type="button"
                className="btn-secondary"
                onClick={handlePrevStep}
                disabled={loading}
              >
                Назад
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNextStep}
                disabled={loading}
              >
                {loading ? 'Публикация...' : (step === 1 ? 'Далее' : 'Опубликовать')}
              </button>
            </div>
          </div>

          <aside className="preview-section">
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
                  <div className="ad-price">
                    {formData.price_per_day ? `${formData.price_per_day} ₽ / сутки` : 'Цена ещё не указана'}
                  </div>
                  <h4 className="ad-title">
                    {formData.title || 'Название объявления'}
                  </h4>
                  <div className="ad-location">
                    {formData.location || 'Местоположение'}
                  </div>
                  <div className="ad-badges">
                    {formData.hasInsurance && (
                      <span className="badge badge-insurance">
                        Залог / страховка
                      </span>
                    )}
                    {formData.hasFastDelivery && (
                      <span className="badge badge-delivery">
                        Быстрая доставка
                      </span>
                    )}
                  </div>
                  <div className="ad-description">
                    {formData.description || 'Здесь будет краткое описание вашего предложения.'}
                  </div>
                  {formData.category && (
                    <div className="ad-category">
                      <span className="category-icon-small">{currentCategory?.icon}</span>
                      <span>{currentCategory?.name}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="preview-note">
                Этот блок помогает увидеть, как ваше объявление будет выглядеть в каталоге.
              </div>
            </div>

            <div className="tips-section">
              <h3>Советы по хорошему объявлению</h3>
              <ul className="tips-list">
                <li>Используйте живые, не размытые фотографии при хорошем освещении.</li>
                <li>Честно укажите все нюансы и возможные дефекты.</li>
                <li>Добавьте условия возврата и свои пожелания к арендаторам.</li>
                <li>Отвечайте на сообщения быстро — так вы получите больше броней.</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
};

export default CreateListingPage;