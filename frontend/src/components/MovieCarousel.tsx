'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import MovieCard from './MovieCard';
import { Movie } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { motion, AnimatePresence } from 'framer-motion';

export default function MovieCarousel({ movies }: { movies: Movie[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left'|'right'>('right');
  const isMobile = useMediaQuery('(max-width: 640px)');
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
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors z-10"
          aria-label="Previous movies"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors z-10"
          aria-label="Next movies"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="relative h-[400px]">
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
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}