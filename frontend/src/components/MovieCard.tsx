'use client';

import Link from 'next/link';
import { StarIcon } from '@heroicons/react/24/solid';
import { Movie } from '@/lib/types';

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/movies/${movie.id}`}>
        <div className="relative pb-[150%]">
          <img
            src={movie.poster_url || '/placeholder.jpg'}
            alt={movie.title}
            className="absolute h-full w-full object-cover"
          />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/movies/${movie.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-yellow-600">
            {movie.title}
          </h3>
        </Link>

        <div className="flex items-center text-gray-600 text-sm mb-2">
          <span>{movie.year}</span>
          {movie.rating && (
            <>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                <span>{movie.rating.toFixed(1)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}