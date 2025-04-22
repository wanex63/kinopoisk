// frontend/src/lib/movies.ts
import { api } from './api';
import { Movie } from './types';

export async function getMovies(search?: string): Promise<Movie[]> {
  try {
    return await api.get('/movies/', search ? { search } : undefined);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

export async function getMovie(id: number): Promise<Movie | null> {
  try {
    return await api.get(`/movies/${id}/`);
  } catch (error) {
    console.error(`Error fetching movie ${id}:`, error);
    return null;
  }
}

export async function getPopularMovies(): Promise<Movie[]> {
  try {
    const movies = await getMovies();
    return movies.slice(0, 10);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
}