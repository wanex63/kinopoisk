'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/client-api';
import axios from 'axios';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Camera, X } from 'lucide-react';
import { JwtPayload } from 'jwt-decode';

// Расширяем тип JwtPayload для добавления пользовательских полей
interface UserJwtPayload extends JwtPayload {
  username?: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

// Интерфейс для данных пользователя
interface UserData {
  username: string;
  email: string;
  bio: string;
  avatar?: string;
  [key: string]: any; // Для других полей, которые могут быть в ответе API
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserData>({
    username: '',
    email: '',
    bio: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      // Проверка, авторизован ли пользователь
      const currentUser = auth.getCurrentUser() as UserJwtPayload | null;
      if (!currentUser) {
        router.push('/login');
        return;
      }

      try {
        // Получение данных профиля из API
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/auth/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Если запрос успешен, сохраняем данные пользователя
        const userData: UserData = {
          username: response.data.username || currentUser.username || '',
          email: response.data.email || currentUser.email || '',
          bio: response.data.bio || currentUser.bio || '',
          avatar: response.data.avatar,
          ...response.data
        };
        setUser(userData);
        // Инициализируем поля редактирования текущими данными пользователя
        setEditedUser({
          username: userData.username,
          email: userData.email,
          bio: userData.bio || ''
        });
      } catch (error) {
        console.error('Failed to fetch user:', error);
        // Если запрос не удался, используем данные из JWT токена
        if (currentUser) {
          const userData: UserData = {
            username: currentUser.username || '',
            email: currentUser.email || '',
            bio: currentUser.bio || ''
          };
          setUser(userData);
          setEditedUser({
            username: userData.username,
            email: userData.email,
            bio: userData.bio
          });
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    auth.removeToken();
    router.push('/login');
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    setAvatarPreview(null);
    setAvatar(null);
    // Сбрасываем изменения
    setEditedUser({
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      
      // Создаем FormData для отправки файлов
      const formData = new FormData();
      formData.append('username', editedUser.username);
      formData.append('email', editedUser.email);
      formData.append('bio', editedUser.bio || '');
      
      if (avatar) {
        formData.append('avatar', avatar);
      }

      const response = await axios.put('http://localhost:8000/api/auth/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Обновляем данные пользователя
      setUser(prev => {
        if (!prev) return response.data;
        return { ...prev, ...response.data };
      });
      
      setSuccess('Профиль успешно обновлен');
      setIsEditing(false);
      setAvatarPreview(null);
      setAvatar(null);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setError(
        error.response?.data?.detail || 
        'Не удалось обновить профиль. Пожалуйста, попробуйте еще раз.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <span className="ml-2 text-xl">Загрузка...</span>
      </div>
    );
  }

  // Безопасно получаем данные пользователя
  const username = user?.username || (user?.email ? user.email.split('@')[0] : '');
  const email = user?.email || '';
  const bio = user?.bio || 'Информация о пользователе отсутствует';

  const renderProfileContent = () => {
    if (isEditing) {
      return (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Ваше фото</h2>
            <div className="flex flex-col items-center">
              {avatarPreview ? (
                <div className="relative">
                  <Image 
                    src={avatarPreview} 
                    alt={username} 
                    width={150} 
                    height={150}
                    className="rounded-full mb-4 object-cover" 
                  />
                  <button 
                    onClick={handleRemoveAvatar}
                    className="absolute top-0 right-0 bg-red-500 rounded-full p-1 text-white"
                    aria-label="Удалить аватар"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : user?.avatar ? (
                <div className="relative">
                  <Image 
                    src={user.avatar} 
                    alt={username} 
                    width={150} 
                    height={150}
                    className="rounded-full mb-4 object-cover" 
                  />
                  <button 
                    onClick={handleAvatarClick}
                    className="absolute bottom-6 right-0 bg-gray-800 rounded-full p-2 text-white opacity-80 hover:opacity-100"
                    aria-label="Изменить аватар"
                  >
                    <Camera size={16} />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-white text-3xl mb-4">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <button 
                    onClick={handleAvatarClick}
                    className="absolute bottom-6 right-0 bg-gray-800 rounded-full p-2 text-white opacity-80 hover:opacity-100"
                    aria-label="Добавить аватар"
                  >
                    <Camera size={16} />
                  </button>
                </div>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="text-sm text-gray-500">Нажмите на иконку камеры, чтобы изменить фото</span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Редактирование профиля</h2>
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-black">Имя пользователя</Label>
                <Input
                  id="username"
                  name="username"
                  value={editedUser.username}
                  onChange={handleInputChange}
                  className="mt-1 text-black"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-black">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={editedUser.email}
                  onChange={handleInputChange}
                  className="mt-1 text-black"
                />
              </div>
              
              <div>
                <Label htmlFor="bio" className="text-black">О себе</Label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={editedUser.bio}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSaveProfile}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Сохранение...
                    </>
                  ) : 'Сохранить изменения'}
                </Button>
                
                <Button
                  onClick={handleCancelEdit}
                  className="bg-gray-500 hover:bg-gray-600"
                  disabled={isSaving}
                >
                  Отмена
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Ваше фото</h2>
          <div className="flex flex-col items-center">
            {user?.avatar ? (
              <Image 
                src={user.avatar} 
                alt={username} 
                width={150} 
                height={150}
                className="rounded-full mb-4 object-cover" 
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-white text-3xl mb-4">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xl font-medium">{username}</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Личная информация</h2>
            <Button 
              onClick={handleEditClick}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Редактировать
            </Button>
          </div>
          
          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Имя пользователя</h3>
              <p className="text-gray-900">{username}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="text-gray-900">{email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">О себе</h3>
              <p className="text-gray-900">{bio}</p>
            </div>
            
            <Button
              onClick={handleLogout}
              className="mt-6 bg-red-600 hover:bg-red-700"
            >
              Выйти из аккаунта
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileContent();
      case 'favorites':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Избранные фильмы</h2>
            {user?.favorites && user.favorites.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Здесь можно отобразить избранные фильмы */}
                <p>Список избранных фильмов будет здесь</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">У вас пока нет избранных фильмов</p>
                <Button 
                  onClick={() => router.push('/movies')}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Найти фильмы
                </Button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ваш профиль</h1>
          <p className="text-gray-600">Управляйте своим аккаунтом</p>
        </div>

        <div className="mb-6 flex border-b">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'profile' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Профиль
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'favorites' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Избранное
          </button>
        </div>
        
        {renderTabContent()}
      </div>
    </div>
  );
}