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
import { Loader2, Camera, X, LogOut, Edit, Heart, Film, User } from 'lucide-react';
import { JwtPayload } from 'jwt-decode';
import Link from 'next/link';
import { MovieListItem } from '@/types/movie';
import MoviePlaceholder from '@/components/MoviePlaceholder';
import moviesData from '@/data/movies.json';

interface UserJwtPayload extends JwtPayload {
  username?: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

interface UserData {
  username: string;
  email: string;
  bio: string;
  avatar?: string;
}

const ALL_MOVIES: MovieListItem[] = moviesData.map(movie => ({
  id: movie.id,
  title: movie.title,
  year: movie.year,
  rating: movie.rating,
  image: movie.image,
  genre: movie.genre
}));

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'favorites'>('profile');
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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<MovieListItem[]>([]);

  // Загрузка данных пользователя
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const currentUser = auth.getCurrentUser() as UserJwtPayload | null;

        if (!currentUser) {
          router.push('/login');
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get('http://localhost:8000/api/auth/', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userData: UserData = {
          username: response.data.username || currentUser.username || '',
          email: response.data.email || currentUser.email || '',
          bio: response.data.bio || currentUser.bio || '',
          avatar: response.data.avatar
        };

        setUser(userData);
        setEditedUser({
          username: userData.username,
          email: userData.email,
          bio: userData.bio
        });
      } catch (error) {
        console.error('Failed to fetch user:', error);
        const currentUser = auth.getCurrentUser() as UserJwtPayload | null;
        if (currentUser) {
          const userData: UserData = {
            username: currentUser.username || '',
            email: currentUser.email || '',
            bio: currentUser.bio || ''
          };
          setUser(userData);
          setEditedUser(userData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Загрузка избранных фильмов
  useEffect(() => {
    if (!loading) {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        try {
          const parsedFavorites = JSON.parse(storedFavorites);
          setFavorites(parsedFavorites);
          setFavoriteMovies(ALL_MOVIES.filter(movie => parsedFavorites.includes(movie.id)));
        } catch (e) {
          console.error('Error parsing favorites:', e);
        }
      }
    }
  }, [loading]);

  const handleLogout = () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
      auth.removeToken();
      router.push('/login');
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setAvatarPreview(null);
    setAvatar(null);
    if (user) {
      setEditedUser({
        username: user.username,
        email: user.email,
        bio: user.bio
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const saveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const formData = new FormData();
      formData.append('username', editedUser.username);
      formData.append('email', editedUser.email);
      formData.append('bio', editedUser.bio);
      if (avatar) formData.append('avatar', avatar);

      const response = await axios.put('http://localhost:8000/api/auth/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setUser(response.data);
      setSuccess('Профиль успешно обновлен');
      setIsEditing(false);
      setAvatarPreview(null);
      setAvatar(null);
      
      // Сохраняем аватар в localStorage для доступа на других страницах
      if (response.data.avatar) {
        localStorage.setItem('userAvatar', response.data.avatar);
        
        // Создаем событие для обновления UI в других компонентах
        const updateEvent = new CustomEvent('user-profile-updated', { 
          detail: { avatar: response.data.avatar } 
        });
        window.dispatchEvent(updateEvent);
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      setError(error.response?.data?.detail || 'Ошибка при обновлении профиля');
    } finally {
      setIsSaving(false);
    }
  };

  const removeFavorite = (id: string) => {
    if (confirm('Удалить фильм из избранного?')) {
      const newFavorites = favorites.filter(movieId => movieId !== id);
      setFavorites(newFavorites);
      setFavoriteMovies(ALL_MOVIES.filter(movie => newFavorites.includes(movie.id)));
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setSuccess('Фильм удален из избранного');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Пользователь не найден</p>
      </div>
    );
  }

  const renderProfileContent = () => {
    if (isEditing) {
      return (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <User className="h-6 w-6 text-orange-500" />
            Редактирование профиля
          </h2>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mb-6 flex flex-col items-center">
            <div
              className="relative w-24 h-24 mb-2 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {avatarPreview ? (
                <Image src={avatarPreview} alt="Preview" fill className="object-cover" />
              ) : user?.avatar ? (
                <Image src={user.avatar} alt="Avatar" fill className="object-cover" />
              ) : (
                <User className="h-12 w-12 text-orange-500" />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />

            {(avatarPreview || user?.avatar) && (
              <button
                onClick={removeAvatar}
                className="text-red-500 hover:text-red-400 text-sm flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Удалить фото
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                name="username"
                value={editedUser.username}
                onChange={handleInputChange}
                className="mt-1 bg-gray-800"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={editedUser.email}
                onChange={handleInputChange}
                className="mt-1 bg-gray-800"
              />
            </div>
            <div>
              <Label htmlFor="bio">О себе</Label>
              <Input
                id="bio"
                name="bio"
                value={editedUser.bio}
                onChange={handleInputChange}
                className="mt-1 bg-gray-800"
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="secondary"
                onClick={cancelEdit}
                disabled={isSaving}
              >
                Отмена
              </Button>
              <Button
                onClick={saveProfile}
                disabled={isSaving}
                className="bg-orange-500 hover:bg-orange-600 text-black"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Сохранение...
                  </>
                ) : 'Сохранить'}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6 text-orange-500" />
            Профиль пользователя
          </h2>

          <Button
            onClick={handleEditProfile}
            className="bg-orange-500 hover:bg-orange-600 text-black"
          >
            <Edit className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
        </div>

        {success && (
          <Alert className="mb-4 bg-green-900/20 border-green-800">
            <AlertDescription className="text-green-300">{success}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-2 bg-gray-800 flex items-center justify-center">
              {user?.avatar ? (
                <Image src={user.avatar} alt="Avatar" width={96} height={96} className="object-cover" />
              ) : (
                <User className="h-12 w-12 text-orange-500" />
              )}
            </div>
          </div>

          <div className="space-y-4 flex-grow">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Имя пользователя</h3>
              <p className="text-white">{user?.username || 'Не указано'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">Email</h3>
              <p className="text-white">{user?.email || 'Не указано'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400">О себе</h3>
              <p className="text-white">{user?.bio || 'Не указано'}</p>
            </div>

            <div className="pt-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Статистика</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800 rounded-md text-center">
                  <p className="text-xl font-bold text-orange-500">{favorites.length}</p>
                  <p className="text-gray-400 text-sm">Избранных фильмов</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-md text-center">
                  <p className="text-xl font-bold text-orange-500">0</p>
                  <p className="text-gray-400 text-sm">Рецензий</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <Button
            variant="destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Выйти из аккаунта
          </Button>
        </div>
      </div>
    );
  };

  const renderFavoritesContent = () => (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Heart className="h-6 w-6 text-orange-500" />
        Избранные фильмы
      </h2>

      {favoriteMovies.length === 0 ? (
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <Heart className="h-16 w-16 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">Список избранного пуст</h3>
          <p className="text-gray-400 mb-6">Добавьте фильмы в избранное, чтобы они отображались здесь</p>
          <Link
            href="/"
            className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <Film className="h-4 w-4 mr-2" />
            Смотреть каталог
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteMovies.map(movie => (
            <FavoriteMovieCard
              key={movie.id}
              movie={movie}
              onRemove={removeFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Боковая панель */}
          <div className="w-full md:w-1/4">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 sticky top-8">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-orange-700 rounded-full flex items-center justify-center text-white mb-4">
                  {user?.avatar ? (
                    <Image src={user.avatar} alt="Avatar" width={96} height={96} className="object-cover rounded-full" />
                  ) : (
                    <User className="h-12 w-12" />
                  )}
                </div>
                <h2 className="text-xl font-bold">{user?.username || 'Гость'}</h2>
                <p className="text-gray-400">Пользователь</p>
              </div>

              <div className="space-y-2">
                <Button
                  variant={activeTab === 'profile' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('profile')}
                  className="w-full justify-start gap-2"
                >
                  <User className="h-5 w-5" />
                  Профиль
                </Button>

                <Button
                  variant={activeTab === 'favorites' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('favorites')}
                  className="w-full justify-start gap-2"
                >
                  <Heart className="h-5 w-5" />
                  Избранное
                  {favorites.length > 0 && (
                    <span className="ml-auto bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                      {favorites.length}
                    </span>
                  )}
                </Button>

                <Link href="/" className="w-full">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Film className="h-5 w-5" />
                    Все фильмы
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Основной контент */}
          <div className="w-full md:w-3/4">
            {activeTab === 'profile' ? renderProfileContent() : renderFavoritesContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

function FavoriteMovieCard({ movie, onRemove }: {
  movie: MovieListItem;
  onRemove: (id: string) => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative group rounded-lg overflow-hidden bg-gray-800 border border-gray-700 transition-transform hover:scale-[1.02]">
      <Link href={`/movies/${movie.id}`} className="block">
        <div className="relative h-[200px]">
          {!imgError ? (
            <Image
              src={movie.image}
              alt={movie.title}
              width={300}
              height={200}
              className="object-cover w-full h-full transition-opacity group-hover:opacity-90"
              onError={() => setImgError(true)}
            />
          ) : (
            <MoviePlaceholder title={movie.title} className="absolute inset-0" />
          )}
          <div className="absolute top-2 right-2 bg-orange-500 text-black px-2 py-1 rounded-md font-bold">
            {movie.rating.toFixed(1)}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold line-clamp-1">{movie.title}</h3>
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>{movie.year}</span>
            <span className="truncate ml-2">{movie.genre}</span>
          </div>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(movie.id);
        }}
        className="absolute top-2 left-2 p-2 rounded-full bg-orange-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-600"
        >
          <Heart className="h-4 w-4 fill-current" />
        </button>
    </div>
  );
}