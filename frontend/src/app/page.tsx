'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { MovieListItem } from '@/types/movie';
import MoviePlaceholder from '@/components/MoviePlaceholder';
import MovieCarousel from '@/components/MovieCarousel';
import moviesData from '@/data/movies.json';
import { HeartIcon } from '@heroicons/react/24/solid';

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
  
  // Вычисляем количество страниц
  const totalPages = Math.ceil(POPULAR_MOVIES.length / moviesPerPage);
  
  // Получаем фильмы для текущей страницы
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = POPULAR_MOVIES.slice(indexOfFirstMovie, indexOfLastMovie);
  
  // Функции для пагинации
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToPage = (pageNumber: number) => setCurrentPage(pageNumber);
  
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-8 border-l-4 border-orange-500">
            <h1 className="text-4xl font-bold mb-4">Добро пожаловать на Кинопоиск</h1>
            <p className="text-xl mb-6 text-gray-300">Найдите и откройте для себя лучшие фильмы со всего мира</p>
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
            <h2 className="text-2xl font-bold">Все фильмы</h2>
            {favorites.length > 0 && (
              <Link href="/favorites" className="text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1">
                <HeartIcon className="h-5 w-5" />
                <span>Избранное ({favorites.length})</span>
              </Link>
            )}
          </div>
          
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