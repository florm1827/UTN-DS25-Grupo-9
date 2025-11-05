const API_URL = "https://utn-ds25-grupo-9.onrender.com/api"; // backend

export const registerUser = async (userData) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const loginUser = async (credentials) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return res.json();
};

export const getReservas = async (token) => {
  const res = await fetch(`${API_URL}/reservas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const createReserva = async (token, reservaData) => {
  const res = await fetch(`${API_URL}/reservas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reservaData),
  });
  return res.json();
};
