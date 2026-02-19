// src/pages/HowItWorks/HowItWorks.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./HowItWorks.css";

function HowItWorks() {
  const navigate = useNavigate();

  const renterSteps = [
    {
      step: 1,
      title: "Находит вещь",
      description: "Просматривает каталог, использует фильтры по категориям, цене, рейтингу"
    },
    {
      step: 2,
      title: "Связывается с владельцем",
      description: "Через чат или контакты"
    },
    {
      step: 3,
      title: "Договаривается",
      description: "Обсуждает сроки, условия, встречу"
    },
    {
      step: 4,
      title: "Оплачивает",
      description: "Через защищенную систему или на месте"
    },
    {
      step: 5,
      title: "Получает вещь",
      description: "Встречается с владельцем"
    },
    {
      step: 6,
      title: "Пользуется",
      description: "В течение оговоренного срока"
    },
    {
      step: 7,
      title: "Возвращает",
      description: "В назначенное время"
    },
    {
      step: 8,
      title: "Оставляет отзыв",
      description: "Помогает другим пользователям"
    }
  ];

  const ownerSteps = [
    {
      step: 1,
      title: "Создает объявление",
      description: "Заполняет форму, добавляет фото, описывает условия"
    },
    {
      step: 2,
      title: "Указывает цену",
      description: "За день, час или фиксированную"
    },
    {
      step: 3,
      title: "Добавляет опции",
      description: "Страховка, доставка, залог"
    },
    {
      step: 4,
      title: "Получает запросы",
      description: "От потенциальных арендаторов"
    },
    {
      step: 5,
      title: "Обсуждает детали",
      description: "Отвечает на вопросы"
    },
    {
      step: 6,
      title: "Передает вещь",
      description: "Встречается с арендатором"
    },
    {
      step: 7,
      title: "Получает оплату",
      description: "После подтверждения получения"
    },
    {
      step: 8,
      title: "Получает вещь обратно",
      description: "Проверяет состояние"
    },
    {
      step: 9,
      title: "Зарабатывает",
      description: "Получает деньги за аренду"
    }
  ];

  return (
    <main className="how-it-works">
      <div className="container">
        <div className="how-header">
          <h1 className="how-title">Как это работает</h1>
          <p className="how-subtitle">
            Простой и понятный процесс аренды вещей на Thingoo
          </p>
        </div>

        <div className="how-tabs">
          <div className="how-column">
            <h2 className="column-title">👤 Для арендатора</h2>
            <div className="steps-list">
              {renterSteps.map((step) => (
                <div key={step.step} className="step-item">
                  <div className="step-number">{step.step}</div>
                  <div className="step-content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="how-column">
            <h2 className="column-title">🏠 Для арендодателя</h2>
            <div className="steps-list">
              {ownerSteps.map((step) => (
                <div key={step.step} className="step-item">
                  <div className="step-number">{step.step}</div>
                  <div className="step-content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default HowItWorks;