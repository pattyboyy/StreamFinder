// src/types/movie.ts
export interface Movie {
    id: string;
    title: string;
    overview: string;
    posterPath: string;
    releaseDate: string;
    type: 'movie' | 'tv';
    rating?: number;
  }