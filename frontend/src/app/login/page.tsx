'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { auth } from '@/lib/client-api';
import Link from "next/link";

type FormData = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.detail || 'Ошибка авторизации');
      }

      if (responseData.access) {
        auth.setToken(responseData.access);
        if (responseData.refresh) {
          localStorage.setItem('refreshToken', responseData.refresh);
        }
        router.push('/');
      } else {
        setError('Ошибка авторизации');
      }
    } catch (err: any) {
      setError(err.message || 'Неверные учетные данные. Пожалуйста, попробуйте снова');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-6">
        {/* Заголовок формы */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Вход в аккаунт</h1>
          <p className="text-gray-600 mt-2">
            Введите свои данные для входа
          </p>
        </div>

        {/* Сообщение об ошибке */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Форма входа */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Поле имени пользователя */}
          <div>
            <Label htmlFor="username" className="text-gray-900">Имя пользователя</Label>
            <Input
              id="username"
              autoComplete="username"
              {...register('username', {
                required: 'Имя пользователя обязательно',
              })}
              className="mt-1 text-gray-900 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            />
            {errors.username && (
              <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Поле пароля */}
          <div>
            <Label htmlFor="password" className="text-gray-900">Пароль</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                {...register('password', {
                  required: 'Пароль обязателен',
                  minLength: {
                    value: 8,
                    message: 'Пароль должен быть не менее 8 символов',
                  },
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

          {/* Кнопка входа */}
          <Button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Вход...
              </>
            ) : 'Войти'}
          </Button>
        </form>

        {/* Ссылка на регистрацию */}
        <div className="text-center text-sm text-gray-600">
          Нет аккаунта?{' '}
          <Link
            href="/register"
            className="text-orange-600 hover:underline"
          >
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
}