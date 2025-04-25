'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { MovieListItem } from '@/types/movie';
import MoviePlaceholder from '@/components/MoviePlaceholder';
import MovieCarousel from '@/components/MovieCarousel';
import moviesData from '@/data/movies.json';
import { HeartIcon, MagnifyingGlassIcon, PlayIcon } from '@heroicons/react/24/solid';
import { auth } from '@/lib/client-api';
import { JwtPayload } from 'jwt-decode';
import { useRouter } from 'next/navigation';

interface UserJwtPayload extends JwtPayload {
  username?: string;
  email?: string;
  avatar?: string;
}

// Трансформируем данные в нужный формат
const POPULAR_MOVIES: MovieListItem[] = moviesData.map(movie => ({
  id: movie.id,
  title: movie.title,
  year: movie.year,
  rating: movie.rating,
  image: movie.image,
  genre: movie.genre
}));

const MovieCard = ({ movie, isFavorite, onToggleFavorite }: {
  movie: MovieListItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}) => {
  const [imgError, setImgError] = useState(false);
  const router = useRouter();
  
  const handleWatchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/movies/${movie.id}/watch`);
  };

  return (
    <div className="block transition-transform hover:scale-[1.02] hover:shadow-lg rounded-lg overflow-hidden bg-gray-900 border border-gray-800 relative">
      <Link
        href={`/movies/${movie.id}`}
        className="block"
      >
        <div className="relative h-[300px]">
          {!imgError ? (
            <Image
              src={movie.image}
              alt={movie.title}
              fill
              style={{ objectFit: 'cover' }}
              className="transition-opacity hover:opacity-95"
              onError={() => setImgError(true)}
            />
          ) : (
            <MoviePlaceholder
              title={movie.title}
              className="absolute inset-0 w-full h-full"
            />
          )}
          <div className="absolute top-2 right-2 bg-orange-500 text-black px-2 py-1 rounded-md font-bold z-10">
            {movie.rating.toFixed(1)}
          </div>
          
          {/* Кнопка "Смотреть онлайн" */}
          <div className="absolute bottom-0 inset-x-0 bg-black bg-opacity-70 py-2 px-2 flex items-center justify-center z-10">
            <button 
              onClick={handleWatchClick}
              className="bg-orange-500 hover:bg-orange-600 text-black font-semibold py-1 px-3 rounded-full flex items-center transition-all duration-200 w-full justify-center"
            >
              <PlayIcon className="h-4 w-4 mr-1" />
              Смотреть онлайн
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1 text-white">{movie.title}</h3>
          <div className="flex justify-between text-sm text-gray-400">
            <span>{movie.year}</span>
            <span className="truncate ml-2">{movie.genre}</span>
          </div>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite(movie.id);
        }}
        className={`absolute top-3 left-3 p-2 rounded-full z-20 transition-colors ${
          isFavorite 
            ? 'bg-orange-500 text-white' 
            : 'bg-black/50 text-gray-400 hover:text-white hover:bg-black/70'
        }`}
        aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
      >
        <HeartIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default function Home() {
  // Состояние для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 3;

  // Состояние для избранных фильмов
  const [favorites, setFavorites] = useState<string[]>([]);

  // Состояние для поиска
  const [searchQuery, setSearchQuery] = useState('');
  
  // Состояние для пользователя
  const [user, setUser] = useState<{username?: string, avatar?: string} | null>(null);

  // Загрузка пользователя при монтировании компонента
  useEffect(() => {
    const currentUser = auth.getCurrentUser() as UserJwtPayload | null;
    if (currentUser) {
      setUser({
        username: currentUser.username,
        avatar: currentUser.avatar
      });
    }
    
    // Добавляем слушатель события обновления профиля
    const handleProfileUpdate = (event: CustomEvent) => {
      const { avatar } = event.detail;
      setUser(prevUser => prevUser ? { ...prevUser, avatar } : null);
    };
    
    window.addEventListener('user-profile-updated', handleProfileUpdate as EventListener);
    
    // Убираем слушатель при размонтировании компонента
    return () => {
      window.removeEventListener('user-profile-updated', handleProfileUpdate as EventListener);
    };
  }, []);

  // Загрузка избранных фильмов из localStorage при монтировании компонента
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Сохранение избранных фильмов в localStorage при изменении состояния
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Функция для добавления/удаления фильма из избранного
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(movieId => movieId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Фильтрация фильмов по поисковому запросу
  const filteredMovies = useMemo(() => {
    if (!searchQuery) return POPULAR_MOVIES;

    const query = searchQuery.toLowerCase();
    return POPULAR_MOVIES.filter(movie =>
      movie.title.toLowerCase().includes(query) ||
      movie.genre.toLowerCase().includes(query) ||
      movie.year.toString().includes(query)
    );
  }, [searchQuery]);

  // Вычисляем количество страниц
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  // Получаем фильмы для текущей страницы
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  // Функции для пагинации
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToPage = (pageNumber: number) => setCurrentPage(pageNumber);

  // Сброс пагинации при изменении поискового запроса
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end items-center mb-6 space-x-4">
          {user ? (
            <Link href="/profile" className="flex items-center space-x-2 bg-gray-900 rounded-full px-3 py-1 hover:bg-gray-800 transition">
              <span>{user.username}</span>
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-orange-700">
                {user.avatar ? (
                  <Image 
                    src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:8000${user.avatar}`} 
                    alt="Avatar" 
                    width={32} 
                    height={32} 
                    className="object-cover" 
                  />
                ) : (
                  <span className="text-sm font-bold">{user.username?.charAt(0).toUpperCase()}</span>
                )}
              </div>
            </Link>
          ) : (
            <Link href="/login" className="text-orange-500 hover:text-orange-400 transition-colors">
              Войти
            </Link>
          )}
        </div>
        
        <section className="mb-12">
          <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-8 border-l-4 border-orange-500">
            <h1 className="text-4xl font-bold mb-4">Добро пожаловать на Кинопоиск</h1>
            <p className="text-xl mb-6 text-gray-300">Найдите и откройте для себя лучшие фильмы со всего мира</p>

            {/* Поисковая строка */}
            <div className="relative mb-6 max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Поиск фильмов по названию, жанру или году..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Link href="/movies" className="inline-block bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 px-6 rounded-lg transition-colors">
              Смотреть каталог
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Популярные фильмы</h2>
            <Link href="/movies" className="text-orange-500 hover:text-orange-400 transition-colors">
              Смотреть все
            </Link>
          </div>

          <MovieCarousel movies={POPULAR_MOVIES} favorites={favorites} onToggleFavorite={toggleFavorite} />
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {searchQuery ? `Результаты поиска: "${searchQuery}"` : 'Все фильмы'}
            </h2>
            {favorites.length > 0 && (
              <Link href="/favorites" className="text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1">
                <HeartIcon className="h-5 w-5" />
                <span>Избранное ({favorites.length})</span>
              </Link>
            )}
          </div>

          {filteredMovies.length === 0 ? (
            <div className="text-center py-12">
              <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Фильмы не найдены</h3>
              <p className="text-gray-500">Попробуйте изменить поисковый запрос</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {currentMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isFavorite={favorites.includes(movie.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>

              {/* Пагинация */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Назад
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === page
                          ? 'bg-orange-500 text-black'
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Вперед
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <section className="mb-12">
          <div className="bg-gray-900 rounded-lg p-6 border-r-4 border-orange-500">
            <h2 className="text-2xl font-bold mb-4">О нашем сервисе</h2>
            <p className="text-gray-300 mb-4">
              Кинопоиск - это платформа для поиска и просмотра информации о фильмах со всего мира.
              Мы предоставляем подробные описания, рейтинги и отзывы, чтобы помочь вам выбрать
              идеальный фильм для просмотра.
            </p>
            <Link href="/about" className="text-orange-500 hover:text-orange-400 transition-colors">
              Узнать больше
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-6 rounded-lg hover:bg-gray-900 transition-colors border border-gray-800">
      <div className="bg-orange-900 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}