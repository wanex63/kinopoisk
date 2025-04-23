'use client';

import { ChevronLeftIcon, ChevronRightIcon, HeartIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { motion, AnimatePresence } from 'framer-motion';
import { MovieListItem } from '@/types/movie';
import Link from 'next/link';
import Image from 'next/image';
import MoviePlaceholder from './MoviePlaceholder';

export default function MovieCarousel({ 
  movies, 
  favorites = [], 
  onToggleFavorite 
}: { 
  movies: MovieListItem[],
  favorites?: string[],
  onToggleFavorite?: (id: string) => void
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left'|'right'>('right');
  const isMobile = useMediaQuery('(max-width: 140px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

  const itemsPerPage = isMobile ? 1 : isTablet ? 2 : 4;

  const nextSlide = () => {
    setDirection('right');
    setCurrentIndex(prev =>
      prev + itemsPerPage >= movies.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setDirection('left');
    setCurrentIndex(prev =>
      prev === 0 ? Math.max(0, movies.length - itemsPerPage) : prev - 1
    );
  };

  const visibleMovies = movies.slice(
    currentIndex,
    Math.min(currentIndex + itemsPerPage, movies.length)
  );

  // Автопрокрутка каждые 5 секунд
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, itemsPerPage]);

  return (
    <div className="relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors z-10"
          aria-label="Previous movies"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors z-10"
          aria-label="Next movies"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="relative h-[320px]">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction === 'right' ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 'right' ? -100 : 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 absolute inset-0"
          >
            {visibleMovies.map(movie => (
              <CarouselMovieCard 
                key={movie.id} 
                movie={movie} 
                isFavorite={favorites.includes(movie.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Карточка фильма для карусели
function CarouselMovieCard({ 
  movie, 
  isFavorite, 
  onToggleFavorite 
}: { 
  movie: MovieListItem;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}) {
  const [imgError, setImgError] = useState(false);
  
  return (
    <div className="block h-full transition-transform hover:scale-[1.02] hover:shadow-lg rounded-lg overflow-hidden bg-gray-900 border border-gray-800 relative">
      <Link 
        href={`/movies/${movie.id}`}
        className="block h-full"
      >
        <div className="relative h-[200px]">
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
        <div className="p-3">
          <h3 className="text-md font-semibold mb-1 line-clamp-1 text-white">{movie.title}</h3>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{movie.year}</span>
            <span className="truncate ml-2">{movie.genre}</span>
          </div>
        </div>
      </Link>
      {onToggleFavorite && (
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
          <HeartIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}