'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import { auth } from '@/lib/client-api';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    password2?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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

    if (!formData.username.trim()) {
      newErrors.username = 'Введите имя пользователя';
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'Имя должно содержать минимум 3 символа';
      isValid = false;
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
      isValid = false;
    } else if (!/^[A-Za-z\d]+$/.test(formData.password)) {
      newErrors.password =
        'Пароль может содержать только буквы латинского алфавита и цифры';
      isValid = false;
    }

    if (formData.password !== formData.password2) {
      newErrors.password2 = 'Пароли не совпадают';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    if (!API_BASE_URL) {
      console.error('NEXT_PUBLIC_API_BASE_URL отсутствует или не настроен.');
      setErrors(prev => ({
        ...prev,
        general: 'Не удалось подключиться к API. Проверьте настройки.',
      }));
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Отправляем данные на сервер:', formData); // Логируем отправляемые данные

      // Пытаемся зарегистрировать пользователя
      const registerResponse = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const registerData = await registerResponse.json();
      console.log('Ответ сервера регистрации:', registerData); // Логируем ответ сервера

      if (!registerResponse.ok) {
        // Обработка ошибок регистрации
        const serverErrors: typeof errors = {};

        if (registerData.username) {
          serverErrors.username = Array.isArray(registerData.username)
            ? registerData.username[0]
            : registerData.username;
        }

        if (registerData.email) {
          serverErrors.email = Array.isArray(registerData.email)
            ? registerData.email[0]
            : registerData.email;
        }

        if (registerData.password) {
          serverErrors.password = Array.isArray(registerData.password)
            ? registerData.password[0]
            : registerData.password;
        }

        if (registerData.non_field_errors) {
          serverErrors.general = Array.isArray(registerData.non_field_errors)
            ? registerData.non_field_errors[0]
            : registerData.non_field_errors;
        }

        setErrors(serverErrors);
        throw new Error(serverErrors.general || 'Ошибка регистрации');
      }

      console.log('Регистрация прошла успешно, выполняем логин!');

      // Выполняем логин
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginResponse.json();
      console.log('Ответ сервера логина:', loginData); // Логируем ответ логина

      if (!loginResponse.ok) {
        router.push('/login');
        return;
      }

      const { access } = loginData;

      auth.setToken(access); // Сохраняем токен
      router.push('/'); // Перенаправление на главную страницу
    } catch (error) {
      console.error('Произошла ошибка:', error);
      setErrors(prev => ({
        ...prev,
        general:
          error instanceof Error
            ? error.message
            : 'Произошла непредвиденная ошибка при регистрации',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Регистрация</h1>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="black-y-4">
          {['username', 'email', 'password', 'password2'].map(field => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-black mb-1"
              >
                {field === 'username'
                  ? 'Имя пользователя *'
                  : field === 'password2'
                  ? 'Подтвердите пароль *'
                  : `${field.charAt(0).toUpperCase() + field.slice(1)} *`}
              </label>
              <input
                type={field.includes('password') ? 'password' : 'text'}
                id={field}
                name={field}
                value={
                  (formData as Record<string, string>)[field] ||
                  ''
                }
                onChange={handleChange}
                className={clsx(
                  'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-black',
                  (errors as Record<string, string | undefined>)[field]
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-yellow-200'
                )}
                disabled={isSubmitting}
                    aria-invalid={!!(errors as Record<string, string | undefined>)[field]}
                    aria-describedby={(errors as Record<string, string | undefined>)[field] ? `${field}-error` : undefined}
              />
              {(errors as Record<string, string | undefined>)[field] && (
                <p id={`${field}-error`} className="mt-1 text-sm text-red-600">
                  {(errors as Record<string, string | undefined>)[field]}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className={clsx(
              'w-full py-2 px-4 rounded-md font-bold transition-colors',
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-yellow-500 hover:bg-yellow-600 text-black'
            )}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-black">
            Уже есть аккаунт?{' '}
            <Link
              href="/login"
              className="text-yellow-600 hover:underline"
              aria-disabled={isSubmitting}
            >
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}