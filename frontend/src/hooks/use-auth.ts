'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/client-api';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await auth.login(email, password);
      router.push('/');
      router.refresh(); // Для обновления данных на клиенте
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Не удалось войти. Проверьте данные и попробуйте снова'
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    username: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      await auth.register(data);
      await login(data.email, data.password);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ошибка регистрации. Пожалуйста, попробуйте позже'
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return {
    login,
    register,
    logout,
    isLoading,
    error,
    setError
  };
};