'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/client-api';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      setServerError('Пароли не совпадают');
      return;
    }

    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.detail || responseData.message || 'Ошибка регистрации');
      }

      if (responseData.access) {
        auth.setToken(responseData.access);
        if (responseData.refresh) {
          localStorage.setItem('refreshToken', responseData.refresh);
        }
        router.push('/');
      } else {
        router.push('/login');
      }
    } catch (error: any) {
      setServerError(
        error.message === 'A user with that username already exists.'
          ? 'Пользователь с таким именем уже существует'
          : error.message || 'Ошибка регистрации'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-6">
        {/* Заголовок формы */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Регистрация</h1>
          <p className="text-gray-600 mt-2">
            Создайте новый аккаунт
          </p>
        </div>

        {/* Сообщение об ошибке */}
        {serverError && (
          <Alert variant="destructive">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        {/* Форма регистрации */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Поле имени пользователя */}
          <div>
            <Label htmlFor="username" className="text-gray-900">Имя пользователя</Label>
            <Input
              id="username"
              {...register('username', {
                required: 'Обязательное поле',
                minLength: {
                  value: 3,
                  message: 'Минимум 3 символа'
                }
              })}
              className="mt-1 text-gray-900 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            />
            {errors.username && (
              <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Поле email */}
          <div>
            <Label htmlFor="email" className="text-gray-900">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email', {
                required: 'Обязательное поле',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Некорректный email'
                }
              })}
              className="mt-1 text-gray-900 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Поле пароля */}
          <div>
            <Label htmlFor="password" className="text-gray-900">Пароль</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register('password', {
                  required: 'Обязательное поле',
                  minLength: {
                    value: 8,
                    message: 'Минимум 8 символов'
                  }
                })}
                className="mt-1 text-gray-900 border-gray-300 focus:ring-orange-500 focus:border-orange-500 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Поле подтверждения пароля */}
          <div>
            <Label htmlFor="confirmPassword" className="text-gray-900">Подтвердите пароль</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register('confirmPassword', {
                  required: 'Обязательное поле'
                })}
                className="mt-1 text-gray-900 border-gray-300 focus:ring-orange-500 focus:border-orange-500 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* Кнопка регистрации */}
          <Button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Регистрируем...
              </>
            ) : 'Зарегистрироваться'}
          </Button>
        </form>

        {/* Ссылка на вход */}
        <div className="text-center text-sm text-gray-600">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-orange-600 hover:underline">
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}