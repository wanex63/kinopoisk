'use client';

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const clientApi = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Добавляем интерсепторы для JWT
clientApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const api = {
  get: clientApi.get,
  post: clientApi.post,
  put: clientApi.put,
  delete: clientApi.delete,
};

export const auth = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      return jwtDecode(token);
    }
    return null;
  },
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      return token ? jwtDecode(token) : null;
    }
    return null;
  }
};