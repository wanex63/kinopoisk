'use client';

import Link from 'next/link';
import { StarIcon, HeartIcon, PlayIcon } from '@heroicons/react/24/solid';
import { Movie } from '@/lib/types';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function MovieCard({ movie }: { movie: Movie }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const router = useRouter();
  
  const handleWatchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/movies/${movie.id}/watch`);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/movies/${movie.id}`} className="block relative">
        <div className="relative aspect-[2/3]">
          {!imgError ? (
            <Image
              src={movie.poster_url || '/placeholder.jpg'}
              alt={movie.title}
              fill
              className="object-cover transition-transform duration-300"
              style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onError={() => setImgError(true)}
              priority={false}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image</span>
            </div>
          )}

          <div className="absolute bottom-0 inset-x-0 bg-black bg-opacity-70 py-2 px-2 flex items-center justify-center">
            <button 
              onClick={handleWatchClick}
              className="bg-orange-500 hover:bg-orange-600 text-black font-semibold py-1 px-3 rounded-full flex items-center transition-all duration-200 transform hover:scale-105 w-full justify-center"
            >
              <PlayIcon className="h-4 w-4 mr-1" />
              Смотреть онлайн
            </button>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className={cn(
            "absolute top-2 right-2 p-2 rounded-full transition-colors",
            isFavorite ? 'text-red-500 bg-white/90' : 'text-gray-400 bg-white/70 hover:bg-white/90'
          )}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon className="h-5 w-5" />
        </button>
      </Link>

      <div className="p-4">
        <Link href={`/movies/${movie.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors line-clamp-2">
            {movie.title}
          </h3>
        </Link>

        <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-400 text-sm gap-2">
          <span>{movie.year}</span>

          {movie.rating && (
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          )}

          {movie.genres.slice(0, 2).map(genre => (
            <span key={genre.id} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {genre.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}