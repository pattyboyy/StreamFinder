// src/components/MovieCard.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types/movie';
import { StreamingInfo } from '../types/streaming';
import { useWatchlist } from '../context/WatchlistContext';
import { getStreamingInfo } from '../services/api';
import { BookmarkPlus, BookmarkMinus } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const [streamingInfo, setStreamingInfo] = useState<StreamingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inWatchlist = isInWatchlist(movie.id);

  useEffect(() => {
    const fetchStreamingInfo = async () => {
      try {
        setLoading(true);
        const info = await getStreamingInfo(movie.id, movie.type);
        setStreamingInfo(info);
        setError(null);
      } catch (err: any) {
        setError('No streaming information found');
        console.error('Error fetching streaming info:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamingInfo();
  }, [movie.id, movie.type]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <Link to={`/details/${movie.id}`}>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
          alt={movie.title}
          className="w-full h-64 object-cover"
        />
      </Link>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{movie.title}</h3>
          <button
            onClick={() =>
              inWatchlist
                ? removeFromWatchlist(movie.id)
                : addToWatchlist(movie)
            }
            className="text-gray-600 hover:text-primary"
          >
            {inWatchlist ? <BookmarkMinus /> : <BookmarkPlus />}
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {movie.overview}
        </p>

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <p className="text-sm text-red-500 text-center">{error}</p>
        ) : (
          /* STREAMING INFO SECTIONS */
          streamingInfo && (
            <>
              {/* STREAM */}
              {streamingInfo.providers.stream.length > 0 ? (
                <StreamingSection
                  title="Available to Stream"
                  providers={streamingInfo.providers.stream.map((prov) => ({
                    provider: prov,
                    streamingUrl: prov.streamingUrl,
                  }))}
                />
              ) : (
                <p className="text-gray-500 text-center mb-2">
                  Not available to stream
                </p>
              )}

              {/* RENT */}
              {streamingInfo.providers.rent.length > 0 && (
                <StreamingSection
                  title="Available to Rent"
                  providers={streamingInfo.providers.rent}
                />
              )}

              {/* BUY */}
              {streamingInfo.providers.buy.length > 0 && (
                <StreamingSection
                  title="Available to Buy"
                  providers={streamingInfo.providers.buy}
                />
              )}
            </>
          )
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            Released: {new Date(movie.releaseDate).getFullYear()}
          </span>
          {movie.rating && (
            <span className="text-sm text-gray-500 ml-4">
              Rating: {movie.rating.toFixed(1)}/10
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

/**
 * A simple "section" to render a list of providers.
 * For "rent" or "buy", we get an array of StreamingOptions (with provider, etc.)
 */
interface SectionProps {
  title: string;
  providers: {
    provider: {
      id: string;
      name: string;
      logo: string;
      requiresSubscription: boolean;
      streamingUrl?: string;
    };
    price?: number;
    streamingUrl?: string;
  }[];
}
const StreamingSection: React.FC<SectionProps> = ({ title, providers }) => {
  return (
    <div className="mb-4">
      <h4 className="font-semibold mb-2">{title}</h4>
      <div className="space-y-2">
        {providers.map((opt, idx) => (
          <div
            key={`${opt.provider.id}-${idx}`}
            className="flex items-center gap-2 bg-gray-100 p-2 rounded"
          >
            <img
              src={opt.provider.logo}
              alt={opt.provider.name}
              className="w-6 h-6"
            />
            <span>{opt.provider.name}</span>
            {/* Show if the provider requires a subscription or not */}
            {opt.provider.requiresSubscription ? (
              <span className="text-xs text-blue-600 ml-1">(Subscription)</span>
            ) : (
              <span className="text-xs text-green-600 ml-1">(Free)</span>
            )}
            {/* Link out to the streaming URL if available */}
            {opt.streamingUrl && (
              <a
                href={opt.streamingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-blue-600"
              >
                Watch
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
