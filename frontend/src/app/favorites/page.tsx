'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import { MovieListItem } from '@/types/movie';
import MoviePlaceholder from '@/components/MoviePlaceholder';
import moviesData from '@/data/movies.json';

// Трансформируем данные в нужный формат
const ALL_MOVIES: MovieListItem[] = moviesData.map(movie => ({
  id: movie.id,
  title: movie.title,
  year: movie.year,
  rating: movie.rating,
  image: movie.image,
  genre: movie.genre
}));

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<MovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка избранных фильмов из localStorage при монтировании компонента
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      const parsedFavorites = JSON.parse(storedFavorites);
      setFavorites(parsedFavorites);
      
      // Фильтруем все фильмы, чтобы получить только избранные
      const favMovies = ALL_MOVIES.filter(movie => parsedFavorites.includes(movie.id));
      setFavoriteMovies(favMovies);
    }
    setIsLoading(false);
  }, []);

  // Функция для удаления фильма из избранного
  const removeFromFavorites = (id: string) => {
    const newFavorites = favorites.filter(movieId => movieId !== id);
    setFavorites(newFavorites);
    setFavoriteMovies(favoriteMovies.filter(movie => movie.id !== id));
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  // Функция для очистки всего списка избранного
  const clearFavorites = () => {
    setFavorites([]);
    setFavoriteMovies([]);
    localStorage.setItem('favorites', JSON.stringify([]));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Link 
              href="/" 
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold">Избранные фильмы</h1>
          </div>
          
          {favoriteMovies.length > 0 && (
            <button 
              onClick={clearFavorites}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Очистить список
            </button>
          )}
        </div>

        {favoriteMovies.length === 0 ? (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
              <HeartIcon className="h-16 w-16 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Список избранного пуст</h2>
            <p className="text-gray-400 mb-6">Добавьте фильмы в избранное, чтобы они отображались здесь</p>
            <Link 
              href="/" 
              className="inline-block bg-orange-500 hover:bg-orange-600 text-black font-bold py-3 px-6 rounded-lg transition-colors"
            >
              На главную
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteMovies.map(movie => (
              <FavoriteMovieCard 
                key={movie.id} 
                movie={movie} 
                onRemove={removeFromFavorites} 
              />
            ))}
          </div>
        )}
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
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
        onClick={() => onRemove(movie.id)}
        className="absolute top-3 left-3 p-2 rounded-full bg-orange-500 text-white z-20 hover:bg-orange-600 transition-colors"
        aria-label="Удалить из избранного"
      >
        <HeartIcon className="h-5 w-5" />
      </button>
    </div>
  );
} 