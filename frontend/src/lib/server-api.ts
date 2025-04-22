import axios from 'axios';

const serverApi = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export async function getMovies(search?: string) {
  const params = search ? { search } : {};
  const response = await serverApi.get('/movies/', { params });
  return response.data;
}

export async function getPopularMovies() {
  const movies = await getMovies();
  return movies.slice(0, 10);
}