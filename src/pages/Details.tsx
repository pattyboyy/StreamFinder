// src/pages/Details.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getContentDetails, getStreamingInfo } from '../services/api';
import { Movie } from '../types/movie';
import { StreamingInfo } from '../types/streaming';
import StreamingBadge from '../components/StreamingBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { useWatchlist } from '../context/WatchlistContext';
import Attribution from '@/components/Attribution';

export const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<Movie | null>(null);
  const [streamingInfo, setStreamingInfo] = useState<StreamingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const contentData = await getContentDetails(id, 'movie'); // Change to 'tv' if necessary
        const streamingData = await getStreamingInfo(id, contentData.type);
        setContent(contentData);
        setStreamingInfo(streamingData);
      } catch (err) {
        setError('Failed to fetch content details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!content) return null;

  const inWatchlist = isInWatchlist(content.id);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <img
            src={`https://image.tmdb.org/t/p/w500${content.posterPath}`}
            alt={content.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
          <p className="text-gray-600 mb-6">{content.overview}</p>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Streaming Options</h2>
            {streamingInfo?.providers.stream && streamingInfo.providers.stream.length > 0 ? (
              <div className="space-y-4">
                {streamingInfo.providers.stream.map((provider) => (
                  <StreamingBadge key={provider.id} provider={provider} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Not available for streaming</p>
            )}

            {/* Attribution Section */}
            {streamingInfo && (
              <Attribution />
            )}
          </div>
          <button
            onClick={() =>
              inWatchlist
                ? removeFromWatchlist(content.id)
                : addToWatchlist(content)
            }
            className={`btn-${inWatchlist ? 'secondary' : 'primary'} w-full`}
          >
            {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;
