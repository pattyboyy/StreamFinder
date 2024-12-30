// src/pages/Watchlist.tsx
import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/MovieCard';
import Attribution from '@/components/Attribution';

export const Watchlist: React.FC = () => {
  const { watchlist } = useWatchlist();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlist.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          Your watchlist is empty. Start adding movies and shows!
        </p>
      )}

      {/* Attribution Section */}
      {watchlist.length > 0 && (
        <Attribution />
      )}
    </div>
  );
};

export default Watchlist;
