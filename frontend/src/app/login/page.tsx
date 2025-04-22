'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  console.log('NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Введите пароль';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrors({}); // Сбрасываем возможные ошибки

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    if (!API_BASE_URL) {
      console.error('NEXT_PUBLIC_API_BASE_URL отсутствует.');
      setErrors({ general: 'URL сервера не задан в переменных окружения.' });
      setIsSubmitting(false);
      return;
    }

    // Приводим email к нижнему регистру, удаляем пробелы
    const normalizedEmail = formData.email.trim().toLowerCase();
    const password = formData.password.trim();

    // Проверяем, что все поля заполнены
    if (!normalizedEmail || !password) {
      setErrors({ general: 'Все поля обязательны для заполнения.' });
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Отправляем запрос на сервер:', {
        email: normalizedEmail,
        password,
      });

      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password: password,
        }),
      });

      const data = await response.json();
      console.log('Ответ от API:', response.status, data);

      if (!response.ok) {
        // Обработка ответа с ошибкой
        setErrors({
          general:
            data?.detail || 'Неверный запрос. Проверьте email и пароль.',
        });
        throw new Error(data?.detail || 'Bad Request');
      }

      console.log('Авторизация успешна. Токен:', data.access);

      // Сохраняем токен авторизации
      localStorage.setItem('accessToken', data.access);

      // Перенаправляем пользователя
      router.push('/');
    } catch (err) {
      console.error('Ошибка авторизации:', err);
      setErrors({
        general:
          err instanceof Error
            ? err.message
            : 'Непредвиденная ошибка. Проверьте соединение.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Вход</h1>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring text-gray-900"
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Пароль *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring text-gray-900"
              disabled={isSubmitting}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Входим...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}