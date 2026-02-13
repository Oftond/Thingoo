// src/api/auth.js

const API_BASE_URL = "http://localhost:5000"; // поменяешь на свой адрес

// Регистрация пользователя: POST /auth/register
export async function registerUser(payload) {
  // payload: { fullName, email, password, passportSeries, passportNumber, passportIssuedBy, passportIssuedDate }

  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = "Не удалось зарегистрироваться";
    try {
      const data = await res.json();
      if (data && data.message) message = data.message;
    } catch (_) {}
    throw new Error(message);
  }

  return await res.json(); // например, { user, token }
}

// Логин: POST /auth/login
export async function loginUser({ email, password }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let message = "Неверный e‑mail или пароль";
    try {
      const data = await res.json();
      if (data && data.message) message = data.message;
    } catch (_) {}
    throw new Error(message);
  }

  return await res.json();
}
