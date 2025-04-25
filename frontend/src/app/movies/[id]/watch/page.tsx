'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Movie } from '@/types/movie';
import moviesData from '@/data/movies.json';

export default function WatchMoviePage() {
  const params = useParams();
  const movieId = params.id as string;
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Эмулируем загрузку для лучшего UX
    setTimeout(() => {
      try {
        const foundMovie = moviesData.find(m => m.id === movieId);
        
        if (foundMovie) {
          setMovie(foundMovie as Movie);
        } else {
          setError('Фильм не найден');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [movieId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Загрузка фильма...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto p-4 min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">Ошибка</h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">{error || 'Фильм не найден'}</p>
          <Link href="/movies" className="bg-orange-500 hover:bg-orange-600 text-black px-4 py-2 rounded-md font-medium">
            Вернуться к списку фильмов
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center mb-6">
        <Link href={`/movies/${movieId}`} className="flex items-center text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300">
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          <span>Назад к информации о фильме</span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold">{movie.title}</h1>
      
      <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
        {/* Здесь будет видеоплеер */}
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-center p-6">
            <h2 className="text-xl text-white mb-4">Фильм "{movie.title}" доступен для просмотра</h2>
            <p className="text-gray-300 mb-6">
              В реальном проекте здесь будет размещен видеоплеер с контентом фильма.
            </p>
            <div className="bg-orange-500 inline-block px-6 py-3 rounded-full text-black font-medium">
              Предполагается интеграция с видеоплеером
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">О фильме</h2>
        <p className="text-gray-700 dark:text-gray-300">{movie.description}</p>
        
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Детали</h3>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li><span className="font-medium">Год:</span> {movie.year}</li>
              <li><span className="font-medium">Жанр:</span> {movie.genre}</li>
              <li><span className="font-medium">Режиссёр:</span> {movie.director}</li>
              <li><span className="font-medium">Продолжительность:</span> {movie.duration}</li>
              <li><span className="font-medium">Рейтинг:</span> {movie.rating}/10</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">В ролях</h3>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              {movie.cast && movie.cast.map((actor: string, index: number) => (
                <li key={index}>{actor}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 