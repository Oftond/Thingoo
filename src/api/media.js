// src/api/media.js

// Базовый URL бэка — потом поменяешь на свой
const API_BASE_URL = "http://localhost:3000";

// 1) Сохранение фото в БД (POST /api/v1/media/items/{item_id}/photos)
export async function uploadItemPhoto(itemId, file) {
  const formData = new FormData();
  formData.append("file", file); // имя поля подстрой под бэк, если нужно

  const res = await fetch(
    `${API_BASE_URL}/api/v1/media/items/${itemId}/photos`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Не удалось загрузить фото");
  }

  return await res.json(); // метаданные фото
}

// 2) Список метаданных фото для товара (GET /api/v1/media/items/{item_id}/photos)
export async function getItemPhotosMeta(itemId) {
  const res = await fetch(
    `${API_BASE_URL}/api/v1/media/items/${itemId}/photos`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Не удалось получить список фото");
  }

  return await res.json();
}

// 3) URL конкретного фото (GET /api/v1/media/photos/{photo_id})
export function getPhotoUrl(photoId) {
  return `${API_BASE_URL}/api/v1/media/photos/${photoId}`;
}
