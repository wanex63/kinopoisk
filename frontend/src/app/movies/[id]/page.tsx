'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
import { Movie } from '@/types/movie';
import MoviePlaceholder from '@/components/MoviePlaceholder';
import moviesData from '@/data/movies.json';

// Преобразуем данные в формат Record для быстрого поиска по ID
const MOVIES_BY_ID: Record<string, Movie> = moviesData.reduce((acc, movie) => {
  acc[movie.id] = movie as Movie;
  return acc;
}, {} as Record<string, Movie>);

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    const movieId = params.id as string;
    
    // Проверяем, является ли фильм избранным
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      const favorites = JSON.parse(storedFavorites);
      setIsFavorite(favorites.includes(movieId));
    }
    
    // В реальном приложении здесь будет API-запрос
    // fetch(`/api/movies/${movieId}`)
    
    // Эмулируем загрузку с сервера
    setLoading(true);
    setTimeout(() => {
      setMovie(MOVIES_BY_ID[movieId] || null);
      setLoading(false);
    }, 500);
  }, [params.id]);
  
  // Функция для добавления/удаления фильма из избранного
  const toggleFavorite = () => {
    if (!movie) return;
    
    const movieId = movie.id;
    const storedFavorites = localStorage.getItem('favorites');
    let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    
    if (isFavorite) {
      favorites = favorites.filter((id: string) => id !== movieId);
    } else {
      favorites.push(movieId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse flex flex-col md:flex-row gap-8">
            <div className="bg-gray-800 rounded-lg w-full md:w-1/3 h-[400px]"></div>
            <div className="w-full md:w-2/3">
              <div className="h-10 bg-gray-800 rounded mb-4"></div>
              <div className="h-6 bg-gray-800 rounded mb-6 w-2/3"></div>
              <div className="h-40 bg-gray-800 rounded mb-6"></div>
              <div className="h-6 bg-gray-800 rounded mb-2 w-1/2"></div>
              <div className="h-6 bg-gray-800 rounded mb-2 w-1/3"></div>
              <div className="h-6 bg-gray-800 rounded mb-6 w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Фильм не найден</h1>
            <p className="mb-4 text-gray-300">Извините, фильм с ID {params.id} не существует.</p>
            <button 
              onClick={() => router.push('/movies')}
              className="bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 px-4 rounded"
            >
              Вернуться к списку фильмов
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-orange-500 hover:text-orange-400 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Назад
        </button>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-lg bg-gray-900 border border-gray-800">
              {!imgError ? (
                <Image
                  src={movie.image}
                  alt={movie.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                  onError={() => setImgError(true)}
                />
              ) : (
                <MoviePlaceholder 
                  title={movie.title} 
                  className="absolute inset-0 w-full h-full rounded-lg"
                />
              )}
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2 text-white">{movie.title}</h1>
            {movie.original_title && (
              <h2 className="text-xl text-gray-400 mb-2">{movie.original_title}</h2>
            )}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-300">{movie.year}</span>
              <span className="bg-orange-500 text-black px-2 py-1 rounded-md font-bold">
                {movie.rating.toFixed(1)}
              </span>
              <span className="text-gray-300">{movie.duration}</span>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-white">Описание</h2>
              <p className="text-gray-300 leading-relaxed">{movie.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-2 text-white">Детали</h2>
                <div className="space-y-2 text-gray-300">
                  <p><span className="font-semibold text-white">Жанр:</span> {movie.genre}</p>
                  <p><span className="font-semibold text-white">Режиссер:</span> {movie.director}</p>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2 text-white">В главных ролях</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  {movie.cast.map((actor) => (
                    <li key={actor}>{actor}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                onClick={toggleFavorite}
                className={`flex items-center gap-2 font-bold py-3 px-6 rounded-lg transition-colors ${
                  isFavorite
                    ? 'bg-gray-800 text-orange-500 border border-orange-500 hover:bg-gray-700'
                    : 'bg-orange-500 hover:bg-orange-600 text-black'
                }`}
              >
                <HeartIcon className="h-5 w-5" />
                {isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 