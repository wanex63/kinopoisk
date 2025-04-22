// frontend/src/lib/api.ts
'use client';

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Создаем экземпляр axios
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Добавляем интерсептор для JWT
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Экспортируем методы API
export const api = {
  get: async (url: string, params?: any) => {
    const response = await apiClient.get(url, { params });
    return response.data;
  },
  post: async (url: string, data?: any) => {
    const response = await apiClient.post(url, data);
    return response.data;
  },
  put: async (url: string, data?: any) => {
    const response = await apiClient.put(url, data);
    return response.data;
  },
  delete: async (url: string) => {
    const response = await apiClient.delete(url);
    return response.data;
  },
};

// Вспомогательные функции для аутентификации
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    return jwtDecode(token);
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    return token ? jwtDecode(token) : null;
  }
  return null;
};