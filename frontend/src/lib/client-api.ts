'use client';

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

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
      return jwtDecode(token);
    }
    return null;
  },
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  },
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      return token ? jwtDecode(token) : null;
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