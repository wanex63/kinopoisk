'use client';

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { redirect } from 'next/navigation';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
});

// Интерсептор запросов
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Интерсептор ответов
apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh/`, {
          refresh: refreshToken
        });

        localStorage.setItem('token', data.access);
        apiClient.defaults.headers.Authorization = `Bearer ${data.access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const api = {
  get: async <T>(url: string, params?: any): Promise<T> => {
    try {
      const response = await apiClient.get(url, { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  post: async <T>(url: string, data?: any): Promise<T> => {
    try {
      const response = await apiClient.post(url, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  put: async <T>(url: string, data?: any): Promise<T> => {
    try {
      const response = await apiClient.put(url, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  delete: async <T>(url: string): Promise<T> => {
    try {
      const response = await apiClient.delete(url);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

function handleApiError(error: any) {
  if (axios.isAxiosError(error)) {
    return new Error(
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      'Network error'
    );
  }
  return error instanceof Error ? error : new Error('Unknown error');
}

export const auth = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<{
      access: string;
      refresh: string
    }>('/auth/login/', { email, password });

    localStorage.setItem('token', data.access);
    localStorage.setItem('refreshToken', data.refresh);
    apiClient.defaults.headers.Authorization = `Bearer ${data.access}`;
    return jwtDecode(data.access);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete apiClient.defaults.headers.Authorization;
  },

  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      return token ? jwtDecode(token) : null;
    }
    return null;
  },

  isAuthenticated: () => {
    return !!auth.getCurrentUser();
  }
};