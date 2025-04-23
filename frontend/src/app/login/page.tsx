'use client';

import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

type FormData = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await axios.post('/api/auth/login/', {
        username: data.username,
        password: data.password,
      });

      // Если получен токен, сохраняем его и перенаправляем на главную
      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        router.push('/');
      } else {
        setError('Ошибка авторизации');
      }
    } catch (err: any) {
      // Проверяем наличие подробных ошибок валидации
      if (err.response?.data) {
        // Если это объект с ошибками валидации, отображаем первую
        const errData = err.response.data;
        const firstError = 
          errData.username?.[0] || 
          errData.password?.[0] || 
          errData.detail ||
          'Неверные учетные данные. Пожалуйста, попробуйте снова';
        setError(firstError);
      } else {
        setError('Неверные учетные данные. Пожалуйста, попробуйте снова');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Вход в аккаунт</h1>
          <p className="text-gray-600 mt-2">
            Введите свои данные для входа
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-black">Имя пользователя</Label>
            <Input
              id="username"
              autoComplete="username"
              {...register('username', {
                required: 'Имя пользователя обязательно',
              })}
              className="mt-1 text-black"
            />
            {errors.username && (
              <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-black">Пароль</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password', {
                required: 'Пароль обязателен',
                minLength: {
                  value: 8,
                  message: 'Пароль должен быть не менее 8 символов',
                },
              })}
              className="mt-1 text-black"
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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

        <div className="text-center text-sm text-gray-600">
          Нет аккаунта?{' '}
          <Link
            href="/register"
            className="text-blue-600 hover:underline"
          >
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
}