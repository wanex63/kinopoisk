'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

// Define the form data type
interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const response = await axios.post('/api/auth/register/', {
        username: data.username,
        email: data.email,
        password: data.password,
        avatar: null,
        bio: ''
      });

      // Если статус 201 или есть поле detail в ответе, считаем регистрацию успешной
      if (response.status === 201 || response.data.detail) {
        window.location.href = '/';
      } else {
        setServerError(response.data.message || 'Ошибка регистрации');
      }
    } catch (error: any) {
      // Проверяем наличие подробных ошибок валидации
      if (error.response?.data) {
        // Если это объект с ошибками валидации, отображаем первую
        const errData = error.response.data;
        let firstError = 
          errData.username?.[0] || 
          errData.email?.[0] || 
          errData.password?.[0] || 
          errData.detail ||
          error.response.data.message ||
          'Ошибка регистрации';
          
        // Делаем сообщение более дружелюбным
        if (firstError === 'A user with that username already exists.') {
          firstError = 'Пользователь с таким именем уже существует. Пожалуйста, выберите другое имя.';
        }
        
        setServerError(firstError);
      } else {
        setServerError('Ошибка соединения. Попробуйте позже');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Регистрация</h1>
          <p className="text-gray-600 mt-2">
            Создайте новый аккаунт
          </p>
        </div>

        {serverError && (
          <Alert variant="destructive">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-black">Имя пользователя</Label>
            <Input
              id="username"
              {...register('username', { required: 'Обязательное поле' })}
              className="mt-1 text-black"
            />
            {errors.username && (
              <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-black">Email</Label>
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
              className="mt-1 text-black"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-black">Пароль</Label>
            <Input
              id="password"
              type="password"
              {...register('password', {
                required: 'Обязательное поле',
                minLength: {
                  value: 8,
                  message: 'Минимум 8 символов'
                }
              })}
              className="mt-1 text-black"
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-black">Подтвердите пароль</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', { required: 'Обязательное поле' })}
              className="mt-1 text-black"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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

        <div className="text-center text-sm text-gray-600">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}