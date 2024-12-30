// src/types/props.ts
import { Movie } from './movie';
import { StreamingProvider } from './streaming';

export interface MovieCardProps {
  movie: Movie;
}

export interface StreamingBadgeProps {
  provider: StreamingProvider;
  price?: number;
}

export interface LayoutProps {
  children: React.ReactNode;
}