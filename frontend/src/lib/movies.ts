import { api } from './api';
import { Movie } from './types';

const CACHE_EXPIRY = 60 * 60 * 1000; // 1 час

const movieCache: Record<string, { data: any; timestamp: number }> = {};

async function cachedRequest<T>(key: string, request: () => Promise<T>): Promise<T> {
  const now = Date.now();

  if (movieCache[key] && now - movieCache[key].timestamp < CACHE_EXPIRY) {
    return movieCache[key].data;
  }

  const data = await request();
  movieCache[key] = { data, timestamp: now };
  return data;
}

export async function getMovies(search?: string): Promise<Movie[]> {
  const cacheKey = `movies_${search || 'all'}`;
  return cachedRequest(cacheKey, async () => {
    return api.get<Movie[]>('/movies/', search ? { search } : undefined);
  });
}

export async function getMovie(id: number): Promise<Movie | null> {
  const cacheKey = `movie_${id}`;
  try {
    return await cachedRequest(cacheKey, async () => {
      return api.get<Movie>(`/movies/${id}/`);
    });
  } catch (error) {
    console.error(`Error fetching movie ${id}:`, error);
    return null;
  }
}

export async function getPopularMovies(): Promise<Movie[]> {
  const cacheKey = 'movies_popular';
  return cachedRequest(cacheKey, async () => {
    const movies = await getMovies();
    return movies
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10);
  });
}