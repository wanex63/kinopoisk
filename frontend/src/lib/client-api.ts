'use client';

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface UserJwtPayload {
  username?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  exp?: number;
  iat?: number;
}

const clientApi = axios.create({
  baseURL: '/api',
});

clientApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

clientApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

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
      const decodedToken = jwtDecode<UserJwtPayload>(token);
      
      // Сохраняем дополнительные данные пользователя в localStorage
      if (decodedToken.avatar) {
        localStorage.setItem('userAvatar', decodedToken.avatar);
      }
      
      return decodedToken;
    }
    return null;
  },
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userAvatar');
    }
  },
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const decodedToken = jwtDecode<UserJwtPayload>(token);
      // Пытаемся получить сохраненный аватар из localStorage, если его нет в токене
      if (!decodedToken.avatar) {
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) {
          decodedToken.avatar = savedAvatar;
        }
      }
      
      return decodedToken;
    }
    return null;
  },
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return null;

      const response = await clientApi.post('/auth/refresh/', { refresh: refreshToken });
      if (response.data.access) {
        return auth.setToken(response.data.access);
      }
    } catch (error) {
      auth.removeToken();
    }
    return null;
  }
};