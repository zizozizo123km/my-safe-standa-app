export type MediaType = 'movie' | 'series' | 'documentary' | 'short';

export interface Genre {
  id: number;
  name: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  release_date: string; // YYYY-MM-DD
  rating: number; // e.g., 8.5
  poster_url: string;
  backdrop_url: string;
  overview: string;
  duration_minutes: number;
  genres: Genre[];
  is_trending: boolean;
  maturity_rating: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';
  // Additional fields common in streaming services
  runtime?: number; // Minutes or total episodes count
}

export interface ApiResponse<T> {
  data: T;
  total_results: number;
  page: number;
  total_pages: number;
}

// Ensure type safety for environment variables
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Add other custom environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}