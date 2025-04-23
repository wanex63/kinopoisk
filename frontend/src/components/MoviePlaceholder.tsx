'use client';

import { FC } from 'react';

interface MoviePlaceholderProps {
  title?: string;
  className?: string;
}

/**
 * Компонент для отображения заглушки вместо изображения фильма
 */
const MoviePlaceholder: FC<MoviePlaceholderProps> = ({ 
  title = 'Название фильма',
  className = '',
}) => {
  return (
    <div 
      className={`bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4 text-center border border-gray-800 ${className}`}
      style={{ aspectRatio: '2/3' }}
    >
      <div>
        <div className="text-5xl mb-4 text-orange-500">🎬</div>
        <p className="text-orange-300 font-medium">{title}</p>
      </div>
    </div>
  );
};

export default MoviePlaceholder; 