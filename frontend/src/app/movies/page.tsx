'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MovieListItem } from '@/types/movie';
import MoviePlaceholder from '@/components/MoviePlaceholder';
import moviesData from '@/data/movies.json';

// Трансформируем данные в нужный формат
const MOVIES_LIST: MovieListItem[] = moviesData.map(movie => ({
  id: movie.id,
  title: movie.title,
  year: movie.year,
  rating: movie.rating,
  image: movie.image,
  genre: movie.genre
}));

const MovieCard = ({ movie }: { movie: MovieListItem }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Link 
      href={`/movies/${movie.id}`}
      className="block transition-transform hover:scale-[1.02] hover:shadow-lg rounded-lg overflow-hidden bg-white"
    >
      <div className="relative h-[300px] md:h-[350px]">
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
        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-md font-bold z-10">
          {movie.rating.toFixed(1)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{movie.title}</h3>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{movie.year}</span>
          <span className="truncate ml-2">{movie.genre}</span>
        </div>
      </div>
    </Link>
  );
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<MovieListItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // В реальном проекте здесь был бы API запрос
    // Эмулируем загрузку с сервера
    setLoading(true);
    setTimeout(() => {
      setMovies(MOVIES_LIST);
      setLoading(false);
    }, 500);
  }, []);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Фильмы</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 h-[300px] rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Фильмы</h1>
      
      {movies.length === 0 ? (
        <p className="text-center text-gray-600">Фильмы не найдены</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
} 