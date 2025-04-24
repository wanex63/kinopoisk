export interface Movie {
  id: string;
  title: string;
  original_title?: string;
  year: number;
  rating: number;
  duration: string;
  genre: string;
  director: string;
  description: string;
  image: string;
  cast: string[];
}

export interface MovieListItem {
  id: string;
  title: string;
  year: number;
  rating: number;
  image: string;
  genre: string;
}

export interface Comment {
  id: number;
  user: number;
  username: string;
  user_avatar?: string;
  movie: number;
  text: string;
  created_at: string;
  updated_at: string;
} 