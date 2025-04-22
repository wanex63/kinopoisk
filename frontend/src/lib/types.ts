export type Movie = {
  id: number;
  title: string;
  original_title: string;
  description: string;
  year: number;
  rating: number | null;
  poster_url: string;
  genres: Genre[];
  duration: number;
  countries: string[];
};

export type Genre = {
  id: number;
  name: string;
};