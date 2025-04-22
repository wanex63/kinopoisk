'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import MovieCard from './MovieCard';
import { Movie } from '@/lib/types';
import { useState } from 'react';

export default function MovieCarousel({ movies }: { movies: Movie[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5;

  const nextSlide = () => {
    setCurrentIndex(prev =>
      prev + itemsPerPage >= movies.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex(prev =>
      prev === 0 ? movies.length - itemsPerPage : prev - 1
    );
  };

  const visibleMovies = movies.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          aria-label="Previous movies"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          aria-label="Next movies"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {visibleMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}